import { goto } from "./methods";
export class QueryString {
    params = $state();
    constructor() {
        this.params = Object.fromEntries(new URLSearchParams(window.location.search));
    }
    get(key, defaultValue) {
        return this.params[key] || defaultValue;
    }
    set(key, value) {
        this.params[key] = value;
    }
    delete(key) {
        delete this.params[key];
    }
    clear() {
        this.params = {};
    }
    toString() {
        return Object.entries(this.params)
            .map(([key, value]) => `${key}=${value}`)
            .join("&");
    }
    goto(path) {
        goto(path, this.params);
    }
}
