<template>
<section>
    <section>
        <b-message
            :active="loaded && link === ''"
            type="is-danger"
            aria-close-label="Close message"
            role="alert"
            title="No blade detected."
>
            Please make sure you are in the Azure Portal.
        </b-message>
    </section>
    <p>This is a shortcut to load Ibiza's Extension Analyzer website for the currently loaded blade. It will open a new tab.</p>
    <b-field label="Extension">
        <b-input
v-model="extension"
disabled
/>
    </b-field>
    <b-field label="Blade">
        <b-input
v-model="blade"
disabled
/>
    </b-field>
    <button
class="button is-success"
@click="analyze"
>
Analyze blade
</button>
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
        chrome.tabs.create({url: link.value});
      }
    }
    return { blade, extension, link, loaded }
  }
}
</script>

<style>
</style>
