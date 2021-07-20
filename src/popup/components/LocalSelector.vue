<template>
  <section>
    <h2>Local Extension</h2>
    <div class="field">
      <b-radio
        v-model="extensionSelected"
        :native-value="''"
        @input="$emit('input', extensionSelected)"
      >
        None
      </b-radio>
    </div>
    <div v-for="ext in extensions" :key="ext.name" class="field">
      <b-radio
        v-model="extensionSelected"
        :native-value="ext.name"
        @input="$emit('input', extensionSelected)"
      >
        {{ ext.name }}
      </b-radio>
    </div>
  </section>
</template>

<script lang="ts">
import { ref } from "vue";
export default {
  name: "LocalSelector",
  props: {
    value: {
      type: String,
      default: "",
    },
    extensions: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["input"],
  setup(props) {
    const extensionSelected = ref(props.value);

    return { extensionSelected };
  },
};
</script>

<style>
.field:not(:last-child) {
  margin-bottom: 0.75rem;
}
</style>
