import {InjectableId} from "./provider";

export interface IMiddlewareProvider<T extends I = any, I = any> {
    provide: InjectableId<I>
}