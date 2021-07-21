<template>
  <el-container id="app">
    <el-header>
      <Header
        v-model:currentConfig="currentConfig"
        :config-file="configFile"
        @select-config="selectConfig"
      />
    </el-header>
    <el-container>
      <el-aside id="sidebar" width="195px">
        <Apply
          :config="currentConfig.value"
          :current-env="currentEnv.value"
          :current-url="currentUrl.value"
          :local-extension="localExtension.value"
          :feature-groups="allFeatureGroups.value"
        />
        <Sidebar
          v-model:currentContent="currentContent.value"
          :feature-groups="dynamicFeatureGroups.map((f) => f.label)"
          @update-content="updateContent"
        />
      </el-aside>
      <el-main id="content">
        <div v-if="currentContent === 'loadConfig'" id="load-config">
          <LoadConfig />
        </div>
        <div v-if="currentContent === 'envEditor'" id="env-editor">
          <NotifyUnknownPortal :current-env="currentEnv.value" />
          <NotifyUpdate :is-visible="updateRequired.value" />
          <EnvSelector v-model="currentEnv.value" :environments="currentConfig.environments" />
          <LocalSelector v-model="localExtension.value" :extensions="currentConfig.extensions" />
          <FeatureGroup
            v-for="group in currentConfig.featureGroups"
            :key="group.label"
            v-model:featureGroup="group.features"
          />
        </div>
        <div v-if="selectedDynamicGroup">
          <NotifyUnknownPortal :current-env="currentEnv.value" />
          <NotifyUpdate :is-visible="updateRequired.value" />
          <FeatureGroup v-model:featureGroup="selectedDynamicGroup" />
        </div>
        <div v-if="currentContent === 'analyzeBlade'" id="analyze-blade">
          <Analyze />
        </div>
        <div v-if="currentContent === 'version'" id="check-version">
          <NotifyUnknownPortal :current-env="currentEnv.value" />
          <Versions />
        </div>
        <div v-if="currentContent === 'settings'" id="settings-content">
          <Settings
            :changelog="configFile.changelog"
            :config-loader="configFileLoader"
            :help-link="configFile.help"
          />
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import Analyze from "./pages/Analyze.vue";
import Apply from "./components/Apply.vue";
import ConfigLoader from "./config/ConfigLoader";
import EnvSelector from "./components/EnvSelector.vue";
import FeatureGroup from "./pages/FeatureGroup.vue";
import Header from "./components/Header.vue";
import LocalSelector from "./components/LocalSelector.vue";
import LoadConfig from "./pages/LoadConfig.vue";
import NotifyUnknownPortal from "./components/NotifyUnknownPortal.vue";
import NotifyUpdate from "./components/NotifyUpdate.vue";
import Settings from "./pages/Settings.vue";
import Sidebar from "./components/Sidebar.vue";
import UrlParser from "./url/UrlParser";
import Versions from "./pages/Versions.vue";
import { IConfigFile, IConfiguration, IFeatureGroup } from "./config/Schema";
import { IUrlComponents } from "./url/IUrlComponents";
import { computed, onMounted, ref } from "vue";

export default {
  components: {
    Analyze,
    Apply,
    Settings,
    EnvSelector,
    FeatureGroup,
    Header,
    LoadConfig,
    LocalSelector,
    NotifyUnknownPortal,
    NotifyUpdate,
    Sidebar,
    Versions,
  },
  setup(props) {
    const currentUrl = ref<IUrlComponents>({
      origin: "host",
      query: {},
    });
    const currentEnv = ref("");
    const currentConfig = ref<IConfiguration>({
      name: "",
      environments: [],
      extensions: [],
      featureGroups: [],
      dynamicFeatureGroups: [],
    });
    const localExtension = ref("");
    const configFileLoader = new ConfigLoader();
    const configFile = ref<IConfigFile>({
      version: "0",
      help: "",
      changelog: [],
      configs: [
        {
          name: "",
          environments: [],
          extensions: [],
          featureGroups: [],
          dynamicFeatureGroups: [],
        },
      ],
    });
    const dynamicFeatureGroups = ref<IFeatureGroup[]>([]);
    const currentContent = ref("loadConfig");
    const updateRequired = ref(false);

    // computeds
    const selectedDynamicGroup = computed((): IFeatureGroup => {
      return dynamicFeatureGroups.value.filter((g) => g.label === currentContent.value)[0];
    });
    const allFeatureGroups = computed((): IFeatureGroup[] => {
      return [...currentConfig.value.featureGroups, ...dynamicFeatureGroups.value];
    });

    function updateContent(page: string): void {
      currentContent.value = page;
    }

    function selectConfig(config: IConfiguration): void {
      currentConfig.value = config;
    }

    onMounted(async () => {
      // get current url
      let urlParser = new UrlParser();
      currentUrl.value = await urlParser.parseUrl();

      // get config
      configFileLoader.loaded = (cf) => {
        configFile.value = cf;
        currentConfig.value = configFile.value.configs[0];

        // change current config if we're in a portal that matches
        for (let i = 0; i < configFile.value.configs.length; i++) {
          // check current env
          for (let env of configFile.value.configs[i].environments) {
            if (currentUrl.value.origin === `https://${env.host}`) {
              currentConfig.value = configFile.value.configs[i];

              if (
                !env.params ||
                Object.keys(env.params).every(
                  (p) => !env.params || currentUrl.value.query[p] === env.params[p],
                )
              ) {
                currentEnv.value = env.label;
                break;
              }
            }
          }
          if (currentEnv.value !== "") {
            break;
          }
        }

        // hack to set currentEnv to something
        if (currentEnv.value == "") {
          currentEnv.value = "unknown";
        }

        // check current local extension
        if (
          currentUrl.value.query["feature.canmodifyextensions"] === "true" &&
          currentUrl.value.testExtension
        ) {
          localExtension.value = currentUrl.value.testExtension;
        }

        // check current features
        currentConfig.value.featureGroups.forEach((group) => {
          group.features.forEach((feature) => {
            if (currentUrl.value.query.hasOwnProperty(feature.name)) {
              // $set.value(feature, "selected", currentUrl.value.query[feature.name]);
            }
          });
        });

        // get dynamic features
        if (
          currentConfig.value != undefined &&
          currentConfig.value.dynamicFeatureGroups != undefined
        ) {
          currentConfig.value.dynamicFeatureGroups.forEach(async (group) => {
            if (group.source[currentEnv.value]) {
              let features = await configFileLoader.loadFeatures(
                group.source[currentEnv.value],
                group.prefix,
              );
              features.forEach((feature) => {
                if (currentUrl.value.query.hasOwnProperty(feature.name)) {
                  // $set.value(feature, "selected", currentUrl.value.query[feature.name]);
                }
              });
              dynamicFeatureGroups.value.push({
                label: group.label,
                features: features,
              });
            }
          });
        }

        currentContent.value = "envEditor";
      };
      configFileLoader.failedFetch = (reason) => {
        console.error("Config load failed", reason);
      };
      configFileLoader.incompatible = (extVer, configVer) => {
        updateRequired.value = true;
      };

      await configFileLoader.loadConfig();
    });

    return {
      currentUrl,
      currentEnv,
      currentConfig,
      localExtension,
      configFileLoader,
      configFile,
      dynamicFeatureGroups,
      currentContent,
      updateRequired,
      selectedDynamicGroup,
      allFeatureGroups,
      updateContent,
      selectConfig,
    };
  },
};
</script>

<style>
html {
  font-family: az_ea_font, "Segoe UI", az_font, system-ui, sans-serif;
}

#app {
  width: 780px;
}

#content {
  overflow: auto;
  height: 500px;
}

#content h2 {
  font-size: 20px;
  font-weight: 500;
}

#content section {
  margin-bottom: 20px;
}

.material-design-icon.icon-2x {
  width: 40px;
  height: 40px;
}

.material-design-icon.icon-2x > .material-design-icon__svg {
  width: 40px;
  height: 40px;
}

.header-button-link.material-design-icon > .material-design-icon__svg {
  position: relative;
}
</style>
