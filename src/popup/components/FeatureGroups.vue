<template>
<section>
    <section
        v-for="group in featureGroups"
        v-bind:key="group.label">
        <h2>{{ group.label }}</h2>
        <section
            v-for="feature in group.features"
            v-bind:key="feature.label">
            <b-tooltip
            :label="feature.name"
            position="is-top"
            animated>
                <h3>{{ feature.label }}</h3>
            </b-tooltip>
            <b-field>
                <b-radio-button
                    v-for="option in feature.options"
                    v-bind:key="option"
                    v-model="feature.selected"
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
