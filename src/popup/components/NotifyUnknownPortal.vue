<template>
  <i></i>
</template>

<script lang="ts">
import { ElNotification } from "element-plus";

export default {
  name: "NotifyUnknownPortal",
  props: {
    currentEnv: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    if (props.currentEnv === "unknown") {
      ElNotification({
        title: "Portal URL not found",
        message:
          "Using this extension outside of the Azure Portal will force the page to be redirected to the Azure Portal if you apply the selected options.",
        type: "warning",
      });
    }
  },
};
</script>

<style></style>
