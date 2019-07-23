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
