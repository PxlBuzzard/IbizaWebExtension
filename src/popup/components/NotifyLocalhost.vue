<template>
<section>
    <b-notification
        :active.sync="isVisible"
        type="is-danger"
        aria-close-label="Close notification"
        role="alert">
        Could not find local extension server. Please ensure it is running.
    </b-notification>
</section>
</template>

<script>
export default {
  name: "NotifyLocalhost",
  props: ["extensionSelected"],
  computed: {
      isVisible: function() {
          if (this.extensionSelected != undefined || this.extensionSelected !== "") {
              console.log(this.extensionSelected);
              console.log("fetching local");
              fetch("https://localhost:44300")
                  .then(_ => false)
                  .catch(_ => true);
          }

          return false;
      }
  }
}
</script>

<style>
</style>
