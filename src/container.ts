import {
    ClassProvider,
    ConfigurableDependency,
    Dependency,
    InjectableId,
    isConfigurableDependency,
    Provider,
    ValueProvider
} from "./provider";
import {ProviderFactory, ProviderOptions} from "./provider-factory";
import {Constructor, IInjectable, IModule} from "./interfaces";
import {DEPENDENCIES, PROVIDERS} from "./symbols";


export class ProviderNotFound extends Error {
    constructor(public injectableId: InjectableId) {
        super(`Provider for: ${injectableId} not found`);
    }

}

export class Container {
    constructor(private providers: Provider[], private factory: ProviderFactory, private parent?: Container) {
        this.providers.push(new ValueProvider(Container, this));
    }

    static create(providersOptions: ProviderOptions[], parent?: Container): Container {
        let factory = new ProviderFactory();
        let providers = providersOptions.map(value => factory.createProvider(value));
        return new Container(providers, factory, parent);
    }

    async getProvider<T>(id: InjectableId<T>): Promise<Provider<T, any>> {
        for await (let provider of this.providers) {
            if (provider.provide == id) return provider;
        }
    }

    async getMe<T>(id: InjectableId<T>): Promise<T> {
        let provider = await this.getProvider(id);
        if (!provider) return null;
        if (provider instanceof ValueProvider) {
            return provider.value;
        }
        if (provider instanceof ClassProvider) {
            let value: T = await this.constructInstance(provider.useClass);
            if (provider.singleton) {
                let index = this.providers.indexOf(provider);
                this.providers[index] = this.factory.createProvider({provide: id, value});
            }
            return value;
        }
        if (this.parent) {
            return await this.parent.getMe(id);
        }
        return undefined;
    }

    async constructInstance<T>(constructor: Constructor<T> & Partial<IModule & InjectableId>): Promise<T> {
        let container: Container = this;
        let providers = constructor[PROVIDERS];
        if (providers) container = Container.create(providers, this);
        let dependencies = this.getDependencies(constructor);
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
            let param = await container.getMe(injectId);
            if (!param) {
                if (optional) {
                    param = undefined;
                } else {
                    throw new ProviderNotFound(injectId);
                }
            }
            params.push(param);
        }
        return new (constructor as Constructor)(...params);
    }

    private getDependencies(constructor: Constructor & Partial<IInjectable>): Dependency[] {
        return constructor[DEPENDENCIES] || [];
    }
}
