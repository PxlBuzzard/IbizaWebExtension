<template>
  <el-menu
    :default-openeds="['1', '5']"
    default-active="1"
    background-color="#e9e9e9"
    text-color="#000000"
    active-text-color="#0078d4"
  >
    <el-menu-item index="1" @click="$emit('update-content', 'envEditor')"
      ><i class="el-icon-edit"></i>Environment Editor</el-menu-item
    >
    <el-menu-item
      :disabled="inPortal === false"
      index="2"
      @click="$emit('update-content', 'analyzeBlade')"
      ><i class="el-icon-data-analysis"></i>Analyze Blade</el-menu-item
    >
    <el-menu-item
      :disabled="inPortal === false"
      index="3"
      @click="$emit('update-content', 'version')"
      ><i class="el-icon-news"></i>Check Ext Version</el-menu-item
    >
    <el-menu-item index="4" @click="$emit('update-content', 'settings')"
      ><i class="el-icon-setting"></i>Settings</el-menu-item
    >
    <el-submenu v-if="featureGroups.length > 0" index="5">
      <template #title><i class="el-icon-set-up"></i>Extension Features</template>
      <el-menu-item
        v-for="group in featureGroups"
        :key="group"
        :index="`5-${group}`"
        @click="$emit('update-content', group)"
      >
        {{ group }}
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script lang="ts">
import { onUpdated, ref } from "vue";

export default {
  name: "Sidebar",
  props: {
    featureGroups: {
      type: Array,
      default: () => [],
    },
    currentEnv: {
      type: String,
      required: true,
    },
  },
  emits: ["update-content"],
  setup(props) {
    const inPortal = ref(false);

    onUpdated(() => {
      if (props.currentEnv != undefined && props.currentEnv !== "") {
        inPortal.value = props.currentEnv !== "unknown";
      }
    });

    return { inPortal };
  },
};
</script>

<style scoped>
.el-menu-item,
.el-submenu .el-menu-item,
.el-submenu .el-submenu__title {
  height: 35px;
  line-height: 35px;
}
</style>
