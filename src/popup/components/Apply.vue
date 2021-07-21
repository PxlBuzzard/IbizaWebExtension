<template>
  <section>
    <el-button id="apply-button" type="success" @click="apply">Apply</el-button>
  </section>
</template>

<script lang="ts">
import UrlParser from "../url/UrlParser";
import { IEnvironment, IExtension, IFeature, IFeatureGroup } from "../config/Schema";

/* eslint-disable @typescript-eslint/no-empty-function */
export default {
  name: "Apply",
  props: {
    config: {
      type: Object,
      default: () => {},
    },
    currentEnv: {
      type: String,
      default: "",
    },
    currentUrl: {
      type: Object,
      default: () => {},
    },
    localExtension: {
      type: String,
      default: "",
    },
    featureGroups: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    apply(props): void {
      let urlParser = new UrlParser();
      let env = props.config.environments.filter(
        (e: IEnvironment) => e.label === props.currentEnv,
      )[0];
      let localExtConfig = props.config.extensions.filter(
        (e: IExtension) => e.name === props.localExtension,
      )[0];
      let sideloadUrl = localExtConfig.environments.filter(
        (e: IEnvironment) => e.label === props.currentEnv,
      )[0].sideloadUrl;

      // add env stamps to URL
      let exts = props.config.extensions.map((ext: IExtension) => ext.environments);
      let extNames = props.config.extensions.map((ext: IExtension) => ext.name);
      let stampQueries: StringMap<string> = {};
      for (let i = 0; i < exts.length; i++) {
        let stamp = exts[i].filter((e: IEnvironment) => e.label === props.currentEnv)[0].stamp;
        if (stamp != undefined) {
          stampQueries[extNames[i]] = stamp;
        }
      }

      let finalQueries: StringMap<string> = {};
      props.featureGroups.forEach((group: IFeatureGroup) => {
        if (group.features != undefined) {
          group.features.forEach((query: IFeature) => {
            if (query.selected != undefined) {
              finalQueries[query.name] = query.selected;
            }
          });
        }
      });

      urlParser.setUrl({
        origin: `https://${env.host}`,
        query: { ...finalQueries, ...env.params, ...stampQueries },
        fragment: props.currentUrl.fragment,
        testExtension: props.localExtension,
        sideloadUrl,
      });
    },
  },
};
</script>

<style>
#apply-button {
  width: 90%;
  font-weight: 500;
  margin-bottom: 20px;
  margin-left: 8%;
}
</style>
