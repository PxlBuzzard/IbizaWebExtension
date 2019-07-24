<template>
<section>
    <b-notification
            :active.sync="isActive"
            type="is-warning"
            has-icon
            aria-close-label="Close notification"
            role="alert">
            https://localhost:44300 was not found.
        </b-notification>
</section>
</template>

<script lang="ts">
export default {
  name: "NotifyLocalhost",
  data() {
            return {
                isActive: false
            }
        }
}
</script>

<style>

</style>
