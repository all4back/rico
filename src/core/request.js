import { Observable } from "rx";

/**
 * @param {Object} message
 * @return {Boolean}
 */
var isMethodOfType = function(type) {
    return message => message.method === type;
};

/**
 * @param {Object} message
 * @return {Boolean}
 */
export var isDelete = isMethodOfType("DELETE");

/**
 * @param {Object} message
 * @return {Boolean}
 */
export var isGet = isMethodOfType("GET");

/**
 * @param {Object} message
 * @return {Boolean}
 */
export var isPatch = isMethodOfType("PATCH");

/**
 * @param {Object} message
 * @return {Boolean}
 */
export var isPost = isMethodOfType("POST");

/**
 * @param {Object} message
 * @return {Boolean}
 */
export var isPut = isMethodOfType("PUT");

/**
 * @param {Object} message
 * @return {Promise}
 */
var handleRequest = function(message) {
    var { data, path } = message;
    var { collection, id } = parsePath(path);

    return pool.acquire().then(conn => {
        var query = r.table(collection);

        if (id !== null) {
            query = query.get(id);
        }

        return query;
    });
};

/**
 * @param {Object} message
 * @return {Promise}
 */
export var handleDelete = function(message) {
    return handleRequest(message)
        .then(query => query.delete().run(conn));
};

/**
 * @param {Object} message
 * @return {Observable}
 */
export var handleGet = function(message) {
    return Observable.fromPromise(
        handleRequest(message).then(query => query.changes().run(conn))
    ).flatMap(cursor => {
        return Observable.create(obs => {
            cursor.each(res => obs.onNext(res.new_val));
            return function() {
                cursor.close();
            };
        })
    });
};

/**
 * @param {Object} message
 * @return {Promise}
 */
export var handlePatch = function(message) {
    return handleRequest(message)
        .then(query => {
            return query
                .update(message.data, { returnChanges: true })
                .run(conn)
                .then(res => res.changes.map(obj => obj.new_val));
        });

};

/**
 * @param {Object} message
 * @return {Promise}
 */
export var handlePost = function(message) {
    return handleRequest(message)
        .then(query => {
            return query
                .insert(message.data, { returnChanges: true })
                .run(conn)
                .then(res => res.changes.map(obj => obj.new_val));
        });
};

/**
 * @param {Object} message
 * @return {Promise}
 */
export var handlePut = function(message) {
    return handleRequest(message)
        .then(query => {
            return query
                .replace(message.data, { returnChanges: true })
                .run(conn)
                .then(res => res.changes.map(obj => obj.new_val));
        });
};
