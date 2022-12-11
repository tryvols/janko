export const assertNever = (value: never, error?: string): never => {
    throw new Error(error || `Value ${value} should be handled!`);
};
