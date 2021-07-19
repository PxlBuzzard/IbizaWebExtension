<template>
<section>
    <b-notification
        v-model:active="isVisible"
        type="is-danger"
        aria-close-label="Close notification"
        role="alert"
    >
        Could not find local extension server. Please ensure it is running.
    </b-notification>
</section>
</template>

<script lang="ts">
export default {
  name: "NotifyLocalhost",
  props: {
    extensionSelected: {
      type: Boolean,
      default: false
    }
  },
  computed: {
      isVisible(props): boolean {
          if (props.extensionSelected != undefined || props.extensionSelected !== "") {
              console.log(props.extensionSelected);
              // console.log("fetching local");
              // fetch("https://localhost:44300")
              //     .then(() => false)
              //     .catch(() => true);
          }

          return false;
      }
  }
}
</script>

<style>
</style>
