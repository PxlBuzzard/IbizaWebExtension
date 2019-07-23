<template>
<section>
    <div class="field">
        <b-radio
            v-for="ext in extensions"
            v-bind:key="ext"
            v-model="extensionSelected"
            :native-value="ext">
            {{ ext }}
        </b-radio>
    </div>
</section>
</template>

<script lang="ts">
export default {
    name: "LocalSelector",
    props: ['extensions'],
    data() {
        return {
            extensionSelected: ""
        }
    }
}
</script>

<style>
.field:not(:last-child) {
    margin-bottom: .75rem;
}
</style>
