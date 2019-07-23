export interface IConfiguration {
    version: string;
    environments: IEnvironment[];
    localExtensions: string[];
    featureGroups: IFeatureGroup[];
    dynamicFeatureGroups: IDynamicFeatureGroup[];
}

export interface IEnvironment {
    label: string;
    host: string;
    params?: IQueryParameter[];
}

export interface IQueryParameter {
    name: string;
    value: string;
}

export interface IFeatureGroup {
    label: string;
    features: IFeature[];
}

export interface IFeature {
    label: string;
    name: string;
    options?: string[];
}

export interface IDynamicFeatureGroup {
    label: string;
    source: StringMap<string>;
}