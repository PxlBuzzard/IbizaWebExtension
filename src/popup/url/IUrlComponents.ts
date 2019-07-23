export type StringMap<T> = { [key: string]: T };

export interface IUrlComponents {
    host: string;
    queries: StringMap<string>;
    location?: string;
    testExtension?: string;
}