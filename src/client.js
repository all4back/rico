import { Observable } from "rx";
import { Pool } from "./core/pool";
import { Socket } from "./core/socket";

export class Rico {
    /** @param {Object} opts */
    constructor(opts) {
        /** @type {Pool} */
        this.pool = Pool.create(1, function(next, done) {
            Socket.connect({
                host: opts.host,
                port: opts.port,
                onOpen: next,
                onClose: done
            })
        });
    }

    /**
     * @private
     * @param {String} method
     * @param {String} path
     * @param {Object} data
     * @param {Promise<Response>}
     */
    request(method, path, data) {
        return pool.acquire().then(conn => conn.send(
            { method, path, data }
        ));
    }

    /**
     * @public
     * @param {String} path
     * @param {Object} [where]
     * @return {Observable}
     */
    get(path, where=null) {
        var req = this.request("GET", path, {
            observe: true,
            where
        });

        return Observable.fromPromise(req).flatMap(
            res => res.observe()
        );
    }

    /**
     * @public
     * @param {String}
     * @param {Object} data
     * @return {Promise}
     */
    post(path, data) {
        return this.request("POST", path, data).then(
            res => res.val()
        );
    }

    /**
     * @public
     * @param {String} path
     * @param {Object} data
     * @return {Promise}
     */
    put(path, data) {
        return this.request("PUT", path, data).then(
            res => res.val()
        );
    }

    /**
     * @public
     * @param {String} path
     * @param {Object} data
     * @return {Promise}
     */
    patch(path, data) {
        return this.request("PATCH", path, data).then(
            res => res.val()
        );
    }

    /**
     * @public
     * @param {String} path
     * @param {Object} data
     * @return {Promise}
     */
    delete(path, data) {
        return this.request("DELETE", path, data).then(
            res => res.val()
        );
    }
}
