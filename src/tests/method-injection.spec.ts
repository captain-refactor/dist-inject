import {injectable} from "../decorators";
import {Container} from "../container";

describe('method injection', function () {
    it('should call method with injected parameters', function () {
        class Test {

            @injectable()
            getDouble(x: number) {
                return 2 * x;
            }
        }

        let conn = Container.create([Test]);
    });
});