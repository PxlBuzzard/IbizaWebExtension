<template>
  <section>
    <b-message
      :active="isVisible"
      type="is-info"
      aria-close-label="Close message"
      role="alert"
      title="Update downloaded."
    >
      A newer configuration is available! Please reopen this extension to get the latest and
      greatest.
    </b-message>
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
