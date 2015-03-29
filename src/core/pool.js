export class Pool {
    /**
     * @param {Number} max
     * @param {Function} factory
     * @return {Pool}
     */
    static create(max, factory) {
        var pool = new Pool(factory);
        pool.setMaxResources(max);
        return pool;
    }

    /**
     * @param {Function} factory
     */
    constructor(factory) {
        this.factory = factory;
        this.maxResources = 1;
        this.resources = [];
    }

    /**
     * @private
     * @param {Number} max
     */
    setMaxResources(max) {
        this.maxResources = max;
    }

    /**
     * @private
     * @param {Function} onCreate
     */
    createResource(onCreate) {
        var next = resource => {
            this.resources.push(resource);
            onCreate(resource);
        };

        var done = resource => {
            var i = this.resource.findIndex(resource);
            this.resource.splice(i, 1);
        };

        process.nextTick(() => {
            this.factory(next, done);
        });
    }

    /**
     * @public
     * @return {Promise}
     */
    acquire() {
        return new Promise((resolve, reject) => {
            var i = this.resources.length;

            if (i < this.maxResources) {
                this.createResource(resolve);
            } else {
                resolve(this.resources[i * Math.random() | 0]);
            }
        });
    }
}
