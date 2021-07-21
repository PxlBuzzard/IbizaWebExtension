<template>
  <section>
    <h2>Sideloaded Extension</h2>
    <el-select v-model="extensionSelected" placeholder="Select an extension">
      <el-option label="None" value="" @input="$emit('input', extensionSelected)" />
      <el-option
        v-for="ext in extensions"
        :key="ext.name"
        :label="ext.name"
        :value="ext.name"
        @input="$emit('input', extensionSelected)"
      />
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
  emits: ["input"],
  setup(props) {
    const extensionSelected = ref(props.value);

    return { extensionSelected };
  },
};
</script>

<style></style>
