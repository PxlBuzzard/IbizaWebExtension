<template>
  <section>
    <NotifyUpdate :is-visible="updatedConfig" />
    <section>
      <h2>Help</h2>
      <p>
        To learn more about the Azure Portal and this extension, visit
        <a @click="helpClicked">the docs</a>.
      </p>
    </section>
    <section>
      <h2>Config source</h2>
      <p>
        The config powers all of the options available in the extension. By default the config is
        tuned for Microsoft Intune developers.
      </p>
      <el-input v-model="configSource" />
      <el-button type="primary" @click="save">Save</el-button>
    </section>
    <section>
      <h2>Credits</h2>
      <p>
        Created by Daniel Jost and David Wilson during OneWeek 2019. Built using Vue.js, Typescript,
        and Fluent Design principles.
      </p>
    </section>
    <section>
      <h2>Changelog</h2>
      <section v-for="change in changelog" :key="change.version">
        <h3>{{ change.version }}, {{ change.date }}</h3>
        <p>{{ change.notes }}</p>
      </section>
    </section>
  </section>
</template>

<script lang="ts">
import { onMounted, ref } from "vue";
import NotifyUpdate from "../components/NotifyUpdate.vue";

export default {
  name: "Settings",
  components: { NotifyUpdate },
  props: {
    changelog: {
      type: Array,
      default: () => [],
    },
    configLoader: {
      type: Object,
      default: (): void => {},
    },
    helpLink: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const configSource = ref("");
    const updatedConfig = ref(false);

    onMounted(async () => {
      configSource.value = await props.configLoader.getConfigEndpoint();
    });

    async function save(): Promise<void> {
      await props.configLoader.setConfigEndpoint(configSource.value);
      updatedConfig.value = true;
    }

    function helpClicked(): Promise<void> {
      return new Promise((resolve) =>
        chrome.tabs.create({ url: props.helpLink }, () => {
          resolve();
          window.close();
        }),
      );
    }

    return { configSource, updatedConfig, save, helpClicked };
  },
};
</script>

<style>
section {
  margin-bottom: 20px;
}
</style>
