<template>
<section>
    <h2>Environment</h2>
    <b-field>
        <b-radio-button
            v-for="env in environments"
            v-bind:key="env.label"
            v-model="envSelected"
            :native-value="env.label">
            {{ env.label }}
        </b-radio-button>
    </b-field>
</section>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    name: "EnvSelector",
    props: ["environments", "currentEnv"],
    data() {
        return {
            envSelected: ""
        }
    },
    watch: {
        currentEnv(val: string) {
            this.envSelected = val;
        },
        envSelected(val: string) {
            this.$emit("update:currentEnv", val);
        }
    }
});
</script>

<style>
</style>
