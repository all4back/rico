import express from "express";
import { createServer } from "http";
import { Observable } from "rx";
import { Server } from "ws";

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
} from "./core/request";

var config = [
    { predicate: isDelete, handler: handleDelete },
    { predicate: isGet, handler: handleGet },
    { predicate: isPatch, handler: handlePatch },
    { predicate: isPost, handler: handlePost },
    { predicate: isPut, handler: handlePut },
];

var bindWSRoutesToClient = function(client) {
    var messages$ = Observable.fromEvent(
        client, "message"
    );

    config.forEach(defn => {
        messages$.filter(defn.predicate)
            .flatMap(message => defn.handler(client, message))
            .forEach(response => client.send(JSON.stringify(response)));
    });
};

var app = express();
var server = createServer(app);

var wss = new Server({
    server: server
});

Observable.fromEvent(wss, "connection")
    .forEach(bindWSRoutesToClient);

export default server;
