import type { Command } from '../../commands.js'

const status = {
  type: 'local-jsx',
  name: 'status',
  description:
<<<<<<< HEAD
    'Show Kalt Code status including version, model, account, API connectivity, and tool statuses',
=======
    'Show OpenClaude status including version, model, account, API connectivity, and tool statuses',
>>>>>>> upstream/main
  immediate: true,
  load: () => import('./status.js'),
} satisfies Command

export default status
