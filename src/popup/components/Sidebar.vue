<template>
<ul class="pure-menu-list">
    <li class="pure-menu-item"><a href="#" class="pure-menu-link">Ibiza Env</a></li>
    <li class="pure-menu-item"><a href="#" class="pure-menu-link">Intune Env</a></li>
    <li class="pure-menu-item"><a href="#" class="pure-menu-link">Global Flights</a></li>
    <li class="pure-menu-item"><a href="#" class="pure-menu-link">Extension Flights</a></li>
</ul>
</template>

<script lang="ts">
export default {
  name: "Sidebar"
}
</script>

<style>
@import "../pure.css";

#sidebar {
  width: 200px;
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
</style>
