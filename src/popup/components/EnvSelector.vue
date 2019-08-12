<template>
<section>
    <h2>Environment</h2>
    <b-field>
        <b-radio-button
            v-for="env in environments"
            v-bind:key="env.label"
            v-model="envSelected"
            :native-value="env.label"
            @input="$emit('input', envSelected)">
            {{ env.label }}
        </b-radio-button>
    </b-field>
</section>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    name: "EnvSelector",
    props: ["environments", "value"],
    data() {
        return {
            envSelected: ""
        }
    },
    mounted() {
        this.envSelected = this.value;
    }
});
</script>

<style>
</style>
