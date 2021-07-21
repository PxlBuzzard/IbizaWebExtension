<template>
  <el-menu :default-openeds="['1', '2']" default-active="1">
    <el-submenu index="1">
      <template #title><i class="el-icon-message"></i>Stuff</template>
      <el-menu-item-group>
        <el-menu-item index="1-1" @click="$emit('update-content', 'envEditor')"
          >Environment Editor</el-menu-item
        >
        <el-menu-item index="1-2" @click="$emit('update-content', 'analyzeBlade')"
          >Analyze Blade</el-menu-item
        >
        <el-menu-item index="1-3" @click="$emit('update-content', 'version')"
          >Check Ext Version</el-menu-item
        >
        <el-menu-item index="1-4" @click="$emit('update-content', 'settings')"
          >Settings</el-menu-item
        >
      </el-menu-item-group>
    </el-submenu>
    <el-submenu v-if="featureGroups.length > 0" index="2">
      <template #title><i class="el-icon-message"></i>Extension Features</template>
      <el-menu-item v-for="group in featureGroups" :key="group">
        <a
          href="#"
          :class="tabSelected === group ? 'selected' : null"
          @click="tabSelected = group"
          >{{ group }}</a
        >
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script lang="ts">
export default {
  name: "Sidebar",
  props: {
    featureGroups: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["update-content"],
};
</script>

<style></style>
