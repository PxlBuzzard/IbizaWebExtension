<template>
<section>
    <button class="button is-success" @click="analyze">Analyze blade</button>
</section>
</template>

<script lang="ts">
import UrlParser from "../url/UrlParser";
import Vue from "vue";

export default Vue.extend({
  name: "Analyze",
  data() {
      return {
          link: ""
      };
  },
    methods: {
        analyze() {
            chrome.tabs.create({url: this.link});
        }
    },
  async mounted() {
        // get current url
        const urlParser = new UrlParser();
        const currentUrl = await urlParser.parseUrl();
        const fragment = currentUrl.fragment;
        if (fragment) {
            const parts = fragment.match(/blade\/(\w+)\/(\w+)/);
            if (parts && parts.length === 3) {
                this.link = `https://extensionanalyzer.azure-test.net/extensions/${parts[1]}/blades/${parts[2]}`;
            }
        }
  }
});
</script>

<style>
</style>
