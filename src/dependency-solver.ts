import {Constructor, IInjectable, IInjectableProp, IModule} from "./interfaces";
import {Dependency, InjectableId, isConfigurableDependency, Provider, ProvidersStorage} from "./providers";
import {DEPENDENCIES} from "./symbols";
import {ProviderNotFound} from "./container";

export class DependencySolver {
    constructor(protected storage: ProvidersStorage) {
    }

    getDependencies<T>(constructor: IInjectable<T>): Dependency[] {
        return constructor[DEPENDENCIES] || (constructor as IInjectableProp).dependencies || [];
    }


    solveDependencies<T>(useClass: Constructor<T> & Partial<IModule>) {
        let storage = this.storage;
        let dependencies = this.getDependencies(useClass as any);
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
            let provider = storage.get(injectId);
            if (!provider) {
                if (optional) {
                    provider = undefined;
                } else {
                    throw new ProviderNotFound(injectId);
                }
            }
            params.push(provider.getMe());
        }
        return params;
    }

    createChild(providers: Provider[]) {
        return new DependencySolver(this.storage.createChild(providers));
    }
}