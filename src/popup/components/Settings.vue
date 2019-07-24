<template>
<section>
    Config source: <input v-model="configSource" />
    <button @click="save">Save</button>
</section>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  name: "Apply",
  props: ["configLoader"],
  data() {
    return {
      configSource: ""
    }
  },
  methods: {
    async save() {
      await this.configLoader.setConfigEndpoint(this.configSource);
    }
  },
  async mounted() {
    this.configSource = await this.configLoader.getConfigEndpoint();
  }
});
</script>

<style>
</style>
