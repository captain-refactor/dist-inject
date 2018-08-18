import {
    ClassProvider, InjectableId,
    Provider,
    ValueProvider
} from "./provider";
import {ProviderFactory, ProviderOptions} from "./provider-factory";
import {Constructor, IInjectable} from "./interfaces";
import {DEPENDENCIES} from "./symbols";

export class Container {
    constructor(private providers: Provider[], private factory: ProviderFactory, private parent?: Container) {

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
        if (provider instanceof ValueProvider) {
            return provider.value;
        }
        if (provider instanceof ClassProvider) {
            let dependencies = this.getDependencies(provider.useClass);
            let params = [];
            for (let parameter of dependencies) {
                let param = await this.getMe(parameter);
                params.push(param);
            }
            let value = new provider.useClass(...params);
            if (provider.singleton) {
                let index = this.providers.indexOf(provider);
                this.providers[index] = this.factory.createProvider({provide: id, value});
            }
            return value;
        }
        if (this.parent) {
            return await this.parent.getMe(id);
        }
    }

    private getDependencies(constructor: Constructor & Partial<IInjectable>): InjectableId[] {
        return constructor[DEPENDENCIES] || [];
    }
}
