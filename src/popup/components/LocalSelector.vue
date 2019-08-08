<template>
<section>
  <h2>Local Extension</h2>
    <div class="field">
        <b-radio
            v-model="extensionSelected"
            :native-value="''"
            @input="$emit('input', extensionSelected)">
            None
        </b-radio>
    </div>
    <div
        class="field"
        v-for="ext in extensions"
        v-bind:key="ext">
        <b-radio
            v-model="extensionSelected"
            :native-value="ext"
            @input="$emit('input', extensionSelected)">
            {{ ext }}
        </b-radio>
    </div>
</section>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    name: "LocalSelector",
    props: ["extensions", "value"],
    data() {
        return {
            extensionSelected: ""
        };
    },
    mounted() {
        this.extensionSelected = this.value;
    }
});
</script>

<style>
.field:not(:last-child) {
    margin-bottom: .75rem;
}
</style>
