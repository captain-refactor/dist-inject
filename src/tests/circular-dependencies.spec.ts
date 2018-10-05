import {inject, injectable} from "../decorators";
import {Container} from "../container";
import {ok} from "assert";
import {DistInjectError} from "../error";
import 'reflect-metadata';

describe('Circular dependency protection', function () {
    it('should throw exception', function () {

        @injectable()
        class A {
            constructor(@inject('b') b) {

            }
        }

        @injectable()
        class B {
            constructor(@inject('a') a) {
            }
        }

        let cont = Container.create([{provide: 'a', useClass: A}, {provide: 'b', useClass: B}]);

        try {
            cont.getMe('a');
        } catch (e) {
            ok(e instanceof DistInjectError, 'exception should be instance of DistInjectError');
        }

    });
});