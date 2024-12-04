export declare class QueryString {
    params: Record<string, string>;
    constructor();
    get<T>(key: string, defaultValue: T): T;
    set(key: string, value: string): void;
    delete(key: string): void;
    clear(): void;
    toString(): string;
    goto(path: string): void;
}
