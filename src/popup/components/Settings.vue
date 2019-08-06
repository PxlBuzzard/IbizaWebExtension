<template>
<section>
    <NotifyUpdate v-bind:isVisible="updatedConfig"/>
    <h2>Config source</h2>
    <p>The config powers all of the options available in the extension. By default the config is tuned for Microsoft Intune developers.</p>
    <b-field>
        <b-input v-model="configSource"></b-input>
    </b-field>
    <button class="button is-success" @click="save">Save</button>
</section>
</template>

<script>
import NotifyUpdate from "./NotifyUpdate.vue";
import Vue from "vue";

export default Vue.extend({
  name: "Settings",
  components: {NotifyUpdate},
  props: ["configLoader"],
  data() {
    return {
      configSource: "",
      updatedConfig: false
    }
  },
  methods: {
    async save() {
      await this.configLoader.setConfigEndpoint(this.configSource).then(() => this.updatedConfig = true);
    }
  },
  async mounted() {
    this.configSource = await this.configLoader.getConfigEndpoint();
  }
});
</script>

<style>
</style>
