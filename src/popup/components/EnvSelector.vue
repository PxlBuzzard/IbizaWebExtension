<template>
  <section>
    <h2>Environment</h2>
    <el-radio-group v-model="envSelected">
      <el-radio
        v-for="env in environments"
        :key="env.label"
        :label="env.label"
        @input="$emit('input', envSelected)"
      />
    </el-radio-group>
  </section>
</template>

<script lang="ts">
import { onMounted, ref } from "vue";

export default {
  name: "EnvSelector",
  props: {
    value: {
      type: String,
      default: "",
    },
    environments: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["input"],
  setup(props) {
    const envSelected = ref("");

    onMounted(() => {
      envSelected.value = props.value || "";
    });
    return { envSelected };
  },
};
</script>

<style></style>
