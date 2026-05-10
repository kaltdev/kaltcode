import type { Command } from '../../commands.js'

const buddy = {
  type: 'local-jsx',
  name: 'buddy',
<<<<<<< HEAD
  description: 'Hatch, pet, and manage your Kalt Code companion',
=======
  description: 'Hatch, pet, and manage your OpenClaude companion',
>>>>>>> upstream/main
  immediate: true,
  argumentHint: '[status|mute|unmute|help]',
  load: () => import('./buddy.js'),
} satisfies Command

export default buddy
