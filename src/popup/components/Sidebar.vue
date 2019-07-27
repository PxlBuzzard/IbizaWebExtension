<template>
<section>
    <ul class="pure-menu-list">
        <li class="pure-menu-item"><a href="#" class="pure-menu-link" @click="tabSelected = 'envEditor'" selected>Env Editor</a></li>
        <li class="pure-menu-item"><a href="#" class="pure-menu-link" @click="tabSelected = 'extensionFlights'">Extension Flights</a></li>
        <li class="pure-menu-item"><a href="#" class="pure-menu-link" @click="tabSelected = 'settings'">Settings</a></li>
    </ul>
</section>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    name: "Sidebar",
    props: ["currentContent"],
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

.pure-menu-link {
  color: #fff;
}

.pure-menu-link:hover {
  background-color: rgba(128,128,128,.15);
  color: #fff;
}

.pure-menu-link:active,
.pure-menu-link:focus {
  background-color: rgba(128,128,128,.40);
  color: #fff;
}
</style>
