<template>
    <div id="app" class="columns">
        <div id="sidebar" class="column is-one-third is-narrow">
          <Sidebar/>
        </div>
        <div id="content" class="column is-two-thirds">
          <IbizaEnvSelector/>
        </div>
    </div>
</template>

<script lang="ts">
import IbizaEnvSelector from "./components/IbizaEnvSelector.vue";
import Sidebar from "./components/Sidebar.vue";

export default {
    components: {
        IbizaEnvSelector,
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
        let config = await configLoader.getConfigFromRemote();
        this.config = config;
    }
}
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
