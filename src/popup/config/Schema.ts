export interface IConfigFile {
  version: string;
  help: string;
  changelog: IChangelog[];
  configs: IConfiguration[];
}

export interface IConfiguration {
  name: string;
  environments: IEnvironment[];
  extensions: IExtension[];
  featureGroups: IFeatureGroup[];
  dynamicFeatureGroups?: IDynamicFeatureGroup[];
}

export interface IEnvironment {
  label: string;
  host: string;
  sideloadUrl?: string;
  stamp?: string;
  params?: StringMap<string>;
}

export interface IExtension {
  name: string;
  environments: IEnvironment[];
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

export interface IChangelog {
  version: string;
  date: string;
  notes: string;
}
