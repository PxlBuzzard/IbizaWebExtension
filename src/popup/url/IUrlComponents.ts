export type StringMap<T> = { [key: string]: T };

export interface IUrlComponents {
    origin: string;
    query: StringMap<string>;
    fragment?: string;
    testExtension?: string;
}