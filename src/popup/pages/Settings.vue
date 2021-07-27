<template>
  <section>
    <NotifyUpdate :is-visible="updatedConfig" />
    <section>
      <h2>Help</h2>
      <p>
        To learn more about the Azure Portal and this extension, visit
        <el-link type="primary" @click="helpClicked">the docs</el-link>.
      </p>
    </section>

    <section>
      <h2>Configuration source URL</h2>
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
        Created by Daniel Jost and David Wilson during OneWeek 2017. Built using Vue.js, Typescript,
        and Fluent Design principles. Redesigned in 2021 by Daniel to use Vue 3 and a new UI.
      </p>
    </section>

    <section>
      <h2>Changelog</h2>
      <el-timeline>
        <el-timeline-item
          v-for="change in changelog"
          :key="change.version"
          :timestamp="change.date"
          placement="top"
        >
          <el-card>
            <h4>{{ change.version }}</h4>
            <p>{{ change.notes }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
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

<style scoped>
section {
  margin-bottom: 20px;
}

.el-input {
  width: 80%;
  display: inline-block;
}
</style>
