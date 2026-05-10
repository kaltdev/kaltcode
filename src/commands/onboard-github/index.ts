import type { Command } from "../../commands.js";

const onboardGithub: Command = {
<<<<<<< HEAD
    name: "onboard-github",
    aliases: ["onboarding-github", "onboardgithub", "onboardinggithub"],
    description:
        "Interactive setup for GitHub Models: device login or PAT, saved to secure storage",
    type: "local-jsx",
    load: () => import("./onboard-github.js"),
};
=======
  name: 'onboard-github',
  aliases: ['onboarding-github', 'onboardgithub', 'onboardinggithub'],
  description:
    'Interactive setup for GitHub Copilot: OAuth device login stored in secure storage',
  type: 'local-jsx',
  load: () => import('./onboard-github.js'),
}
>>>>>>> upstream/main

export default onboardGithub;
