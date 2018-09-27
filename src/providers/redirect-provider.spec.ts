import {Container} from "../container";
import {ok} from "assert";

describe('redirect provider', function () {
    it('should replace dependency', function () {
        let conn = Container.create([
            {provide: Map, singleton: false, useClass: Map},
            WeakMap,
            {provide: Map, useProvider: WeakMap},
        ]);
        let m = conn.getMe(Map);
        ok(m instanceof WeakMap);
    });
});