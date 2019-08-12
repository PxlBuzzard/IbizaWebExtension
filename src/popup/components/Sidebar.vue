<template>
<section>
    <ul class="pure-menu-list">
        <li class="pure-menu-item"><a href="#" class="pure-menu-link" @click="tabSelected = 'envEditor'" :class="tabSelected === 'envEditor' ? 'selected' : null">Environment Editor</a></li>
        <li class="pure-menu-item"><a href="#" class="pure-menu-link" @click="tabSelected = 'analyzeBlade'" :class="tabSelected === 'analyzeBlade' ? 'selected' : null">Analyze Blade</a></li>
        <li class="pure-menu-item"><a href="#" class="pure-menu-link" @click="tabSelected = 'version'" :class="tabSelected === 'version' ? 'selected' : null">Check Version</a></li>
        <li class="pure-menu-item"><a href="#" class="pure-menu-link" @click="tabSelected = 'settings'" :class="tabSelected === 'settings' ? 'selected' : null">Settings</a></li>
        <li class="pure-menu-heading" v-if="featureGroups.length > 0">Extension Features</li>
        <li class="pure-menu-item" v-for="group in featureGroups" :key="group"><a href="#" class="pure-menu-link" @click="tabSelected = group" :class="tabSelected === group ? 'selected' : null">{{ group }}</a></li>
    </ul>
</section>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    name: "Sidebar",
    props: ["currentContent", "featureGroups"],
    data() {
        return {
            tabSelected: ""
        }
    },
    watch: {
        currentContent(val: string) {
            this.tabSelected = val;
        },
        tabSelected(val: string) {
            this.$emit("update:currentContent", val);
        }
    }
});
</script>

<style>
@import "../pure.css";

#sidebar {
  background-color: #323130;
  color: #fff;
}

.pure-menu-heading {
  color: #999;
}

.pure-menu-link {
  color: #fff;
  transition-property: all;
  transition-duration: 600ms;
  transition-timing-function: cubic-bezier(0.16, 1, 0.29, 0.99);
}

.pure-menu-link:hover {
  background-color: rgba(128,128,128,.15);
  color: #fff;
}

.pure-menu-link.selected {
  background-color: rgba(128,128,128,.40);
  color: #fff;
}
</style>
