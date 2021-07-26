<template>
  <el-menu
    :default-openeds="['1', '5']"
    default-active="1"
    background-color="#e9e9e9"
    text-color="#000000"
    active-text-color="#0078d4"
  >
    <el-menu-item index="1" @click="$emit('update-content', 'envEditor')"
      >Environment Editor</el-menu-item
    >
    <el-menu-item index="2" @click="$emit('update-content', 'analyzeBlade')"
      >Analyze Blade</el-menu-item
    >
    <el-menu-item index="3" @click="$emit('update-content', 'version')"
      >Check Ext Version</el-menu-item
    >
    <el-menu-item index="4" @click="$emit('update-content', 'settings')">Settings</el-menu-item>
    <el-submenu v-if="featureGroups.length > 0" index="5">
      <template #title><i class="el-icon-s-tools"></i>Extension Features</template>
      <el-menu-item-group>
        <el-menu-item
          v-for="group in featureGroups"
          :key="group"
          :index="`5-${group}`"
          @click="$emit('update-content', group)"
        >
          {{ group }}
        </el-menu-item>
      </el-menu-item-group>
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
