/**
 * A router instance that each <Router/> component creates.
 */
export class Instance {
    id = crypto.randomUUID();
    basePath;
    routes = [];
    #pre;
    #post;
    current = $state();
    navigating = $state(false);
    /**
     * Creates a new router instance.
     * @param {string} basePath (optional) The base path to navigate to.
     * @param {Route[]} routes The routes to navigate to.
     * @param {PreHooks} pre (optional) The pre hooks to run before navigating to a route.
     * @param {PostHooks} post (optional) The post hooks to run after navigating to a route.
     * @param {string} currentPath (optional) The current path to automaticallynavigate to.
     */
    constructor(basePath, routes, pre, post, currentPath) {
        this.basePath = basePath;
        this.routes = routes;
        if (currentPath) {
            this.current = this.get(currentPath);
        }
        this.#pre = pre;
        this.#post = post;
    }
    /**
     * Get the route for a given path.
     * @returns { Route } The route for the given path.
     */
    get(path) {
        let route;
        let pathToMatch = path;
        if (this.basePath && this.basePath !== "/") {
            pathToMatch = path.replace(this.basePath, "");
        }
        // If the path is the root path, return the root route:
        if (pathToMatch === "/") {
            route = this.routes.find((route) => route.path === "/");
        }
        // Split the path into the first segment and the rest:
        const [first, ...rest] = pathToMatch.replace(/^\//, "").split("/");
        route = this.routes.find((route) => route.path === first);
        // If the route is not found, try to find a route that matches at least part of the path:
        if (!route) {
            for (const r of this.routes) {
                const regexp = new RegExp(r.path);
                const match = regexp.exec(path);
                if (match) {
                    route = { ...r, params: match.groups || match.slice(1) };
                    break;
                }
            }
        }
        return route;
    }
    /**
     * Navigates to a given route, running  the pre and post hooks.
     * @param {Route} route The route to navigate to.
     * @returns {Promise<void>}
     */
    async run(route) {
        this.navigating = true;
        // First, run the global pre hooks.
        if (this.#pre) {
            if (Array.isArray(this.#pre)) {
                for (const pre of this.#pre) {
                    route = await pre(route);
                }
            }
            else {
                route = await this.#pre(route);
            }
        }
        // Then, run the route specific pre hooks.
        if (route && route.pre) {
            if (Array.isArray(route.pre)) {
                for (const pre of route.pre) {
                    const r = await pre(route);
                    if (r) {
                        route = r;
                    }
                }
            }
            else {
                const r = await route.pre(route);
                if (r) {
                    route = r;
                }
            }
        }
        // Then, set the current route and given `current` is
        // a reactive $state() variable, it will trigger a render:
        this.current = route;
        // Run the route specific post hooks:
        if (route && route.post) {
            if (Array.isArray(route.post)) {
                for (const post of route.post) {
                    await post(route);
                }
            }
            else {
                await route.post(route);
            }
        }
        // Finally, run the global post hooks:
        if (this.#post) {
            if (Array.isArray(this.#post)) {
                for (const post of this.#post) {
                    await post(route);
                }
            }
            else {
                await this.#post(route);
            }
        }
        this.navigating = false;
    }
}
/**
 * Sets up a new history watcher for a router instance.
 * @param {Instance} instance The router instance to setup the history watcher for.
 */
export const setupHistoryWatcher = (instance) => {
    const { pushState, replaceState } = window.history;
    if (!window.history._listenersAdded) {
        // Override pushState to dispatch a custom event
        window.history.pushState = function (...args) {
            pushState.apply(window.history, args);
            window.dispatchEvent(new Event("pushState"));
        };
        // Override replaceState to dispatch a custom event
        window.history.replaceState = function (...args) {
            replaceState.apply(window.history, args);
            window.dispatchEvent(new Event("replaceState"));
        };
        // Listen for custom pushState and replaceState events
        window.addEventListener("pushState", () => {
            instance.run(instance.get(location.pathname));
        });
        window.addEventListener("replaceState", () => {
            instance.run(instance.get(location.pathname));
        });
        // Listen for popstate event to detect forward and backward navigation
        window.addEventListener("popstate", () => {
            instance.run(instance.get(location.pathname));
        });
        window.history._listenersAdded = true;
    }
};
