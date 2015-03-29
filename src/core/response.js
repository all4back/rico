import { BehaviorSubject } from "rx";

export class Response {
    /**
     * @param {*} value
     */
    constructor(value) {
        this.data = new BehaviorSubject(value);
    }

    /**
     * @param {*} value
     */
    setValue(value) {
        this.data.onNext(value);
    }

    /**
     * @return {Observable}
     */
    observe() {
        return this.data.asObservable();
    }

    /**
     * @return {*}
     */
    val() {
        return this.data.getValue();
    }
}
