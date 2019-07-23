<template>
<div id="app">
    <LocalhostNotify/>
    <div class="columns">
        <div id="sidebar" class="column is-one-third is-narrow">
            <Sidebar/>
        </div>
        <div id="content" class="column is-two-thirds">
            <EnvSelector
                v-bind:environments="config.environments"/>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import ConfigLoader from "./config/ConfigLoader";
import EnvSelector from "./components/EnvSelector.vue";
import LocalhostNotify from "./components/LocalhostNotify.vue";
import UrlParser from "./url/UrlParser";
import Sidebar from "./components/Sidebar.vue";
import Vue from "vue";

export default Vue.extend({
    components: {
        EnvSelector,
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
#app {
  min-width: 800px;
}

#sidebar {
}

#content {
}
</style>
