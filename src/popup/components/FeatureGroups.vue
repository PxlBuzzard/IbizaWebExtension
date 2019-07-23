<template>
<section>
    <section
        v-for="group in featureGroups"
        v-bind:key="group.label">
        <h1>{{ group.label }}</h1>
        <section
            v-for="feature in group.features"
            v-bind:key="feature.label">
            <h3>{{ feature.label }}</h3>
            <b-field>
                <b-radio-button
                    v-for="option in feature.options"
                    v-bind:key="option"
                    :native-value="option">
                    {{ option }}
                </b-radio-button>
            </b-field>
        </section>
    </section>
</section>
</template>

<script lang="ts">
export default {
    name: "FeatureGroups",
    props: ['featureGroups'],
    data() {
        return {

        }
    }
}
</script>

<style>
</style>
