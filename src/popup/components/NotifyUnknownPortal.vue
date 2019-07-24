<template>
<section>
    <b-message
        :active="isVisible"
        type="is-warning"
        aria-close-label="Close message"
        role="alert"
        title="Portal URL not found.">
        Using this extension outside of the Azure Portal will force the page to be redirected to the Azure Portal if you apply the selected options.
    </b-message>
</section>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    name: "NotifyUnknownPortal",
    props: ["currentEnv"],
    computed: {
        isVisible: function() {
            return this.currentEnv == "unknown";
        }
    }
});
</script>

<style>
</style>
