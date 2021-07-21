<template>
  <section>
    <el-alert
      :active="isVisible"
      type="success"
      title="Update downloaded."
      description="A newer configuration is available! Please reopen this extension to get the latest and greatest."
    />
  </section>
</template>

<script lang="ts">
export default {
  name: "NotifyUpdate",
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style></style>
