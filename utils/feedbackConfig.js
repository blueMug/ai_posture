const FEEDBACK_FORM_URL = 'https://wj.qq.com/s2/27083835/710d/'

const getFeedbackFormUrl = () => FEEDBACK_FORM_URL.trim()

const isFeedbackFormConfigured = () => /^https:\/\//.test(getFeedbackFormUrl())

module.exports = {
  getFeedbackFormUrl,
  isFeedbackFormConfigured
}
