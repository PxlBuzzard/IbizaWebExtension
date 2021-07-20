export interface IUrlComponents {
  origin: string;
  query: StringMap<string>;
  fragment?: string;
  testExtension?: string;
  sideloadUrl?: string;
}
