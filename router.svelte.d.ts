import { type Component } from "svelte";
import { Instance, type PostHooks, type PreHooks, type Route } from "./instance.svelte";
type Props = {
    basePath?: string;
    pre?: PreHooks;
    post?: PostHooks;
    routes: Route[];
    instance?: Instance;
};
declare const Router: Component<Props, {}, "instance">;
type Router = ReturnType<typeof Router>;
export default Router;
