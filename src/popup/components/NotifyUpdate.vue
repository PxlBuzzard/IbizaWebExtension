<template>
<section>
    <b-message
        :active="isVisible"
        type="is-info"
        aria-close-label="Close message"
        role="alert"
        title="Update downloaded.">
        A newer configuration is available! Please reopen this extension to get the latest and greatest.
    </b-message>
</section>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    name: "NotifyUpdate",
    props: ["isVisible"]
});
</script>

<style>
</style>
