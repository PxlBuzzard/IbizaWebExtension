<template>
<section>
    <button id="apply-button" class="button is-success" @click="apply">Apply</button>
</section>
</template>

<script lang="ts">
import UrlParser from "../url/UrlParser";
import Vue from "vue";
import { IEnvironment, IExtension, IFeature, IFeatureGroup } from "../config/Schema";

export default Vue.extend({
  name: "Apply",
  props: ["config", "currentEnv", "currentUrl", "localExtension", "featureGroups"],
  methods: {
    apply() {
        let urlParser = new UrlParser();
        let env = this.config.environments.filter((e: IEnvironment) => e.label === this.currentEnv)[0];
        let localExtConfig = this.config.extensions.filter((e: IExtension) => e.name === this.localExtension)[0];
        let sideloadUrl = localExtConfig.environments.filter((e: IEnvironment) => e.label === this.currentEnv)[0]?.sideloadUrl;

        if (sideloadUrl == undefined) {
            sideloadUrl = "https://localhost:44300";
            console.error(`Sideload URL is undefined, falling back to ${sideloadUrl}`);
        }

        // add env stamps to URL
        let exts = this.config.extensions.map((ext: IExtension) => ext.environments);
        let extNames = this.config.extensions.map((ext: IExtension) => ext.name);
        let stampQueries: StringMap<string> = {};
        for (let i = 0; i < exts.length; i++) {
          let stamp = exts[i].filter((e: IEnvironment) => e.label === this.currentEnv)[0].stamp || "";
          stampQueries[extNames[i]] = stamp;
        }

        let finalQueries: StringMap<string> = {};
        this.featureGroups.forEach((group: IFeatureGroup) => {
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
            fragment: this.currentUrl.fragment,
            testExtension: this.localExtension,
            sideloadUrl
        });
    }
  }
});
</script>

<style>
#apply-button {
  width: 90%;
  font-weight: 500;
  margin-bottom: 20px;
  margin-left: 8%;
}
</style>
