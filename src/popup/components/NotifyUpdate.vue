<template>
<section>
    <b-message
        :active="isVisible"
        type="is-warning"
        aria-close-label="Close message"
        role="alert"
        title="Update required.">
        A newer configuration is available. Please update this extension to consume it.
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
