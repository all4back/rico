import uuid from "node-uuid";
import { Observable } from "rx";
import { Response } from "./response";

export class Socket {
    /**
     * @param {Object} opts
     * @return {Socket}
     */
    static connect(opts) {
        return new Socket(opts);
    }

    /** @param {Object} opts */
    constructor(opts) {
        this.opts = opts;
        this.socket = new WebSocket(`ws://${opts.host}:${opts.port}`);
        this.callbacks = new Map();
        this.observe();
    }

    observe() {
        var open$ =
            Observable.fromEvent(this.socket, "open")
                .first();

        var close$ =
            Observable.fromEvent(this.socket, "close")
                .first();

        var messages$ =
            Observable.fromEvent(this.socket, "message")
                .takeUntil(close$)
                .map(evt => evt.data)
                .filter(data => this.callbacks.has(data.reqId));

        if (this.opts.onOpen) {
            open$.subscribe(this.opts.onOpen);
        }

        if (this.opts.onClose) {
            close$.subscribe(this.opts.onClose);
        }

        messages$.forEach(
            message => {
                var callback = this.callbacks.get(message.reqId);
                this.callbacks.delete(message.reqId);
                callback(message.data);
            }
        );
    }

    /**
     * @return {Promise<Response>}
     */
    send(opts) {
        return new Promise((resolve, reject) => {
            if (this.socket.readyState !== WebSocket.OPEN) {
                reject();
                return;
            }

            var reqId = uuid.v4();

            this.socket.send(
                JSON.stringify(
                    Object.assign({ reqId }, opts)
                )
            );

            this.callbacks.set(reqId, resolve);
        });
    }
}
