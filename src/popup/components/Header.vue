<template>
<header>
    <i
class="el-icon-eleme"
/>
    <h1>Azure Portal Developer Extension</h1>

    <div class="flex-right">
        <!-- <el-select>
            <i
class="el-icon-folder-opened"
/>
            <el-option
                v-for="config in configFile.configs"
                :key="config.name"
                :label="config.name"
                @click="configSelected(config)"
>
                <i
                v-if="config.name === currentConfig.name"
                class="el-icon-check"
                />
            </el-option>
        </el-select> -->

        <i
class="el-icon-help"
@click="helpClicked"
/>
    </div>
</header>
</template>

<script lang="ts">
import { IConfiguration } from "../config/Schema";

export default {
  name: "Header",
  props: {
    configFile: Object,
    currentConfig: Object
  },
  emits: ["update:currentConfig"],
  methods: {
    configSelected(props, config: IConfiguration): void {
      props.$emit("update:currentConfig", config);
    },
    helpClicked(props): Promise<any> {
      return new Promise((resolve) => chrome.tabs.create({ url: props.configFile.help }, () => {
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

.el-icon-eleme {
  margin-top: -5px;
  margin-left: 3px;
}
</style>
