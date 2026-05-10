import type { Command } from '../../commands.js'

const stats = {
  type: 'local-jsx',
  name: 'stats',
<<<<<<< HEAD
  description: 'Show your Kalt Code usage statistics and activity',
=======
  description: 'Show your OpenClaude usage statistics and activity',
>>>>>>> upstream/main
  load: () => import('./stats.js'),
} satisfies Command

export default stats
