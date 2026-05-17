type SharedMutationWaiter = {
    testFileName: string;
    resolve: () => void;
    timeout: ReturnType<typeof setTimeout> | undefined;
    settled: boolean;
};

type SharedMutationLockController = {
    acquire: (testFileName: string, timeoutMs?: number) => Promise<void>;
    release: () => void;
};

type SharedMutationLockOptions = {
    defaultTimeoutMs: number;
};

type SharedMutationLockState = {
    locked: boolean;
    holder: string | undefined;
    queue: SharedMutationWaiter[];
};

export const DEFAULT_SHARED_MUTATION_LOCK_TIMEOUT_MS = 5 * 60 * 1000;

function createSharedMutationLockState(): SharedMutationLockState {
    return {
        locked: false,
        holder: undefined,
        queue: [],
    };
}

function createSharedMutationLockTimeoutError(
    testFileName: string,
    timeoutMs: number,
    holder: string | undefined,
): Error {
    return new Error(
        `Timed out waiting for shared mutation lock for "${testFileName}" after ${timeoutMs}ms. Current holder: ${holder ?? "unknown"}.`,
    );
}

function removeSharedMutationWaiter(
    state: SharedMutationLockState,
    waiter: SharedMutationWaiter,
): void {
    const index = state.queue.indexOf(waiter);
    if (index !== -1) {
        state.queue.splice(index, 1);
    }
}

function settleSharedMutationWaiter(
    waiter: SharedMutationWaiter,
    action: () => void,
): void {
    if (waiter.settled) {
        return;
    }

    waiter.settled = true;
    if (waiter.timeout !== undefined) {
        clearTimeout(waiter.timeout);
    }

    action();
}

function createSharedMutationLock(
    state: SharedMutationLockState,
    options: SharedMutationLockOptions,
): SharedMutationLockController {
    return {
        async acquire(
            testFileName: string,
            timeoutMs: number = options.defaultTimeoutMs,
        ): Promise<void> {
            if (!state.locked) {
                state.locked = true;
                state.holder = testFileName;
                return;
            }

            await new Promise<void>((resolve, reject) => {
                let waiter: SharedMutationWaiter;

                waiter = {
                    testFileName,
                    resolve: () => {
                        settleSharedMutationWaiter(waiter, resolve);
                    },
                    timeout: undefined,
                    settled: false,
                };

                waiter.timeout = setTimeout(() => {
                    settleSharedMutationWaiter(waiter, () => {
                        removeSharedMutationWaiter(state, waiter);
                        reject(
                            createSharedMutationLockTimeoutError(
                                testFileName,
                                timeoutMs,
                                state.holder,
                            ),
                        );
                    });
                }, timeoutMs);

                state.queue.push(waiter);
            });
        },
        release(): void {
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
        },
    };
}

export function createSharedMutationLockForTesting(
    defaultTimeoutMs = DEFAULT_SHARED_MUTATION_LOCK_TIMEOUT_MS,
): SharedMutationLockController {
    return createSharedMutationLock(createSharedMutationLockState(), {
        defaultTimeoutMs,
    });
}

const sharedMutationLockSymbol = Symbol.for("kaltcode.sharedMutationLock");

function getSharedMutationLockState(): SharedMutationLockState {
    const globalWithLock = globalThis as Record<
        symbol,
        SharedMutationLockState | undefined
    >;

    globalWithLock[sharedMutationLockSymbol] ??=
        createSharedMutationLockState();

    return globalWithLock[sharedMutationLockSymbol] as SharedMutationLockState;
}

const globalSharedMutationLock = createSharedMutationLock(
    getSharedMutationLockState(),
    {
        defaultTimeoutMs: DEFAULT_SHARED_MUTATION_LOCK_TIMEOUT_MS,
    },
);

export async function acquireSharedMutationLock(
    testFileName: string,
    timeoutMs?: number,
): Promise<void> {
    await globalSharedMutationLock.acquire(testFileName, timeoutMs);
}

export function releaseSharedMutationLock(): void {
    globalSharedMutationLock.release();
}
