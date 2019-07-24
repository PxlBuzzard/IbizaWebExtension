<template>
<header>
    <Azure fillColor="#fff" class="icon-2x"/>
    <h1>Azure Development</h1>
    <div class="flex-right">
        <Help fillColor="#fff" class=""/>
    </div>
</header>
</template>

<script lang="ts">
import Azure from "icons/Azure.vue"
import Help from "icons/Help.vue"

export default {
  name: "Header",
  components: {
    Azure,
    Help
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

.flex-right {
  justify-content: flex-end;
  flex: 1;
  display:inline-flex;
}
</style>
