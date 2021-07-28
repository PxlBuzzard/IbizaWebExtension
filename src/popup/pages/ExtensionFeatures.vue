<template>
  <section>
    <el-input
      v-model="state1"
      style="width: 300px"
      placeholder="Search for features"
      value-key="label"
      clearable
      @input="handleInput"
      @clear="handleInput"
    >
    </el-input>

    <p v-if="hiddenFeatureCount === 0 && !noResults">{{ features.length }} features available</p>
    <p v-if="hiddenFeatureCount > 0">{{ hiddenFeatureCount }} features hidden</p>
    <p v-if="noResults">0 search results, showing all features</p>

    <section v-for="feature in features" :key="feature.name">
      <p style="display: inline">{{ feature.label }}</p>
      <el-tooltip class="item" effect="dark" :content="feature.name" placement="top-start">
        <i class="el-icon-info" style="margin-left: 5px" />
      </el-tooltip>
      <br />
      <el-radio-group v-model="feature.selected" size="small" style="margin-top: 5px">
        <el-radio-button :label="undefined">unset</el-radio-button>
        <el-radio-button v-for="option in feature.options" :key="option" :label="option" />
      </el-radio-group>
    </section>
  </section>
</template>

<script lang="ts">
import { PropType, ref } from "vue";
import { IFeatureGroup } from "../config/Schema";

export default {
  name: "ExtensionFeatures",
  props: {
    featureGroup: {
      type: Object as PropType<IFeatureGroup>,
      required: true,
    },
  },
  setup(props) {
    const features = ref(props.featureGroup.features);
    const hiddenFeatureCount = ref(0);
    const noResults = ref(false);

    const handleInput = (query?: string) => {
      noResults.value = false;
      if (!query) {
        hiddenFeatureCount.value = 0;
        features.value = props.featureGroup.features;
        return;
      }

      const featuresFilter = features.value.filter(
        (f) =>
          f.name.toLowerCase().includes(query?.toLowerCase()) ||
          f.label.toLowerCase().includes(query?.toLowerCase()),
      );

      if (featuresFilter.length === 0) {
        noResults.value = true;
        hiddenFeatureCount.value = 0;
        features.value = props.featureGroup.features;
        return;
      }

      hiddenFeatureCount.value = props.featureGroup.features.length - featuresFilter.length;
      features.value = featuresFilter;
    };

    return {
      features,
      hiddenFeatureCount,
      noResults,
      state1: ref(""),
      handleInput,
    };
  },
};
</script>

<style></style>
