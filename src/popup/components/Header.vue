<template>
<header>
    <Azure fillColor="#fff" class="icon-2x"/>
    <h1>Azure Development</h1>
</header>
</template>

<script lang="ts">
import Azure from "icons/Azure.vue"

export default {
  name: "Sidebar",
  components: {
    Azure
  }
}
</script>

<style scoped>
header {
  background-color: #1c1c1c;
  color: #fff;
  height: 40px;
  box-shadow: 0 8px 16px 0 rgba(0,0,0,.16);
  display: flex;
  align-items: center;
}

h1 {
  height: 40px;
  font-size: 21px;
  font-weight: 500;
  padding: 3px 0 0 10px;
  display: inline-flex;
}
</style>
