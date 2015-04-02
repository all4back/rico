import { Observable } from "rx";

import {
    handleDelete,
    handleGet,
    handlePatch,
    handlePost,
    handlePut,
    isDelete,
    isGet,
    isPatch,
    isPost,
    isPut
} from "../core/db";

var config = [
    { predicate: isDelete, handler: handleDelete },
    { predicate: isGet, handler: handlerGet },
    { predicate: isPatch, handler: handlePatch },
    { predicate: isPost, handler: handlePost },
    { predicate: isPut, handler: handlePut },
];

export var bindRoutesToClient = function(client) {
    var messages$ = Observable.fromEvent(
        client, "message"
    );

    config.forEach(defn => {
        messages$.filter(defn.predicate)
            .flatMap(message => defn.handler(client, message))
            .forEach(response => client.send(JSON.stringify(response)));
    });
};
