import {
    IHandlerDecorator,
    IHandlers
} from "../../interfaces";

/**
 * Helper to combine a couple of decorators into a single one
 */
export const combineHandlerDecorators = <T extends IHandlers>(
    ...decorators: IHandlerDecorator<T>[]
): IHandlerDecorator<T> => {
    return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) => {
        decorators.forEach(decorator => decorator(target, propertyKey, descriptor));
    };
};
