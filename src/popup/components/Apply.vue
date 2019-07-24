<template>
<section>
    <button class="button is-success" @click="apply">Apply</button>
</section>
</template>

<script>
import UrlParser from "../url/UrlParser";
import Vue from "vue";

export default Vue.extend({
  name: "Apply",
  props: ["config", "currentEnv", "currentUrl", "localExtension"],
  methods: {
    apply() {
        let urlParser = new UrlParser();
        let env = this.config.environments.filter(e => e.label === this.currentEnv)[0];

        urlParser.setUrl({
            origin: `https://${env.host}`,
            query: env.params || {}, // todo add features
            fragment: this.currentUrl.fragment,
            testExtension: this.localExtension
        });
    }
  }
});
</script>

<style>
</style>
