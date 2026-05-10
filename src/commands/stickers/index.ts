import type { Command } from '../../commands.js'

const stickers = {
  type: 'local',
  name: 'stickers',
<<<<<<< HEAD
  description: 'Order Kalt Code stickers',
=======
  description: 'Order OpenClaude stickers',
>>>>>>> upstream/main
  supportsNonInteractive: false,
  load: () => import('./stickers.js'),
} satisfies Command

export default stickers
