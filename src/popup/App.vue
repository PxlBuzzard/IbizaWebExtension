<template>
<div id="app">
    <div class="columns no-margin">
        <div class="column">
            <Header
                v-model:currentConfig="currentConfig"
                :config-file="configFile"
/>
        </div>
    </div>
    <div class="columns">
        <div
id="sidebar"
class="column is-one-quarter"
>
            <Apply
                :config="currentConfig"
                :current-env="currentEnv"
                :current-url="currentUrl"
                :local-extension="localExtension"
                :feature-groups="allFeatureGroups"
/>
            <Sidebar
v-model:currentContent="currentContent"
:feature-groups="dynamicFeatureGroups.map(f => f.label)"
/>
        </div>
        <main
id="content"
class="column"
>
            <div
v-if="currentContent === 'loadConfig'"
id="load-config"
>
                <LoadConfig />
            </div>
            <div
v-if="currentContent === 'envEditor'"
id="env-editor"
>
                <NotifyUnknownPortal :current-env="currentEnv" />
                <NotifyUpdate :is-visible="updateRequired" />
                <EnvSelector
v-model="currentEnv"
:environments="currentConfig.environments"
/>
                <LocalSelector
v-model="localExtension"
:extensions="currentConfig.extensions"
/>
                <FeatureGroup
                    v-for="group in currentConfig.featureGroups"
                    :key="group.label"
                    v-model:featureGroup="group.features"
/>
            </div>
            <div v-if="selectedDynamicGroup">
                <NotifyUnknownPortal :current-env="currentEnv" />
                <NotifyUpdate :is-visible="updateRequired" />
                <FeatureGroup v-model:featureGroup="selectedDynamicGroup" />
            </div>
            <div
v-if="currentContent === 'analyzeBlade'"
id="analyze-blade"
>
                <Analyze />
            </div>
            <div
v-if="currentContent === 'version'"
id="check-version"
>
                <NotifyUnknownPortal :current-env="currentEnv" />
                <Versions />
            </div>
            <div
v-if="currentContent === 'settings'"
id="settings-content"
>
                <Settings
                    :changelog="configFile.changelog"
                    :config-loader="configFileLoader"
                    :help-link="configFile.help"
/>
            </div>
        </main>
    </div>
</div>
</template>

<script lang="ts">
import Analyze from "./components/Analyze.vue";
import Apply from "./components/Apply.vue";
import ConfigLoader from "./config/ConfigLoader";
import EnvSelector from "./components/EnvSelector.vue";
import FeatureGroup from "./components/FeatureGroup.vue";
import Header from "./components/Header.vue";
import LocalSelector from "./components/LocalSelector.vue";
import LoadConfig from "./pages/LoadConfig.vue";
import NotifyUnknownPortal from "./components/NotifyUnknownPortal.vue";
import NotifyUpdate from "./components/NotifyUpdate.vue";
import Settings from "./components/Settings.vue";
import Sidebar from "./components/Sidebar.vue";
import UrlParser from "./url/UrlParser";
import Versions from "./components/Versions.vue";
import { IConfigFile, IConfiguration, IFeatureGroup } from "./config/Schema";
import { IUrlComponents } from "./url/IUrlComponents";

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
        Versions
    },
    data() {
        return {
            currentUrl: <IUrlComponents>{
                origin: "host",
                query: {}
            },
            currentEnv: "",
            currentConfig: <IConfiguration>{
                name: "",
                environments: [],
                extensions: [],
                featureGroups: [],
                dynamicFeatureGroups: []
            },
            localExtension: "",
            configFileLoader: new ConfigLoader(),
            configFile: <IConfigFile>{
                version: "0",
                help: "",
                changelog: [],
                configs: [{
                  name: "",
                  environments: [],
                  extensions: [],
                  featureGroups: [],
                  dynamicFeatureGroups: []
                }]
            },
            dynamicFeatureGroups: <IFeatureGroup[]>[],
            currentContent: "loadConfig",
            updateRequired: false
        };
    },
    computed: {
        selectedDynamicGroup(): IFeatureGroup {
            return this.dynamicFeatureGroups.filter(g => g.label === this.currentContent)[0];
        },
        allFeatureGroups(): IFeatureGroup[] {
            return [...this.currentConfig.featureGroups, ...this.dynamicFeatureGroups];
        }
    },
    async created(): Promise<void> {
        // get current url
        let urlParser = new UrlParser();
        this.currentUrl = await urlParser.parseUrl();

        // get config
        this.configFileLoader.loaded = cf => {
            this.configFile = cf;
            this.currentConfig = this.configFile.configs[0];

            // change current config if we're in a portal that matches
            for (let i = 0; i < this.configFile.configs.length; i++) {
              // check current env
              for (let env of this.configFile.configs[i].environments) {
                if (this.currentUrl.origin === `https://${env.host}`) {
                      this.currentConfig = this.configFile.configs[i];

                      if (!env.params || Object.keys(env.params).every(p => !env.params || this.currentUrl.query[p] === env.params[p])) {
                          this.currentEnv = env.label;
                          break;
                      }
                  }
              }
              if (this.currentEnv !== "") {
                  break;
              }
            }

            // hack to set currentEnv to something
            if (this.currentEnv == "") {
                this.currentEnv = "unknown";
            }

            // check current local extension
            if (this.currentUrl.query["feature.canmodifyextensions"] === "true" && this.currentUrl.testExtension) {
                this.localExtension = this.currentUrl.testExtension;
            }

            // check current features
            this.currentConfig.featureGroups.forEach(group => {
                group.features.forEach(feature => {
                    if (this.currentUrl.query.hasOwnProperty(feature.name)) {
                        // this.$set(feature, "selected", this.currentUrl.query[feature.name]);
                    }
                });
            });

            // get dynamic features
            if (this.currentConfig != undefined && this.currentConfig.dynamicFeatureGroups != undefined) {
                this.currentConfig.dynamicFeatureGroups.forEach(async group => {
                    if (group.source[this.currentEnv]) {
                        let features = await this.configFileLoader.loadFeatures(group.source[this.currentEnv], group.prefix);
                        features.forEach(feature => {
                            if (this.currentUrl.query.hasOwnProperty(feature.name)) {
                                // this.$set(feature, "selected", this.currentUrl.query[feature.name]);
                            }
                        });
                        this.dynamicFeatureGroups.push({
                            label: group.label,
                            features: features
                        });
                    }
                });
            }

            this.currentContent = "envEditor";
        };
        this.configFileLoader.failedFetch = reason => {
            console.error("Config load failed", reason);
        }
        this.configFileLoader.incompatible = (extVer, configVer) => {
            this.updateRequired = true;
        }

        await this.configFileLoader.loadConfig();
    }
}
</script>

<style>
html {
  font-family: az_ea_font, 'Segoe UI', az_font, system-ui, sans-serif;
}

#app {
  width: 780px;
}

#content {
  overflow: auto;
  height: 500px;
  margin-right: .75rem;
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

.columns.no-margin {
  margin-bottom: 0 !important;
}
</style>
