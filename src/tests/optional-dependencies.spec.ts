import {inject, injectable, optional} from "../decorators";
import {Container} from "../container";
import * as assert from "assert";

@injectable()
class OptionalDependency {
    x = 'x';
}

@injectable()
class Main {
    constructor(@optional() @inject('optional') public optional = {x: 'default'}) {
    }
}


describe('Optional dependencies', function () {
    it('should provide optional dependecy', async function () {
        let container = Container.create([{provide: 'optional', useClass: OptionalDependency}, Main]);
        let main = await container.getMe(Main);
        assert.ok(main);
        assert.ok(main.optional instanceof OptionalDependency);
    });

    it('should provide undefined for optional dependency', async function () {
        let container = Container.create([Main]);
        let main = await container.getMe(Main);
        assert.ok(main);
        assert.strict.equal(main.optional.x, 'default');
    });
});

