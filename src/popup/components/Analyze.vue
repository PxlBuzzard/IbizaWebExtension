<template>
<section>
    <section>
        <b-message
            :active="this.loaded && this.link === ''"
            type="is-danger"
            aria-close-label="Close message"
            role="alert"
            title="No blade detected.">
            Please make sure you are in the Azure Portal.
        </b-message>
    </section>
    <p>This is a shortcut to load Ibiza's Extension Analyzer website for the currently loaded blade. It will open a new tab.</p>
    <b-field label="Extension">
        <b-input v-model="this.extension" disabled></b-input>
    </b-field>
    <b-field label="Blade">
        <b-input v-model="this.blade" disabled></b-input>
    </b-field>
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
      blade: "",
      extension: "",
      link: "",
      loaded: false
    };
  },
  methods: {
    analyze() {
      if (this.link != "") {
        chrome.tabs.create({url: this.link});
      }
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
        this.blade = parts[2];
        this.extension = parts[1];
        this.link = `https://extensionanalyzer.azure-test.net/extensions/${parts[1]}/blades/${parts[2]}`;
      }
    }
    this.loaded = true;
  }
});
</script>

<style>
</style>
