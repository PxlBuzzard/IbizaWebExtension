<template>
<div id="app">
    <div class="columns no-margin">
        <div class="column">
            <Header/>
            <LocalhostNotify/>
        </div>
    </div>
    <div class="columns">
        <div id="sidebar" class="column is-one-third is-narrow">
            <Sidebar/>
            <Apply
                v-bind:config="config"
                v-bind:currentEnv="currentEnv"
                v-bind:currentUrl="currentUrl"/>
        </div>
        <div id="content" class="column is-two-thirds">
            <EnvSelector v-bind:environments="config.environments" v-bind:currentEnv.sync="currentEnv"/>
            <LocalSelector v-bind:extensions="config.localExtensions"/>
            <FeatureGroups v-bind:featureGroups="config.featureGroups"/>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import Apply from "./components/Apply.vue";
import ConfigLoader from "./config/ConfigLoader";
import EnvSelector from "./components/EnvSelector.vue";
import FeatureGroups from "./components/FeatureGroups.vue";
import Header from "./components/Header.vue";
import LocalSelector from "./components/LocalSelector.vue";
import LocalhostNotify from "./components/LocalhostNotify.vue";
import Sidebar from "./components/Sidebar.vue";
import UrlParser from "./url/UrlParser";
import Vue from "vue";
import { IConfiguration } from "./config/Schema";
import { IUrlComponents } from "./url/IUrlComponents";

export default Vue.extend({
    components: {
        Apply,
        EnvSelector,
        FeatureGroups,
        Header,
        LocalSelector,
        LocalhostNotify,
        Sidebar
    },
    data() {
        return {
            currentUrl: <IUrlComponents>{
                origin: "host",
                query: {}
            },
            currentEnv: "",
            config: <IConfiguration>{
                version: "0",
                environments: [],
                localExtensions: [],
                featureGroups: [],
                dynamicFeatureGroups: []
            }
        };
    },
    async mounted() {
        // get current url
        let urlParser = new UrlParser();
        this.currentUrl = await urlParser.parseUrl();

        // get config
        let configLoader = new ConfigLoader();
        configLoader.loaded = config => {
            this.config = config;

            // check current env
            for (let env of config.environments) {
                if (this.currentUrl.origin === `https://${env.host}` && (!env.params || Object.keys(env.params).every(p => !env.params || this.currentUrl.query[p] === env.params[p]))) {
                    console.log("match", env.label);
                    this.currentEnv = env.label;
                    break;
                }
            }

            // get dynamic features
            if (config.dynamicFeatureGroups) {
                config.dynamicFeatureGroups.forEach(async group => {
                    let features = await configLoader.loadFeatures(group.source["sh"]); // TODO get current env
                    this.config.featureGroups.push({
                        label: group.label,
                        features: features
                    })
                })
            }
        };
        configLoader.failedFetch = reason => {
            console.error("config load failed", reason);
        }
        configLoader.incompatible = (extVer, configVer) => {
            console.error("incompatible", extVer, configVer);
        }

        await configLoader.loadConfig();
    }
})
</script>

<style>
html {
  font-family: az_ea_font, 'Segoe UI', az_font, system-ui, sans-serif;
}

#app {
  width: 800px;
}
.material-design-icon.icon-2x {
  width: 40px;
  height: 40px;
}

.material-design-icon.icon-2x > .material-design-icon__svg {
  width: 40px;
  height: 40px;
}

.columns.no-margin {
  margin-bottom: 0 !important;
}
</style>
