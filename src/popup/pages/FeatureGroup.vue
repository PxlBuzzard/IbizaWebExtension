<template>
  <section>
    <h2>{{ featureGroup.label }}</h2>
    <section v-for="feature in featureGroup.features" :key="feature.name">
      <el-tooltip
        :disabled="disabled"
        class="item"
        effect="dark"
        :content="feature.name"
        placement="top-start"
      >
        <h3 @click="disabled = !disabled">{{ feature.label }}</h3>
      </el-tooltip>
      <el-radio-group v-model="feature.selected" size="small">
        <el-radio-button :label="undefined">unset</el-radio-button>
        <el-radio-button v-for="option in feature.options" :key="option" :label="option" />
      </el-radio-group>
    </section>
  </section>
</template>

<script lang="ts">
import { PropType } from "vue";
import { IFeatureGroup } from "../config/Schema";

export default {
  name: "FeatureGroup",
  props: {
    featureGroup: {
      type: Object as PropType<IFeatureGroup>,
      required: true,
    },
  },
  data() {
    return {
      disabled: true,
    };
  },
};
</script>

<style></style>
