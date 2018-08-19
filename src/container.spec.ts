import {Container} from "./container";
import * as assert from 'assert';
import {injectable} from "./decorators/injectable";

import 'reflect-metadata';
import {provide} from "./decorators/provide";

@injectable()
class Database {

}

@provide(Database)
@injectable()
class UserService {
    constructor(public db: Database) {
    }
}

describe('Container', () => {
    let container = Container.create([UserService]);


    it('should create User service', async function () {
        let us = await container.getMe(UserService);
        assert.ok(us.db);
    });
});