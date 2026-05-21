import { spawnSync } from "child_process";
import sample from "lodash-es/sample.js";
import * as React from "react";
import { ExitFlow } from "../../components/ExitFlow.js";
import type { LocalJSXCommandOnDone } from "../../types/command.js";
import { isBgSession } from "../../utils/concurrentSessions.js";
import { gracefulShutdown } from "../../utils/gracefulShutdown.js";
import { getCurrentWorktreeSession } from "../../utils/worktree.js";
const GOODBYE_MESSAGES = [
    "Exiting aggressively.",
    "Evaporating softly.",
    "Unexisting...",
    "Leaving the simulation.",
    "Returning to the soup.",
    "Ceasing operations dramatically.",
    "Ejectulating.",
    "Fading into spaghetti.",
    "Collapsing the waveform.",
    "Rollbacking existence.",
    "Reticulating exits.",
    "Discombobulating goodbye.",
    "Yeeting the terminal.",
    "Powering down emotionally.",
    "Ghosting the kernel.",
    "Segfaulting respectfully.",
    "Leaving orbit.",
    "Shutting down the vibes.",
    "Booping out of existence.",
    "Rage quitting politely.",
    "Returning to /dev/null.",
    "Logoffmaxxing.",
    "Vacuuming the session.",
    "Going feral offline.",
    "Caught lacking in 4K.",
    "Muting reality indefinitely.",
    "Respawning somewhere else.",
    "Logging off the canon event.",
    "Ragequitting the dimension.",
    "Entering airplane mode spiritually.",
];
function getRandomGoodbyeMessage(): string {
    return sample(GOODBYE_MESSAGES) ?? "Goodbye!";
}
export async function call(
    onDone: LocalJSXCommandOnDone,
): Promise<React.ReactNode> {
    // Inside a `kalt-code --bg` tmux session: detach instead of kill. The REPL
    // keeps running; `kalt-code attach` can reconnect. Covers /exit, /quit,
    // ctrl+c, ctrl+d — all funnel through here via REPL's handleExit.
    if (false && isBgSession()) {
        onDone();
        spawnSync("tmux", ["detach-client"], {
            stdio: "ignore",
        });
        return null;
    }
    const showWorktree = getCurrentWorktreeSession() !== null;
    if (showWorktree) {
        return (
            <ExitFlow
                showWorktree={showWorktree}
                onDone={onDone}
                onCancel={() => onDone()}
            />
        );
    }
    onDone(getRandomGoodbyeMessage());
    await gracefulShutdown(0, "prompt_input_exit");
    return null;
}
