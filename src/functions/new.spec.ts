import {New} from "./new";
import {ok} from "assert";
import {CONTAINER} from "../global-instance";

describe('new function', () => {
    it('should provide instance', async function () {
        CONTAINER.provide({provide: Date, singleton: false, useClass: Date});
        ok(New(Date));
    });

    it('singleton instances are singleton', async function () {
        CONTAINER.provide({provide: Object, useClass: Object});
        ok(New(Object) === New(Object));
    });

    it('not singleton instances are unique', async function () {
        CONTAINER.provide({provide: Object, singleton: false, useClass: Object});
        ok(New(Object) !== New(Object));
    });

});