type SharedMutationWaiter = {
    testFileName: string;
    resolve: () => void;
};

type SharedMutationLockState = {
    locked: boolean;
    holder: string | undefined;
    queue: SharedMutationWaiter[];
};

const sharedMutationLockSymbol = Symbol.for("kaltcode.sharedMutationLock");

function getSharedMutationLockState(): SharedMutationLockState {
    const globalWithLock = globalThis as Record<
        symbol,
        SharedMutationLockState | undefined
    >;

    globalWithLock[sharedMutationLockSymbol] ??= {
        locked: false,
        holder: undefined,
        queue: [],
    };

    return globalWithLock[sharedMutationLockSymbol] as SharedMutationLockState;
}

export async function acquireSharedMutationLock(
    testFileName: string,
): Promise<void> {
    const state = getSharedMutationLockState();

    if (!state.locked) {
        state.locked = true;
        state.holder = testFileName;
        return;
    }

    await new Promise<void>((resolve) => {
        state.queue.push({ testFileName, resolve });
    });
}

export function releaseSharedMutationLock(): void {
    const state = getSharedMutationLockState();

    if (!state.locked) {
        return;
    }

    const next = state.queue.shift();
    if (!next) {
        state.locked = false;
        state.holder = undefined;
        return;
    }

    state.holder = next.testFileName;
    next.resolve();
}
