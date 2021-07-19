<template>
<section>
    <section>
      <p>Click the refresh button to reload the current page and capture the version of the currently-loaded extension(s).</p>
    </section>
    <section>
      <button
class="button is-success"
@click="reload"
>
Refresh
</button>
    </section>
    <section>
      <b-field
v-for="extension in Object.keys(extensions)"
:key="extension"
:label="extension"
>
        <b-input
v-model="extensions[extension]"
disabled
/>
      </b-field>
    </section>
</section>
</template>

<script lang="ts">
import { ref } from 'vue';

const extensions = ref({});
export default {
  name: "Versions",
  mounted(): void {
        chrome.webRequest.onCompleted.addListener(
            response => {
                const url = new URL(response.url);
                if (url.searchParams.get("environmentjson") === "true") {
                    const ext = url.searchParams.get("extensionName");
                    const ver = url.searchParams.get("pageVersion");
                    if (ext && ver) {
                        extensions.value[ext] = ver;
                    }
                }
            },
            { urls: ["https://hosting.onecloud.azure-test.net/*", "https://*.hosting.portal.azure.net/*"] });
  },
  methods: {
      reload(): void {
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            if (tabs[0].id != undefined) {
                chrome.tabs.reload(tabs[0].id);
            }
        });
      }
  }
}
</script>

<style>
</style>
