<template>
  <section>
    <h2 style="display: inline-block">Environment</h2>
    <el-select
      v-model="envSelected"
      placeholder="Select an environment"
      filterable
      default-first-option
      :change="$emit('update-current-env', envSelected)"
    >
      <el-option
        v-for="env in environments"
        :key="env.label"
        :label="env.label"
        :value="env.label"
      />
    </el-select>
  </section>
</template>

<script lang="ts">
import { PropType, ref } from "vue";
import { IEnvironment } from "../config/Schema";

export default {
  name: "EnvSelector",
  props: {
    value: {
      type: String,
      required: true,
    },
    environments: {
      type: Array as PropType<IEnvironment[]>,
      required: true,
    },
  },
  emits: ["update-current-env"],
  setup(props) {
    const envSelected = ref(props.value !== "unknown" ? props.value : "");
    return { envSelected };
  },
};
</script>

<style></style>
