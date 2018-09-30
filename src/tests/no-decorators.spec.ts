import {Container} from "../container";
import {ok} from "assert";

class Service {
}

class SuperService {
    constructor(public service: Service) {
    }
}
(SuperService as any).dependencies = [Service];

class InheritedService extends SuperService {

}

describe('container', function () {
    it('should resolve dependencies without decorators and metadata', function () {
        let container = Container.create([Service, SuperService]);
        let superService = container.getMe(SuperService);
        ok(superService);
    });
    it('should create Inherited service, without dependency definitions', function () {
        let container = Container.create([Service, SuperService, InheritedService]);
        let result = container.getMe(InheritedService);
        ok(result);
        ok(result.service);
    });
});