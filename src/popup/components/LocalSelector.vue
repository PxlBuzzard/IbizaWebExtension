<template>
  <el-form-item label="Sideload">
    <el-select
      v-model="extensionSelected"
      placeholder="Select an extension"
      style="width: 250px"
      filterable
      clearable
      default-first-option
      :change="$emit('update-selected-extension', extensionSelected)"
    >
      <el-option label="None" value="" />
      <el-option v-for="ext in extensions" :key="ext.name" :label="ext.name" :value="ext.name" />
    </el-select>
  </el-form-item>
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
