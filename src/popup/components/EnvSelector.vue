<template>
<section>
    <h2>Environment</h2>
    <b-field>
        <b-radio-button
            v-for="env in environments"
            :key="env.label"
            v-model="envSelected"
            :native-value="env.label"
            @input="$emit('input', envSelected)"
>
            {{ env.label }}
        </b-radio-button>
    </b-field>
</section>
</template>

<script lang="ts">
export default {
    name: "EnvSelector",
    props: {
        value: {
            type: String,
            default: ""
        },
        environments: {
            type: Array,
            default: () => []
        }
    },
    emits: ["input"],
    data() {
        return {
            envSelected: ""
        }
    },
    mounted(): void {
        this.envSelected = this.value || "";
    }
}
</script>

<style>
</style>
