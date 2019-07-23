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
        </div>
        <div id="content" class="column is-two-thirds">
            <EnvSelector v-bind:environments="config.environments"/>
            <LocalSelector v-bind:extensions="config.localExtensions"/>
            <FeatureGroups v-bind:featureGroups="config.featureGroups"/>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import ConfigLoader from "./config/ConfigLoader";
import EnvSelector from "./components/EnvSelector.vue";
import FeatureGroups from "./components/FeatureGroups.vue";
import Header from "./components/Header.vue";
import LocalSelector from "./components/LocalSelector.vue";
import LocalhostNotify from "./components/LocalhostNotify.vue";
import Sidebar from "./components/Sidebar.vue";
import UrlParser from "./url/UrlParser";
import Vue from "vue";

export default Vue.extend({
    components: {
        EnvSelector,
        FeatureGroups,
        Header,
        LocalSelector,
        LocalhostNotify,
        Sidebar
    },
    data() {
        return {
            currentUrl: {
                host: "host",
                query: {}
            },
            config: {}
        };
    },
    async mounted() {
        // get current url
        let urlParser = new UrlParser();
        let url = await urlParser.parseUrl();
        this.currentUrl.host = url.origin;
        this.currentUrl.query = url.query;

        // get config
        let configLoader = new ConfigLoader();
        configLoader.loaded = config => {
            this.config = config;
            console.log("config", config);
        };
        configLoader.failedFetch = reason => {
            console.error("config load failed", reason);
        }
        configLoader.incompatible = (extVer, configVer) => {
            console.error("incompatible", extVer, configVer);
        }

        await configLoader.loadConfig();

        // url.query["clientOptimizations"] = "false";
        // urlParser.setUrl(url);
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
