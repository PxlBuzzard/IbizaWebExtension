<template>
  <section>
    <el-button id="apply-button" type="success" @click="apply">Apply</el-button>
  </section>
</template>

<script lang="ts">
import UrlParser from "../url/UrlParser";
import { IConfiguration, IFeatureGroup } from "../config/Schema";
import { PropType } from "vue";

export default {
  name: "Apply",
  props: {
    config: {
      type: Object as PropType<IConfiguration>,
      required: true,
    },
    currentEnv: {
      type: String,
      default: "",
    },
    currentUrl: {
      type: Object,
      required: true,
    },
    localExtension: {
      type: String,
      default: "",
    },
    featureGroups: {
      type: Array as PropType<IFeatureGroup[]>,
      required: true,
    },
  },
  setup(props) {
    function apply(): void {
      const urlParser = new UrlParser();
      console.log(props.config.environments);
      console.log(props.currentEnv);
      const env = props.config.environments.filter((e) => e.label === props.currentEnv)[0];
      const localExtConfig = props.config.extensions.filter(
        (e) => e.name === props.localExtension,
      )[0];
      const sideloadUrl = localExtConfig?.environments.filter(
        (e) => e.label === props.currentEnv,
      )[0]?.sideloadUrl;

      // add env stamps to URL
      const exts = props.config.extensions.map((ext) => ext.environments);
      const extNames = props.config.extensions.map((ext) => ext.name);
      let stampQueries: StringMap<string> = {};
      for (let i = 0; i < exts.length; i++) {
        let stamp = exts[i].filter((e) => e.label === props.currentEnv)[0]?.stamp;
        if (stamp != undefined) {
          stampQueries[extNames[i]] = stamp;
        }
      }

      let finalQueries: StringMap<string> = {};
      props.featureGroups.forEach((group) => {
        if (group.features != undefined) {
          group.features.forEach((query) => {
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
    }

    return { apply };
  },
};
</script>

<style>
#apply-button {
  width: 90%;
  margin-left: 7%;
}
</style>
