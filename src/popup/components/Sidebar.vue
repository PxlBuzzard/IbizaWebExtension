<template>
<section>
    <ul class="pure-menu-list">
        <li class="pure-menu-item">
<a
href="#"
class="pure-menu-link"
:class="tabSelected === 'envEditor' ? 'selected' : null"
@click="tabSelected = 'envEditor'"
>Environment Editor</a>
</li>
        <li class="pure-menu-item">
<a
href="#"
class="pure-menu-link"
:class="tabSelected === 'analyzeBlade' ? 'selected' : null"
@click="tabSelected = 'analyzeBlade'"
>Analyze Blade</a>
</li>
        <li class="pure-menu-item">
<a
href="#"
class="pure-menu-link"
:class="tabSelected === 'version' ? 'selected' : null"
@click="tabSelected = 'version'"
>Check Version</a>
</li>
        <li class="pure-menu-item">
<a
href="#"
class="pure-menu-link"
:class="tabSelected === 'settings' ? 'selected' : null"
@click="tabSelected = 'settings'"
>Settings</a>
</li>
        <li
v-if="featureGroups.length > 0"
class="pure-menu-heading"
>
Extension Features
</li>
        <li
v-for="group in featureGroups"
:key="group"
class="pure-menu-item"
>
<a
href="#"
class="pure-menu-link"
:class="tabSelected === group ? 'selected' : null"
@click="tabSelected = group"
>{{ group }}</a>
</li>
    </ul>
</section>
</template>

<script lang="ts">
export default {
    name: "Sidebar",
    props: {
      currentContent: {
        type: Function,
        default: () => {}
      },
      featureGroups: {
        type: Array,
        default: () => []
      }
    },
    emits: ["update:currentContent"],
    data() {
        return {
            tabSelected: ""
        }
    },
    watch: {
        currentContent(val: string): void {
            this.tabSelected = val;
        },
        tabSelected(val: string): void {
            this.$emit("update:currentContent", val);
        }
    }
}
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
