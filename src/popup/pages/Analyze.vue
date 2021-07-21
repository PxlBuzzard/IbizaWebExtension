<template>
  <section>
    <section>
      <el-alert
        :active="loaded && link === ''"
        type="error"
        title="No blade detected."
        description="Please make sure you are in the Azure Portal."
        show-icon
      >
      </el-alert>
    </section>
    <p>
      This is a shortcut to load Ibiza's Extension Analyzer website for the currently loaded blade.
      It will open a new tab.
    </p>
    <h3>Extension</h3>
    <el-input v-model="extension" disabled />
    <h3>Blade</h3>
    <el-input v-model="blade" disabled />
    <el-button type="primary" @click="analyze">Analyze blade</el-button>
  </section>
</template>

<script lang="ts">
import { onMounted, ref } from "vue";
import UrlParser from "../url/UrlParser";

export default {
  name: "Analyze",
  setup(props) {
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

<style></style>
