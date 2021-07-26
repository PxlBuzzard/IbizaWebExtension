<template>
  <i></i>
</template>

<script lang="ts">
import { ElNotification } from "element-plus";

export default {
  name: "NotifyUpdate",
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    if (props.isVisible === true) {
      ElNotification({
        title: "Update downloaded",
        message:
          "A newer configuration is available! Please reopen this extension to get the latest and greatest.",
        type: "success",
      });
    }
  },
};
</script>

<style></style>
