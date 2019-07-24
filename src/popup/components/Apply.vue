<template>
<section>
    <button class="button is-success" @click="apply">Apply</button>
</section>
</template>

<script lang="ts">
import UrlParser from "../url/UrlParser";
import Vue from "vue";
import { IEnvironment, IFeature, IFeatureGroup } from "../config/Schema";

export default Vue.extend({
  name: "Apply",
  props: ["config", "currentEnv", "currentUrl", "localExtension", "featureGroups"],
  methods: {
    apply() {
        let urlParser = new UrlParser();
        let env = this.config.environments.filter((e: IEnvironment) => e.label === this.currentEnv)[0];

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
            query: finalQueries,
            fragment: this.currentUrl.fragment,
            testExtension: this.localExtension
        });
    }
  }
});
</script>

<style>
</style>
