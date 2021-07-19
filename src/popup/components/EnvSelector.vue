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
import { onMounted, ref } from "vue";

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
    setup(props) {
      const envSelected = ref("");

      onMounted(() => {
        envSelected.value = props.value || "";
      });
      return {envSelected}
    }
}
</script>

<style>
</style>
