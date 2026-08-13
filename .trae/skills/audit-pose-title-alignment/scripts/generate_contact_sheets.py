#!/usr/bin/env python3
"""Generate contact sheets for pose title alignment audits."""

from __future__ import annotations

import argparse
import json
import math
import os
import subprocess
import textwrap
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[4]
DEFAULT_OUTPUT = ROOT / ".tmp" / "pose_title_audit"


def load_poses(root: Path) -> list[dict]:
    script = """
const { combinePairPoses } = require('./utils/combinePairPoses');
console.log(JSON.stringify(combinePairPoses.map((pose) => ({
  id: pose.id,
  name: pose.name,
  tip: pose.tip,
  description: pose.description,
  badge: pose.badge,
  modelImage: pose.modelImage
}))));
"""
    result = subprocess.run(
        ["node", "-e", script],
        cwd=root,
        text=True,
        check=True,
        capture_output=True,
    )
    return json.loads(result.stdout)


def custom_number(pose: dict) -> int:
    stem = pose["modelImage"].split("/")[-1]
    return int(stem.split("_", 1)[0].replace("custom", ""))


def parse_range(value: str | None) -> tuple[int, int] | None:
    if not value:
        return None
    if "-" not in value:
        number = int(value.replace("custom", ""))
        return number, number
    start, end = value.split("-", 1)
    return int(start.replace("custom", "")), int(end.replace("custom", ""))


def find_font(size: int) -> ImageFont.ImageFont:
    candidates = [
        "/System/Library/Fonts/PingFang.ttc",
        "/System/Library/Fonts/Hiragino Sans GB.ttc",
        "/System/Library/Fonts/STHeiti Light.ttc",
        "/Library/Fonts/Arial Unicode.ttf",
    ]
    for candidate in candidates:
        if os.path.exists(candidate):
            return ImageFont.truetype(candidate, size)
    return ImageFont.load_default()


def fit_image(image: Image.Image, width: int, height: int) -> Image.Image:
    image = image.convert("RGB")
    image.thumbnail((width, height), Image.LANCZOS)
    canvas = Image.new("RGB", (width, height), "white")
    x = (width - image.width) // 2
    y = (height - image.height) // 2
    canvas.paste(image, (x, y))
    return canvas


def draw_wrapped(
    draw: ImageDraw.ImageDraw,
    text: str,
    xy: tuple[int, int],
    font: ImageFont.ImageFont,
    fill: str,
    width: int,
    max_lines: int,
    line_gap: int = 5,
) -> None:
    x, y = xy
    lines: list[str] = []
    for paragraph in text.splitlines():
        wrapped = textwrap.wrap(
            paragraph,
            width=max(4, width // max(1, int(font.size * 0.9))),
            break_long_words=True,
            replace_whitespace=False,
        )
        lines.extend(wrapped or [""])
    for line in lines[:max_lines]:
        draw.text((x, y), line, font=font, fill=fill)
        y += font.size + line_gap


def make_sheet(
    poses: list[dict],
    output_path: Path,
    columns: int,
    image_size: tuple[int, int],
    text_height: int,
) -> None:
    image_width, image_height = image_size
    gutter = 18
    pad = 14
    cell_width = image_width + pad * 2
    cell_height = image_height + text_height + pad * 2
    rows = math.ceil(len(poses) / columns)
    sheet = Image.new(
        "RGB",
        (columns * cell_width + (columns + 1) * gutter, rows * cell_height + (rows + 1) * gutter),
        "#f5f5f5",
    )
    draw = ImageDraw.Draw(sheet)
    font_title = find_font(22)
    font_body = find_font(18)
    font_small = find_font(16)

    for index, pose in enumerate(poses):
        row, col = divmod(index, columns)
        x = gutter + col * (cell_width + gutter)
        y = gutter + row * (cell_height + gutter)
        draw.rounded_rectangle((x, y, x + cell_width, y + cell_height), 10, fill="white", outline="#dddddd")

        local_image = pose["modelImage"].lstrip("/")
        if local_image.startswith("static/"):
            local_image = "assets/" + local_image[len("static/") :]
        image_path = ROOT / local_image
        if not image_path.exists():
            original = image_path
            for suffix in (".png", ".jpg", ".jpeg"):
                candidate = original.with_suffix(suffix)
                if candidate.exists():
                    image_path = candidate
                    break
        if not image_path.exists():
            image_path = ROOT / pose["modelImage"].lstrip("/")
        if not image_path.exists():
            original = image_path
            for suffix in (".png", ".jpg", ".jpeg"):
                candidate = original.with_suffix(suffix)
                if candidate.exists():
                    image_path = candidate
                    break

        try:
            fitted = fit_image(Image.open(image_path), image_width, image_height)
        except Exception:
            fitted = Image.new("RGB", image_size, "#eeeeee")
            error_draw = ImageDraw.Draw(fitted)
            error_draw.text((20, 20), "IMAGE MISSING", font=font_title, fill="#b00020")

        sheet.paste(fitted, (x + pad, y + pad))
        text_x = x + pad
        text_y = y + pad + image_height + 10
        pair_id = pose["modelImage"].split("/")[-1].replace("_demo.jpg", "").replace("_demo.png", "")
        draw.text((text_x, text_y), pair_id, font=font_small, fill="#666666")
        draw_wrapped(draw, pose["name"], (text_x, text_y + 22), font_title, "#111111", image_width, 2)
        excerpt = pose.get("description") or pose.get("tip") or ""
        draw_wrapped(draw, excerpt, (text_x, text_y + 74), font_body, "#333333", image_width, 3)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(output_path, quality=92)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--range", dest="custom_range", help="custom id range, e.g. 597-666")
    parser.add_argument("--per-sheet", type=int, default=24)
    parser.add_argument("--columns", type=int, default=4)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args()

    output_dir = args.output
    if not output_dir.is_absolute():
        output_dir = ROOT / output_dir

    poses = sorted(load_poses(ROOT), key=custom_number)
    selected_range = parse_range(args.custom_range)
    if selected_range:
        start, end = selected_range
        poses = [pose for pose in poses if start <= custom_number(pose) <= end]

    for sheet_index in range(0, len(poses), args.per_sheet):
        group = poses[sheet_index : sheet_index + args.per_sheet]
        first = custom_number(group[0])
        last = custom_number(group[-1])
        output_path = output_dir / f"pose_title_audit_custom{first:03d}_{last:03d}.jpg"
        make_sheet(group, output_path, args.columns, (260, 340), 145)
        print(output_path.relative_to(ROOT))


if __name__ == "__main__":
    main()
