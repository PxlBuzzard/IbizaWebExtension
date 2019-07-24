<template>
<section>
    <button class="button is-success" @click="reload">Check ext version</button>
    <dl v-for="extension in Object.keys(extensions)" :key="extension">
        <dt>{{extension}}</dt>
        <dd>{{extensions[extension]}}</dd>
    </dl>
</section>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Versions",
  data() {
      return {
          extensions: {}
      };
  },
  methods: {
      reload() {
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            if (tabs[0].id != undefined) {
                chrome.tabs.reload(tabs[0].id);
            }
        });
      }
  },
  mounted() {
        chrome.webRequest.onCompleted.addListener(
            response => {
                const url = new URL(response.url);
                if (url.searchParams.get("environmentjson") === "true") {
                    const ext = url.searchParams.get("extensionName");
                    const ver = url.searchParams.get("pageVersion");
                    if (ext && ver) {
                        this.$set(this.extensions, ext, ver);
                    }
                }
            },
            { urls: ["https://hosting.onecloud.azure-test.net/*", "https://*.hosting.portal.azure.net/*"] });
  }
});
</script>

<style>
</style>
