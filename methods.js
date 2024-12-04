export const goto = (path, queryParams) => {
    const url = new URL(path, window.location.origin);
    if (queryParams) {
        Object.entries(queryParams).forEach(([key, value]) => {
            url.searchParams.set(key, value);
        });
    }
    window.history.pushState({}, "", url.toString());
};
export const query = (key) => {
    return new URLSearchParams(window.location.search).get(key);
};
