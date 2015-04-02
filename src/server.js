import express from "express";
import { createServer } from "http";
import { Observable } from "rx";
import { Server } from "ws";
import { bindRoutesToClient } from "./routing/websocket";

var app = express();
var server = createServer(app);

var wss = new Server({
    server: server
});

Observable.fromEvent(wss, "connection")
    .forEach(bindRoutesToClient);

export default server;
