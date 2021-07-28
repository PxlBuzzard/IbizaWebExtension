<template>
  <el-form-item v-for="feature in featureGroup.features" :key="feature.name" :label="feature.label">
    <el-radio-group v-model="feature.selected" size="small">
      <el-radio-button :label="undefined">unset</el-radio-button>
      <el-radio-button v-for="option in feature.options" :key="option" :label="option" />
    </el-radio-group>
  </el-form-item>
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
};
</script>

<style></style>
