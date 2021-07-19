<template>
<section>
    <NotifyUpdate :is-visible="updatedConfig" />
    <section>
      <h2>Help</h2>
      <p>To learn more about the Azure Portal and this extension, visit <a @click="helpClicked">the docs</a>.</p>
    </section>
    <section>
      <h2>Config source</h2>
      <p>The config powers all of the options available in the extension. By default the config is tuned for Microsoft Intune developers.</p>
      <b-field>
          <b-input
v-model="configSource"
expanded
/>
          <button
class="button is-success"
@click="save"
>
Save
</button>
      </b-field>
    </section>
    <section>
      <h2>Credits</h2>
      <p>Created by Daniel Jost and David Wilson during OneWeek 2019. Built using Vue.js, Typescript, and Fluent Design principles.</p>
    </section>
    <section>
      <h2>Changelog</h2>
      <section
v-for="change in changelog"
:key="change.version"
>
        <h3>{{ change.version }}, {{ change.date }}</h3>
        <p>{{ change.notes }}</p>
      </section>
    </section>
</section>
</template>

<script lang="ts">
import NotifyUpdate from "./NotifyUpdate.vue";

export default {
  name: "Settings",
  components: {NotifyUpdate},
  props: {
    changelog: {
      type: Array,
      default: () => []
    },
    configLoader: {
      type: Object,
      default: (): void => {}
    },
    helpLink: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      configSource: "",
      updatedConfig: false
    }
  },
  async mounted(): Promise<void> {
    this.configSource = await this.configLoader.getConfigEndpoint();
  },
  methods: {
    async save(): Promise<void> {
      await this.configLoader.setConfigEndpoint(this.configSource);
      this.updatedConfig = true;
    },
    helpClicked(): Promise<void> {
      return new Promise((resolve) => chrome.tabs.create({ url: this.helpLink }, () => {
        resolve();
        window.close();
      }));
    }
  }
}
</script>

<style>
section {
  margin-bottom: 20px;
}
</style>
