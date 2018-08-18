import {Container} from "./container";
import * as assert from 'assert';
import {injectable} from "./decorators/injectable";

import 'reflect-metadata';

@injectable()
class Database {

}

@injectable()
class UserService {
    constructor(public db: Database) {
    }
}

describe('Container', () => {
    let container = Container.create([UserService, Database]);


    it('should create User service', async function () {
        let us = await container.getMe(UserService);
        assert.ok(us.db);
    });
});