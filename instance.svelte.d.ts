import type { Component, Snippet } from 'svelte';
export type PreHooks = ((route: Route) => Route)[] | ((route: Route) => Promise<Route>)[] | ((route: Route) => Route) | ((route: Route) => Promise<Route>);
export type PostHooks = ((route: Route) => void)[] | ((route: Route) => Promise<void>)[] | ((route: Route) => void) | ((route: Route) => Promise<void>);
export interface Route {
    path: RegExp | string;
    component?: Component<any> | Snippet | (() => Promise<Component<any> | Snippet>) | Function | any;
    props?: Record<string, any>;
    pre?: PreHooks;
    post?: PostHooks;
    children?: Route[];
    params?: string[] | Record<string, string>;
}
/**
 * A router instance that each <Router/> component creates.
 */
export declare class Instance {
    #private;
    id: `${string}-${string}-${string}-${string}-${string}`;
    basePath?: string;
    routes: Route[];
    current: Route;
    navigating: boolean;
    /**
     * Creates a new router instance.
     * @param {string} basePath (optional) The base path to navigate to.
     * @param {Route[]} routes The routes to navigate to.
     * @param {PreHooks} pre (optional) The pre hooks to run before navigating to a route.
     * @param {PostHooks} post (optional) The post hooks to run after navigating to a route.
     * @param {string} currentPath (optional) The current path to automaticallynavigate to.
     */
    constructor(basePath: string, routes: Route[], pre?: PreHooks, post?: PostHooks, currentPath?: string);
    /**
     * Get the route for a given path.
     * @returns { Route } The route for the given path.
     */
    get(path: string): Route | undefined;
    /**
     * Navigates to a given route, running  the pre and post hooks.
     * @param {Route} route The route to navigate to.
     * @returns {Promise<void>}
     */
    run(route: Route): Promise<void>;
}
/**
 * Sets up a new history watcher for a router instance.
 * @param {Instance} instance The router instance to setup the history watcher for.
 */
export declare const setupHistoryWatcher: (instance: Instance) => void;
