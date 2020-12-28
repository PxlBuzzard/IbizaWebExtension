<template>
<header>
    <Azure fillColor="#fff" class="icon-2x"/>
    <h1>Azure Portal Developer Extension</h1>
    <div class="flex-right">
        <Help fillColor="#fff" class="header-button-link" @click="helpClicked"/>
    </div>
</header>
</template>

<script lang="ts">
import Azure from "vue-material-design-icons/MicrosoftAzure.vue"
import Help from "vue-material-design-icons/Help.vue"
import Vue from "vue";

export default Vue.extend({
  name: "Header",
  props: ["helpLink"],
  components: {
    Azure,
    Help
  },
  methods: {
    helpClicked() {
      return new Promise((resolve, reject) => chrome.tabs.create({ url: this.helpLink }, () => {
        resolve({});
        window.close();
      }));
    }
  }
});
</script>

<style scoped>
header {
  background-color: orange;
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

.header-button-link {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition-property: all;
  transition-duration: 600ms;
  transition-timing-function: cubic-bezier(0.16, 1, 0.29, 0.99);
}

.header-button-link:hover {
  background-color: #323130;
  cursor: pointer;
}
</style>
