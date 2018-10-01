import 'reflect-metadata';
import {inject, injectable, provide} from "./decorators";
import {Container, ProviderNotFound} from "./container";
import * as assert from "assert";
import {fail, ok} from "assert";

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

    it('should be created using create method', () => {
        let container = Container.create();
        ok(container);
    });

    it('should create User service', async function () {
        let us = await container.getMe(UserService);
        ok(us.db);
        ok(us.db.x == 'b');
        ok(us.db instanceof OtherDatabase);
        let otherDb: OtherDatabase = us.db as any;
        ok(otherDb.db instanceof Database);
        ok(otherDb.db === otherDb.db2);
    });

    it('should fail to provide missing dependency', async function () {
        try {
            await container.getMe(WithNonExistentDependency);
            fail('it should fail')
        } catch (e) {
            if (e instanceof ProviderNotFound == false) {
                throw e;
            }
        }
    });
});