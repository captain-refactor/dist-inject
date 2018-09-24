import {New} from "./new";
import {ok} from "assert";
import {CONTAINER} from "../global-instance";

describe('new function', () => {

    it('should create instance', async function () {
        CONTAINER.provide({provide: Date, singleton: false, useClass: Date});
        ok(New(Date));
    });
});