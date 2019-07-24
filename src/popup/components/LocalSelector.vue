<template>
<section>
    <div class="field">
        <b-radio
            v-for="ext in extensions"
            v-bind:key="ext"
            v-model="extensionSelected"
            :native-value="ext">
            {{ ext }}
        </b-radio>
    </div>
</section>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    name: "LocalSelector",
    props: ['extensions', "localExtension"],
    data() {
        return {
            extensionSelected: ""
        }
    },
    watch: {
        localExtension(val: string) {
            this.extensionSelected = val;
        },
        extensionSelected(val: string) {
            this.$emit("update:localExtension", val);
        }
    }
});
</script>

<style>
.field:not(:last-child) {
    margin-bottom: .75rem;
}
</style>
