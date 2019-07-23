<template>
<section>
    <button class="button block" @click="isActive = !isActive">Toggle</button>
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
  name: "LocalhostNotify",
  data() {
            return {
                isActive: true
            }
        }
}
</script>

<style>

</style>
