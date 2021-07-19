<template>
<header>
    <Azure fillColor="#fff" class="icon-2x azure-icon"/>
    <h1>Azure Portal Developer Extension</h1>

    <div class="flex-right">
        <b-dropdown aria-role="list">
            <FormatListChecks fillColor="#fff" class="header-button-link" slot="trigger"/>
            <b-dropdown-item
                v-for="config in configFile.configs"
                :key="config.name"
                aria-role="listitem"
                v-on:click="configSelected(config)">
                <CheckBold fillColor="#000" v-if="config.name === currentConfig.name"/>
                {{config.name}}
            </b-dropdown-item>
        </b-dropdown>

        <Help fillColor="#fff" class="header-button-link" @click="helpClicked"/>
    </div>
</header>
</template>

<script lang="ts">
import Azure from "vue-material-design-icons/MicrosoftAzure.vue"
import CheckBold from "vue-material-design-icons/CheckBold.vue"
import FormatListChecks from "vue-material-design-icons/FormatListChecks.vue"
import Help from "vue-material-design-icons/Help.vue"
import { IConfiguration } from "../config/Schema";

export default {
  name: "Header",
  props: {
    configFile: Object,
    currentConfig: Object
  },
  components: {
    // Azure,
    // CheckBold,
    // FormatListChecks,
    // Help
  },
  methods: {
    configSelected(config: IConfiguration) {
      this.$emit("update:currentConfig", config);
    },
    helpClicked() {
      return new Promise((resolve, reject) => chrome.tabs.create({ url: this.configFile?.help }, () => {
        resolve({});
        window.close();
      }));
    }
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

.azure-icon {
  margin-top: -5px;
  margin-left: 3px;
}
</style>
