<template>
  <section>
    <section>
      <p>
        Click the refresh button to reload the current page and capture the version of the
        extension(s) on load.
      </p>
    </section>

    <section>
      <el-button type="primary" @click="reload">Refresh</el-button>
    </section>

    <section>
      <el-card v-for="extension in Object.keys(extensions)" :key="extension" class="box-card">
        <template #header>
          <div class="card-header">
            <span>{{ extension }}</span>
          </div>
        </template>
        <div class="card-text">
          {{ extensions[extension] }}
        </div>
      </el-card>
    </section>
  </section>
</template>

<script lang="ts">
import { ref } from "vue";

export default {
  name: "Versions",
  setup() {
    const extensions = ref({});

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
        urls: ["https://hosting.onecloud.azure-test.net/*", "https://*.hosting.portal.azure.net/*"],
      },
    );

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

<style>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-text {
  font-size: 14px;
}

.box-card {
  width: 300px;
}
</style>
