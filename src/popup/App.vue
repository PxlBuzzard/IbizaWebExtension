<template>
    <div id="app">
        <div id="sidebar">
            <Sidebar/>
            <div>Host: {{currentUrl.host}}</div>
            <div>Queries: {{currentUrl.queries}}</div>
        </div>
        <div id="content">
            <Sidebar/>
            <div>Config: {{config}}</div>
        </div>
    </div>
</template>

<script>
import { ConfigLoader } from "./config/ConfigLoader";
import Sidebar from "./components/Sidebar.vue";
import { UrlParser } from "./url/UrlParser";

export default {
    components: {
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
*, *::before, *::after {
  box-sizing: border-box;
}

#app {
    max-width: 500px;
    margin: 0 auto;
    line-height: 1.4;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    display: flex;
}

#sidebar {
  flex: 1;
}

#content {
  flex: 1;
}
</style>
