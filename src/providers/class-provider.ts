import {
    ConfigurableDependency,
    Dependency,
    IFactory,
    InjectableId,
    isConfigurableDependency,
    Provider
} from "./provider";
import {Constructor, IInjectable, IInjectableProp} from "../interfaces";
import {Container, ProviderNotFound} from "../container";
import {DEPENDENCIES, PROVIDERS} from "../symbols";
import {ProviderOptions} from "./provider-factory";
import {DistInjectError} from "../error";

class ProviderCache<T> {
    private cache = new Map<Container, T>();

    constructor(private dependencies: ConfigurableDependency[]) {
    }

    get(cont: Container) {
        let instance = this.cache.get(cont);
        if (instance) {
            for (let dep of this.dependencies) {
                if (cont.providersStorage.has(dep.injectId)) return null;
            }
            return instance;
        }
        if (cont.parent) return this.get(cont.parent);
        return null;
    }

    add(cont: Container, instance: T) {
        this.cache.set(cont, instance);
    }
}

export class CircularDependencyFound extends DistInjectError {
    circle: string[] = [];

    get message() {
        return this.circle.join(' -> ');
    }

    constructor(onClass: Constructor) {
        super();
        this.circle.push(onClass.name);
    }

    addToCircle(constructor: Constructor): CircularDependencyFound {
        this.circle.push(constructor.name);
        return this;
    }

}

export class ClassProvider<T = any> implements Provider<T>, IFactory<T> {
    protected cache: ProviderCache<T>;
    providers: ProviderOptions[];
    private dependencies: ConfigurableDependency[];
    private isResolvingDependencies: boolean = false;

    constructor(public injectId: InjectableId<T>,
                protected useClass: Constructor<T> & Partial<IInjectable>,
                protected singleton: boolean = true) {
        this.prepareProviders();
        this.dependencies = this.getDependencies();
        this.cache = new ProviderCache<T>(this.dependencies);
    }

    protected prepareProviders() {
        this.providers = this.useClass[PROVIDERS];
    }

    getMe(container: Container): T {
        if (this.singleton) {
            let cached = this.cache.get(container);
            if (cached) return cached;
        }
        return this.create(container);
    }

    create(container: Container): T {
        if (this.isResolvingDependencies) {
            throw new CircularDependencyFound(this.useClass);
        }
        if (this.providers) {
            container = container.createChild(this.providers);
        }
        try {
            this.isResolvingDependencies = true;
            let params = this.solveDependencies(container);
            this.isResolvingDependencies = false;
            let instance = new (this.useClass as Constructor<T>)(...params);
            this.cache.add(container, instance);
            return instance;
        } catch (e) {
            if (e instanceof CircularDependencyFound) {
                throw e.addToCircle(this.useClass);
            } else {
                throw e;
            }
        }
    }

    protected getDependencies(): ConfigurableDependency[] {
        let deps: Dependency[] = this.useClass[DEPENDENCIES] || (this.useClass as IInjectableProp).dependencies || [];
        return deps.map(dependency => isConfigurableDependency(dependency) ? dependency : {injectId: dependency})
    }

    protected solveDependencies<T>(container: Container) {
        let parameters = [];
        for (let dependency of this.dependencies) {
            let injectId: InjectableId;
            let optional: boolean = false;
            if (isConfigurableDependency(dependency)) {
                injectId = dependency.injectId;
                optional = dependency.optional;
            } else {
                injectId = dependency;
            }
            let parameter = container.getMe(injectId);
            if (!parameter) {
                if (optional) {
                    parameter = undefined;
                } else {
                    throw new ProviderNotFound(injectId);
                }
            }
            parameters.push(parameter);
        }
        return parameters;
    }
}