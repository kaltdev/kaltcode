import type {
    ClassifiedCommit,
    CommitCategory,
    RiskLevel,
    SyncLane,
} from "./types.js";

function everyFile(
    files: string[],
    predicate: (file: string) => boolean,
): boolean {
    return files.length > 0 && files.every(predicate);
}

export function classifyCommit(input: {
    sha: string;
    subject: string;
    files: string[];
    authoredAt?: string;
}): ClassifiedCommit {
    const files = input.files;
    const normalizedSubject = input.subject.toLowerCase();
    const reasons: string[] = [];

    const docsOnly = everyFile(
        files,
        (file) => file.endsWith(".md") || file.startsWith("docs/"),
    );
    const testsOnly = everyFile(files, (file) =>
        /(^|\/).*(test|spec)\./.test(file),
    );
    const touchesPackage = files.some(
        (file) =>
            file === "package.json" ||
            file.endsWith("package-lock.json") ||
            file.endsWith("bun.lock") ||
            file.endsWith("bun.lockb"),
    );
    const touchesProvider = files.some(
        (file) =>
            file.includes("provider") ||
            file.includes("api/") ||
            file.includes("/api/") ||
            file.startsWith("src/services/api/"),
    );
    const touchesBranding =
        normalizedSubject.includes("brand") ||
        normalizedSubject.includes("openclaude") ||
        normalizedSubject.includes("rebrand") ||
        files.some(
            (file) =>
                file === "README.md" ||
                file.startsWith("docs/") ||
                file.startsWith("bin/") ||
                file === "package.json",
        );

    let category: CommitCategory = "unknown";
    let risk: RiskLevel = "medium";
    let lane: SyncLane = "intent_adaptation";

    if (
        docsOnly &&
        !normalizedSubject.includes("brand") &&
        !normalizedSubject.includes("openclaude") &&
        !normalizedSubject.includes("rebrand")
    ) {
        category = "docs";
        risk = "low";
        lane = "direct_apply";
        reasons.push("docs-only change");
    } else if (testsOnly) {
        category = "tests";
        risk = "low";
        lane = "direct_apply";
        reasons.push("test-only change");
    } else if (
        touchesPackage ||
        normalizedSubject.includes("release") ||
        normalizedSubject.includes("version")
    ) {
        category = "release";
        risk = "high";
        lane = "intent_adaptation";
        reasons.push("package or release metadata touched");
    } else if (touchesProvider) {
        category = "provider";
        risk = "high";
        lane = "intent_adaptation";
        reasons.push("provider or api surface touched");
    } else if (touchesBranding) {
        category = "branding";
        risk = "high";
        lane = "intent_adaptation";
        reasons.push("branding-sensitive surface touched");
    } else if (normalizedSubject.includes("feat")) {
        category = "feature";
        risk = "medium";
        lane = "intent_adaptation";
        reasons.push("feature-level change");
    } else if (normalizedSubject.includes("refactor")) {
        category = "refactor";
        risk = "medium";
        lane = "intent_adaptation";
        reasons.push("refactor change");
    } else if (normalizedSubject.includes("fix")) {
        category = "fix";
        risk = "medium";
        lane = "intent_adaptation";
        reasons.push("generic fix requires review");
    } else {
        category = "unknown";
        risk = "medium";
        lane = "intent_adaptation";
        reasons.push("unclassified upstream change");
    }

    return {
        sha: input.sha,
        shortSha: input.sha.slice(0, 7),
        subject: input.subject,
        authoredAt: input.authoredAt,
        files,
        category,
        risk,
        lane,
        reasons,
    };
}
