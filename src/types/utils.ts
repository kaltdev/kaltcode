// Stub — utility types not included in source snapshot

/**
 * Recursively makes all properties of T readonly.
 * Used for immutable message content handling.
 */
export type DeepImmutable<T> = T extends (infer R)[]
    ? ReadonlyArray<DeepImmutable<R>>
    : T extends object
      ? { readonly [K in keyof T]: DeepImmutable<T[K]> }
      : T;
