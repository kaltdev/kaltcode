export const KALT_SYNC_DIR = ".kalt-sync";
export const STATE_FILE = "state.json";
export const QUEUE_FILE = "queue.json";
export const REPORTS_DIR = "reports";
export const RELEASES_DIR = "releases";

export const PROTECTED_BRANDING_PATTERNS = [
    "@kaltdev/kalt-code",
    "kalt-code",
    "https://github.com/kaltdev/kaltcode",
    "@kaltdev",
] as const;

export const FORBIDDEN_UPSTREAM_BRANDING = [
    "openclaude",
    "OpenClaude",
    "Gitlawb/openclaude",
    "@openclaude",
] as const;
