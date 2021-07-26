<template>
  <header>
    <i class="el-icon-eleme header-button-link" />
    <h1>Azure Portal Developer Extension</h1>

    <div class="flex-right">
      <el-dropdown>
        <i class="el-icon-folder-opened header-button-link" />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="config in configFile.configs"
              :key="config.name"
              @click="$emit('select-config', config)"
            >
              {{ config.name }}
              <i v-if="config.name === currentConfig.name" class="el-icon-check" />
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <i class="el-icon-help header-button-link" @click="helpClicked" />
    </div>
  </header>
</template>

<script lang="ts">
export default {
  name: "Header",
  props: {
    configFile: {
      type: Object,
      required: true,
    },
    currentConfig: {
      type: Object,
      required: true,
    },
  },
  emits: ["select-config"],
  setup(props) {
    function helpClicked(): Promise<any> {
      return new Promise((resolve) =>
        chrome.tabs.create({ url: props.configFile.help }, () => {
          resolve({});
          window.close();
        }),
      );
    }

    return { helpClicked };
  },
};
</script>

<style scoped>
header {
  background-color: #1c1c1c;
  color: #fff;
  height: 40px;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.16);
  display: flex;
  align-items: center;
}

h1 {
  font-size: 1.5rem;
  font-weight: 500;
  padding-left: 10px;
  display: inline-flex;
}

.flex-right {
  justify-content: flex-end;
  flex: 1;
  display: inline-flex;
}

.header-button-link {
  width: 40px;
  height: 40px;
  font-size: 1.5rem;
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
  margin-left: 5px;
}
</style>
