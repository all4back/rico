// Valid resource paths: /foo, /foo/bar
const RESOURCE_PATH = /^\/[^\/]+(?:\/[^\/]+)?$/;

/**
 * @param {String} path
 * @return {{ collection: String, id: ?String }}
 */
export var parsePath = function(path) {
    if (!RESOURCE_PATH.test(path)) {
        throw new Error(`Invalid resource path: "${path}"`);
    }

    var [ collection, id ] = path.split("/").slice(1);

    return { collection, id };
};
