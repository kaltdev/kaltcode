import type { Command } from '../../commands.js'
const feedback = {
  aliases: ['bug'],
  type: 'local-jsx',
  name: 'feedback',
<<<<<<< HEAD
  description: `Submit feedback about Kalt Code`,
  argumentHint: '[report]',
  isEnabled: () =>
    !(
      isEnvTruthy(process.env.KALT_CODE_USE_BEDROCK) ||
      isEnvTruthy(process.env.KALT_CODE_USE_VERTEX) ||
      isEnvTruthy(process.env.KALT_CODE_USE_FOUNDRY) ||
      isEnvTruthy(process.env.DISABLE_FEEDBACK_COMMAND) ||
      isEnvTruthy(process.env.DISABLE_BUG_COMMAND) ||
      isEssentialTrafficOnly() ||
      process.env.USER_TYPE === 'ant' ||
      !isPolicyAllowed('allow_product_feedback')
    ),
=======
  description: `Submit feedback about OpenClaude`,
  argumentHint: '[report]',
  isEnabled: () => false,
>>>>>>> upstream/main
  load: () => import('./feedback.js'),
} satisfies Command

export default feedback
