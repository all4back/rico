import { parsePath } from "../../src/helpers/path";

export var testParsePath = function(test) {
    // Valid paths
    var a = parsePath("/foo");
    test.equal(a.collection, "foo");
    test.equal(a.id, undefined);

    var b = parsePath("/foo/bar");
    test.equal(b.collection, "foo");
    test.equal(b.id, "bar");

    var c = parsePath("/foo/123");
    test.equal(c.collection, "foo");
    test.equal(c.id, 123);

    var d = parsePath("foo");
    test.equal(d.collection, "foo");
    test.equal(d.id, undefined);

    var e = parsePath("foo/123");
    test.equal(e.collection, "foo");
    test.equal(e.id, 123);

    var f = parsePath("/foo/bar/");
    test.equal(f.collection, "foo");
    test.equal(f.id, "bar");

    var g = parsePath("foo/bar/");
    test.equal(g.collection, "foo");
    test.equal(g.id, "bar");

    // Invalid paths
    test.throws(function() {
        parsePath("/foo/bar/123");
    });

    test.throws(function() {
        parsePath("//foo");
    });

    test.done();
};
