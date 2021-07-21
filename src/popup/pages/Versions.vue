<template>
  <section>
    <section>
      <p>
        Click the refresh button to reload the current page and capture the version of the
        currently-loaded extension(s).
      </p>
    </section>
    <section>
      <el-button type="primary" @click="reload">Refresh</el-button>
    </section>
    <section>
      <div v-for="extension in Object.keys(extensions)" :key="extension" :label="extension">
        <el-input v-model="extensions[extension]" disabled />
      </div>
    </section>
  </section>
</template>

<script lang="ts">
import { onMounted, ref } from "vue";

export default {
  name: "Versions",
  setup() {
    const extensions = ref({});
    onMounted(() => {
      chrome.webRequest.onCompleted.addListener(
        (response) => {
          const url = new URL(response.url);
          if (url.searchParams.get("environmentjson") === "true") {
            const ext = url.searchParams.get("extensionName");
            const ver = url.searchParams.get("pageVersion");
            if (ext && ver) {
              extensions.value[ext] = ver;
            }
          }
        },
        {
          urls: [
            "https://hosting.onecloud.azure-test.net/*",
            "https://*.hosting.portal.azure.net/*",
          ],
        },
      );
    });

    function reload(): void {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0].id != undefined) {
          chrome.tabs.reload(tabs[0].id);
        }
      });
    }

    return { extensions, reload };
  },
};
</script>

<style></style>
