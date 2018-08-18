import {
    ClassProvider, Constructor,
    InjectableId,
    Provider,
    ValueProvider
} from "./provider";
import {ProviderFactory, ProviderOptions} from "./provider-factory";

//TODO: manage already provided
export class Container {
    constructor(private providers: Provider[]) {

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
            return new provider.useClass(...params);
        }
    }

    private getDependencies(constructor: Constructor): InjectableId[] {
        return (constructor as any).injectableDependencies || [];
    }

    static create(providersOptions: ProviderOptions[]): Container {
        let factory = new ProviderFactory();
        let providers = providersOptions.map(value => factory.createProvider(value));
        return new Container(providers);
    }
}
