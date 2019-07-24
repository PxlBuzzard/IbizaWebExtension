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
    params?: StringMap<string>;
}

export interface IFeatureGroup {
    label: string;
    features: IFeature[];
}

export interface IFeature {
    label: string;
    name: string;
    options?: string[];
    selected?: string;
}

export interface IDynamicFeatureGroup {
    label: string;
    prefix?: string;
    source: StringMap<string>;
}
