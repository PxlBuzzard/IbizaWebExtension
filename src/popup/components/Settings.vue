<template>
<section>
    <NotifyUpdate v-bind:isVisible="updatedConfig"/>
    <section>
      <h2>Help</h2>
      <p>To learn more about the Azure Portal and this extension, visit <a @click="helpClicked">the docs</a>.</p>
    </section>
    <section>
      <h2>Config source</h2>
      <p>The config powers all of the options available in the extension. By default the config is tuned for Microsoft Intune developers.</p>
      <b-field>
          <b-input v-model="configSource" expanded></b-input>
          <button class="button is-success" @click="save">Save</button>
      </b-field>
    </section>
    <section>
      <h2>Credits</h2>
      <p>Created by Daniel Jost and David Wilson during OneWeek 2019. Built using Vue.js, Typescript, and Fluent Design principles.</p>
    </section>
    <section>
      <h2>Changelog</h2>
      <section v-for="change in changelog" :key="change.version">
        <h3>{{change.version}}, {{change.date}}</h3>
        <p>{{change.notes}}</p>
      </section>
    </section>
</section>
</template>

<script>
import NotifyUpdate from "./NotifyUpdate.vue";
import Vue from "vue";

export default Vue.extend({
  name: "Settings",
  components: {NotifyUpdate},
  props: ["changelog", "configLoader", "helpLink"],
  data() {
    return {
      configSource: "",
      updatedConfig: false
    }
  },
  methods: {
    async save() {
      await this.configLoader.setConfigEndpoint(this.configSource);
      this.updatedConfig = true;
    },
    helpClicked() {
      return new Promise((resolve, reject) => chrome.tabs.create({ url: this.helpLink }, () => {
        resolve();
        window.close();
      }));
    }
  },
  async mounted() {
    this.configSource = await this.configLoader.getConfigEndpoint();
  }
});
</script>

<style>
section {
  margin-bottom: 20px;
}
</style>
