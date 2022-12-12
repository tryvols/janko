/**
 * This helper allows clone metadata from source to target.
 * 
 * @param source entity which is metadata source
 * @param target entity which is metadata target
 */
export const cloneMetadataFrom = (source: unknown) => {
    const to = (target: unknown) => {
        Reflect.getOwnMetadataKeys(source).forEach(key => {
            const value = Reflect.getOwnMetadata(key, source);
            Reflect.defineMetadata(key, value, target);
        });
    };

    return {to};
};
