// Valid resource paths: /foo, /foo/bar
const RESOURCE_PATH = /^\/?[^\/]+(?:\/[^\/]+)?\/?$/;

/**
 * @param {String} path
 * @return {{ collection: String, id: ?String }}
 */
export var parsePath = function(path) {
    if (!RESOURCE_PATH.test(path)) {
        throw new Error(`Invalid resource path: "${path}"`);
    }

    if (path.charAt(0) === "/") {
        path = path.substring(1);
    }

    var [ collection, id ] = path.split("/");

    return { collection, id };
};
