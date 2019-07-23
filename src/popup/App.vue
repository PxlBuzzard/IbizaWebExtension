<template>
<div id="app">
    <LocalhostNotify/>
    <div class="columns">
        <div id="sidebar" class="column is-one-third is-narrow">
            <Sidebar/>
        </div>
        <div id="content" class="column is-two-thirds">
            <IbizaEnvSelector/>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import IbizaEnvSelector from "./components/IbizaEnvSelector.vue";
import LocalhostNotify from "./components/LocalhostNotify.vue";
import Sidebar from "./components/Sidebar.vue";

export default {
    components: {
        IbizaEnvSelector,
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
