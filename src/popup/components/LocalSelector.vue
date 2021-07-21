<template>
  <section>
    <h2 style="display: inline-block">Sideloaded Extension</h2>
    <el-select
      v-model="extensionSelected"
      placeholder="Select an extension"
      filterable
      default-first-option
      :change="$emit('update-selected-extension', extensionSelected)"
    >
      <el-option label="None" value="" />
      <el-option v-for="ext in extensions" :key="ext.name" :label="ext.name" :value="ext.name" />
    </el-select>
  </section>
</template>

<script lang="ts">
import { ref } from "vue";
export default {
  name: "LocalSelector",
  props: {
    value: {
      type: String,
      default: "",
    },
    extensions: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["update-selected-extension"],
  setup(props) {
    const extensionSelected = ref(props.value);

    return { extensionSelected };
  },
};
</script>

<style></style>
