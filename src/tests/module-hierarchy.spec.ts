import 'reflect-metadata';
import {inject, injectable, provide} from "../decorators";
import {Container} from "../container";
import {ok} from "assert";

describe('module system hierarchy', function () {
    it('should reprovide service, when the dependency is reproviden', function () {
        @injectable()
        class Database {
            constructor(@inject('db-url')url: string) {
            }
        }

        @provide({provide: 'db-url', value: 'b'})
        class InnerService {
            constructor(public db: Database) {
            }
        }

        @provide({provide: 'db-url', value: 'a'}, Database, InnerService)
        class MainService {
            constructor(public db: Database, public is: InnerService) {
            }
        }

        let container = Container.create([MainService]);
        let main = container.getMe(MainService);
        ok(main);
        ok(main.db !== main.is.db, 'Database should be reproviden');
    });
});