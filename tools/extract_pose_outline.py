#!/usr/bin/env python3
"""
Extract a posture guide from a person photo.

This script is intentionally structured as a pipeline:
1. segment_person: produce a person mask
2. build_clean_guide: convert the mask/reference image into a product guide
3. export: write PNG/SVG/JSON assets that the mini program can render

The default segmenter is OpenCV GrabCut so the script runs locally without model
files. For production-quality results, replace segment_person() with MODNet,
SAM/SAM2, MediaPipe ImageSegmenter, or another person segmentation model.
"""

import argparse
import json
from pathlib import Path

import cv2
import numpy as np


def parse_args():
  parser = argparse.ArgumentParser()
  parser.add_argument("image", help="Input person photo")
  parser.add_argument("--out-dir", default="assets/extracted", help="Output directory")
  parser.add_argument("--id", default="extracted_pose", help="Template id")
  parser.add_argument("--mode", choices=["mask", "guide"], default="guide")
  return parser.parse_args()


def segment_person(image):
  """Fallback segmentation. Replace this with a real model for better quality."""
  height, width = image.shape[:2]
  mask = np.zeros((height, width), np.uint8)
  rect = (
    int(width * 0.04),
    int(height * 0.16),
    int(width * 0.92),
    int(height * 0.80),
  )
  bgd = np.zeros((1, 65), np.float64)
  fgd = np.zeros((1, 65), np.float64)
  cv2.grabCut(image, mask, rect, bgd, fgd, 8, cv2.GC_INIT_WITH_RECT)
  mask = np.where((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD), 255, 0).astype("uint8")

  kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))
  mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel, iterations=2)
  mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel, iterations=1)

  count, labels, stats, _ = cv2.connectedComponentsWithStats(mask, 8)
  if count > 1:
    largest = 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA])
    mask = np.where(labels == largest, 255, 0).astype("uint8")
  return mask


def contour_path_from_mask(mask, simplify=0.003):
  contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
  if not contours:
    raise RuntimeError("No contour found in mask")
  contour = max(contours, key=cv2.contourArea)
  epsilon = simplify * cv2.arcLength(contour, True)
  approx = cv2.approxPolyDP(contour, epsilon, True)
  points = approx.reshape(-1, 2)
  parts = [f"M {int(points[0][0])} {int(points[0][1])}"]
  parts += [f"L {int(x)} {int(y)}" for x, y in points[1:]]
  parts.append("Z")
  return " ".join(parts), points


def export_assets(image, mask, template_id, out_dir, source_path):
  height, width = image.shape[:2]
  out_dir.mkdir(parents=True, exist_ok=True)
  outline_path, points = contour_path_from_mask(mask)

  overlay = image.copy()
  alpha = (mask / 255.0 * 0.26)[..., None]
  overlay = (overlay * (1 - alpha) + np.full_like(image, 255) * alpha).astype(np.uint8)
  cv2.polylines(overlay, [points], True, (255, 255, 255), 4, cv2.LINE_AA)

  rgba = np.zeros((height, width, 4), np.uint8)
  rgba[..., :3] = 255
  rgba[..., 3] = (mask * 0.36).astype(np.uint8)
  cv2.polylines(rgba, [points], True, (255, 255, 255, 220), 4, cv2.LINE_AA)

  overlay_path = out_dir / f"{template_id}_overlay.png"
  silhouette_path = out_dir / f"{template_id}_silhouette.png"
  svg_path = out_dir / f"{template_id}.svg"
  json_path = out_dir / f"{template_id}_template.json"

  cv2.imwrite(str(overlay_path), overlay)
  cv2.imwrite(str(silhouette_path), rgba)

  svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" width="{width}" height="{height}">
  <path d="{outline_path}" fill="rgba(255,255,255,0.22)" stroke="rgba(255,255,255,0.72)" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>
</svg>
"""
  svg_path.write_text(svg, encoding="utf-8")

  template = {
    "id": template_id,
    "source": str(source_path),
    "viewBox": [0, 0, width, height],
    "type": "mask_outline_fallback",
    "guideImage": f"/{silhouette_path.as_posix()}",
    "outlinePath": outline_path,
    "notes": "Generated with GrabCut fallback. Replace segment_person() with a real segmentation model for production use.",
  }
  json_path.write_text(json.dumps(template, ensure_ascii=False, indent=2), encoding="utf-8")

  return overlay_path, silhouette_path, svg_path, json_path


def main():
  args = parse_args()
  image_path = Path(args.image)
  image = cv2.imread(str(image_path))
  if image is None:
    raise SystemExit(f"Cannot read image: {image_path}")

  mask = segment_person(image)
  outputs = export_assets(image, mask, args.id, Path(args.out_dir), image_path)
  for path in outputs:
    print(path)


if __name__ == "__main__":
  main()
