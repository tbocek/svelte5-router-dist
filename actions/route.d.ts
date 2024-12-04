/**
 * Svelte action to handle routing.
 * Add `use:route` to an anchor element to handle routing.
 * @param node - The anchor element to handle.
 * @returns - The destroy function.
 */
export declare function route(node: HTMLAnchorElement): {
    destroy(): void;
};
