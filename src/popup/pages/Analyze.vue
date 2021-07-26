<template>
  <section>
    <section v-if="loaded && link === ''">
      <el-alert
        type="error"
        title="No blade detected."
        description="Please make sure you are in the Azure Portal."
        show-icon
      >
      </el-alert>
    </section>
    <p>
      This is a shortcut to open the Extension Analyzer website for the currently loaded blade. It
      will open in a new tab.
    </p>
  </section>
  <section>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>{{ blade }}</span>
          <el-button type="text" @click="analyze">Open Analyzer</el-button>
        </div>
      </template>
      <div class="card-text">
        {{ extension }}
      </div>
    </el-card>
  </section>
</template>

<script lang="ts">
import { onMounted, ref } from "vue";
import UrlParser from "../url/UrlParser";

export default {
  name: "Analyze",
  setup() {
    const blade = ref("");
    const extension = ref("");
    const link = ref("");
    const loaded = ref(false);

    onMounted(async () => {
      // get current url
      const urlParser = new UrlParser();
      const currentUrl = await urlParser.parseUrl();
      const fragment = currentUrl.fragment;
      if (fragment) {
        const parts = fragment.match(/blade\/(\w+)\/(\w+)/);
        if (parts && parts.length === 3) {
          blade.value = parts[2];
          extension.value = parts[1];
          link.value = `https://extensionanalyzer.azure-test.net/extensions/${parts[1]}/blades/${parts[2]}`;
        }
      }
      loaded.value = true;
    });

    function analyze(): void {
      if (link.value != "") {
        chrome.tabs.create({ url: link.value });
      }
    }
    return { blade, extension, link, loaded, analyze };
  },
};
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-text {
  font-size: 14px;
}

.box-card {
  width: 400px;
}
</style>
