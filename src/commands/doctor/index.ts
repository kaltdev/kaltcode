import type { Command } from '../../commands.js'
import { isEnvTruthy } from '../../utils/envUtils.js'

const doctor: Command = {
  name: 'doctor',
<<<<<<< HEAD
  description: 'Diagnose and verify your Kalt Code installation and settings',
=======
  description: 'Diagnose and verify your OpenClaude installation and settings',
>>>>>>> upstream/main
  isEnabled: () => !isEnvTruthy(process.env.DISABLE_DOCTOR_COMMAND),
  type: 'local-jsx',
  load: () => import('./doctor.js'),
}

export default doctor
