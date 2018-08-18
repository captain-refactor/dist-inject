import {InjectableId} from "./provider";
import {Container} from "./container";
import * as assert from 'assert';

class Database {

}

class UserService {
    static injectableDependencies: InjectableId[] = [Database];

    constructor(public db: Database) {
    }
}

describe('Container', () => {
    let container = Container.create([UserService, Database]);

    it('should create class with all dependencies', async function () {
        let us = await container.getMe(UserService);
        assert.ok(us.db);
    });
});