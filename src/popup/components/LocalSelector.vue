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
        v-bind:key="ext.name">
        <b-radio
            v-model="extensionSelected"
            :native-value="ext.name"
            @input="$emit('input', extensionSelected)">
            {{ ext.name }}
        </b-radio>
    </div>
</section>
</template>

<script lang="ts">
export default {
    name: "LocalSelector",
    props: {
        value: {
            type: String,
            default: "",
        },
        extensions: {
            type: Array,
            default: [],
        }
    },
    data() {
        return {
            extensionSelected: ""
        };
    },
    mounted() {
        this.extensionSelected = this.value || "";
    }
}
</script>

<style>
.field:not(:last-child) {
    margin-bottom: .75rem;
}
</style>
