import { IHandlers } from "./handlers";

export type IHandlerDecorator<T extends Function = any> = (
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<T>
) => void;

export type Route = string | RegExp;

export type IRoutingRule<T extends Array<unknown>> = Readonly<{
    useWhen: (...props: T) => boolean;
}>;

export type ICompleteRoutingDecorator<T extends IHandlers> =
    (route?: Route | IRoutingRule<Parameters<T>>) => IHandlerDecorator<T>;

export type RoutingDecorator<T extends IHandlers> =
    (route?: IRoutingRule<Parameters<T>>) => IHandlerDecorator<T>;
