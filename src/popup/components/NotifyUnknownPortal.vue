<template>
  <section>
    <el-alert
      v-model="isVisible"
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
  setup(props) {
    function isVisible(): boolean {
      return props.currentEnv == "unknown";
    }

    return { isVisible };
  },
};
</script>

<style></style>
