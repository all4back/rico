import uuid from "node-uuid";
import { Observable } from "rx";
import WebSocket, { Server } from "ws";
import { Socket } from "../../src/core/socket";

global.WebSocket = WebSocket;

const opts = {
    host: "localhost",
    port: 41935
};

var conn;
var server;

/**
 * @return {Observable}
 */
var observeConnection = function() {
    return Observable.fromEvent(server, "connection").first();
};

/**
 * @param {WebSocket} client
 * @return {Observable}
 */
var observeMessages = function(client) {
    return Observable.fromEvent(client, "message");
};

/** @param {Function} next */
export var setUp = function(next) {
    server = new Server(opts);
    server.once("listening", next);
};

/** @param {Function} next */
export var tearDown = function(next) {
    conn.close();
    conn = undefined;

    server.close();
    server = undefined;

    next();
};

export var testConnection = function(test) {
    conn = Socket.connect(opts);
    observeConnection().subscribe(
        () => test.done()
    );
};

export var testSend = function(test) {
    conn = Socket.connect(opts);

    Observable.fromEvent(conn.socket, "open")
        .first()
        .subscribe(() => conn.send({
            method: "GET",
            path: "/foo",
            data: null
        }));

    observeConnection()
        .flatMap(observeMessages)
        .first()
        .map(data => JSON.parse(data))
        .subscribe(message => {
            test.strictEqual(message.method, "GET");
            test.strictEqual(message.path, "/foo");
            test.strictEqual(message.data, null);
            test.done();
        });
};

export var testObserve = function(test) {
    conn = Socket.connect(opts);

    var messages = [
        { reqId: uuid.v4(), data: "foo" },
        { reqId: uuid.v4(), data: "bar" },
        { reqId: uuid.v4(), data: "baz" }
    ];

    var onNext = function(i, res) {
        test.strictEqual(res.val(), messages[i].data);

        if (i === messages.length - 1) {
            test.done();
        }
    };

    conn.callbacks.set(messages[0].reqId, onNext.bind(null, 0));
    conn.callbacks.set(messages[1].reqId, onNext.bind(null, 1));
    conn.callbacks.set(messages[2].reqId, onNext.bind(null, 2));

    observeConnection().subscribe(
        client => Observable.from(messages).subscribe(
            message => client.send(JSON.stringify(message))
        )
    );
};
