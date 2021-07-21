<template>
  <section>
    <el-alert
      :active="isVisible"
      type="warning"
      title="Portal URL not found."
      description="Using this extension outside of the Azure Portal will force the page to be redirected to the Azure Portal if you apply the selected options."
    />
  </section>
</template>

<script lang="ts">
export default {
  name: "NotifyUnknownPortal",
  props: {
    currentEnv: {
      type: String,
      default: "",
    },
  },
  computed: {
    isVisible(props): boolean {
      return props.currentEnv == "unknown";
    },
  },
};
</script>

<style></style>
