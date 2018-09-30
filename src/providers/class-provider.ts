import {IFactory, InjectableId, Provider} from "./provider";
import {Constructor} from "../interfaces";
import {DependencySolver} from "../dependency-solver";
import {injectable} from "../decorators";

@injectable()
export class ClassProvider<T extends I = I, I = any> implements Provider<T, I>, IFactory<T> {
    protected cached: T;

    constructor(protected provide: InjectableId<I>,
                protected useClass: Constructor<T>,
                protected dependencySolver: DependencySolver,
                protected singleton: boolean = true) {
    }

    getMe(): T {
        if (this.cached !== undefined && this.singleton) {
            return this.cached;
        }
        return this.create();
    }


    match(id: InjectableId<I>) {
        return this.provide == id;
    }

    create(): T {
        let params = this.dependencySolver.solveDependencies(this.useClass);
        let instance = new this.useClass(...params);
        this.cached = instance;
        return instance;
    }
}