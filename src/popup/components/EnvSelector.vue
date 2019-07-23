<template>
    <section>
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
export default {
    name: "EnvSelector",
    props: ['environments'],
    data() {
        return {
            envSelected: ""
        }
    }
}
</script>

<style>
</style>
