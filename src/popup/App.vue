<template>
<div id="app">
    <LocalhostNotify/>
    <div class="columns">
        <div id="sidebar" class="column is-one-third is-narrow">
            <Sidebar/>
        </div>
        <div id="content" class="column is-two-thirds">
            <EnvSelector v-bind:environments="config.environments"/>
            <LocalSelector v-bind:extensions="config.localExtensions"/>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import ConfigLoader from "./config/ConfigLoader";
import EnvSelector from "./components/EnvSelector.vue";
import LocalSelector from "./components/LocalSelector.vue";
import LocalhostNotify from "./components/LocalhostNotify.vue";
import Sidebar from "./components/Sidebar.vue";
import UrlParser from "./url/UrlParser";
import Vue from "vue";

export default Vue.extend({
    components: {
        EnvSelector,
        LocalSelector,
        LocalhostNotify,
        Sidebar
    },
    data() {
        return {
            currentUrl: {
                host: "host",
                queries: {}
            },
            config: {}
        };
    },
    async mounted() {
        // get current url
        let url = await (new UrlParser()).parseUrl();
        this.currentUrl.host = url.host;
        this.currentUrl.queries = url.queries;

        // get config
        let configLoader = new ConfigLoader();
        configLoader.loaded = config => {
            this.config = config;
            console.log(config);
        };
        configLoader.failedFetch = reason => {
            console.error(reason);
        }
        configLoader.incompatible = (extVer, configVer) => {
            console.error("incompatible", extVer, configVer);
        }

        await configLoader.loadConfig();
    }
})
</script>

<style>
#app {
  width: 800px;
}

#sidebar {
}

#content {
}
</style>
