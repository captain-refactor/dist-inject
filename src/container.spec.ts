import {Container} from "./container";
import * as assert from 'assert';
import {injectable} from "./decorators/injectable";

import 'reflect-metadata';
import {provide} from "./decorators/provide";

@injectable()
class Database {
    x = 'a';
}

@provide(Database)
@injectable()
class OtherDatabase {
    x = 'b';

    constructor(public db: Database, public db2: Database) {
    }
}

@provide({provide: Database, useClass: OtherDatabase})
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
        assert.ok(us.db.x == 'b');
        assert.ok(us.db instanceof OtherDatabase);
        let otherDb:OtherDatabase = us.db as any;
        assert.ok(otherDb.db instanceof Database);
        assert.ok(otherDb.db === otherDb.db2);
    });
});