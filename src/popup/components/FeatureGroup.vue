<template>
  <section>
    <h2>{{ featureGroup.label }}</h2>
    <section v-for="feature in featureGroup.features" :key="feature.label">
      <b-tooltip :label="feature.name" position="is-top" animated>
        <h3>{{ feature.label }}</h3>
      </b-tooltip>
      <b-field>
        <b-radio-button v-model="feature.selected" :native-value="undefined">
          unset
        </b-radio-button>
        <b-radio-button
          v-for="option in feature.options"
          :key="option"
          v-model="feature.selected"
          :native-value="option"
        >
          {{ option }}
        </b-radio-button>
      </b-field>
    </section>
  </section>
</template>

<script lang="ts">
export default {
  name: "FeatureGroup",
  props: ["featureGroup"],
};
</script>

<style></style>
