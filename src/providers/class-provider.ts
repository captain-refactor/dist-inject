import {Dependency, IFactory, InjectableId, isConfigurableDependency, Provider} from "./provider";
import {Container, ProviderNotFound} from "../container";
import {Constructor, IInjectable} from "../interfaces";
import {DEPENDENCIES, PROVIDERS} from "../symbols";

export class ClassProvider<T extends I = I, I = any> implements Provider<T, I>, IFactory<T> {
    protected cached: T;

    constructor(public provide: InjectableId<I>,
                public useClass: Constructor<T>,
                public singleton: boolean = true) {
    }

    private getDependencies(constructor: Constructor & Partial<IInjectable>): Dependency[] {
        return constructor[DEPENDENCIES] || [];
    }

    getMe(container: Container): T {
        if (this.cached !== undefined && this.singleton) {
            return this.cached;
        }
        return this.create(container);
    }


    match(id: InjectableId<I>) {
        return this.provide == id;
    }

    create(container: Container): T {
        if (this.useClass[PROVIDERS]) {
            container = container.createChild(this.useClass[PROVIDERS]);
        }
        let dependencies = this.getDependencies(this.useClass);
        let params = [];
        for (let dependency of dependencies) {
            let injectId: InjectableId;
            let optional: boolean = false;
            if (isConfigurableDependency(dependency)) {
                injectId = dependency.injectId;
                optional = dependency.optional;
            } else {
                injectId = dependency;
            }
            let param = container.getMe(injectId);
            if (!param) {
                if (optional) {
                    param = undefined;
                } else {
                    throw new ProviderNotFound(injectId);
                }
            }
            params.push(param);
        }
        let instance = new this.useClass(...params);
        this.cached = instance;
        return instance;
    }
}