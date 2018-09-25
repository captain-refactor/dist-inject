import {inject, injectable, provide} from "./decorators";
import {Container, ProviderNotFound} from "./container";
import 'reflect-metadata';
import * as assert from "assert";

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

@injectable()
class WithNonExistentDependency {
    constructor(@inject('non-existent') public nonExistent) {
    }
}

describe('Container', () => {
    let container = Container.create([UserService, Database, WithNonExistentDependency]);


    it('should create User service', async function () {
        let us = await container.getMe(UserService);
        assert.ok(us.db);
        assert.ok(us.db.x == 'b');
        assert.ok(us.db instanceof OtherDatabase);
        let otherDb: OtherDatabase = us.db as any;
        assert.ok(otherDb.db instanceof Database);
        assert.ok(otherDb.db === otherDb.db2);
    });

    it('should fail to provide missing dependency', async function () {
        try {
            let us = await container.getMe(WithNonExistentDependency);
            assert.fail('it should fail')
        } catch (e) {
            if (e instanceof ProviderNotFound == false) {
                throw e;
            }
        }
    });
});