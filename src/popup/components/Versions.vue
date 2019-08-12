<template>
<section>
    <section>
      <p>Click the refresh button to reload the current page and capture the version of the currently-loaded extension(s).</p>
    </section>
    <section>
      <button class="button is-success" @click="reload">Refresh</button>
    </section>
    <section>
      <b-field v-for="extension in Object.keys(extensions)" :key="extension" :label="extension">
        <b-input v-model="extensions[extension]" disabled></b-input>
      </b-field>
    </section>
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
