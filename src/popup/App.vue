<template>
<div id="app">
    <div class="columns no-margin">
        <div class="column">
            <Header v-bind:helpLink="config.help"/>
        </div>
    </div>
    <div class="columns">
        <div id="sidebar" class="column is-one-quarter">
            <Apply
                v-bind:config="config"
                v-bind:currentEnv="currentEnv"
                v-bind:currentUrl="currentUrl"
                v-bind:localExtension="localExtension"
                v-bind:featureGroups="config.featureGroups"/>
            <Sidebar/>
            <Versions />
            <Analyze />
        </div>
        <main id="content" class="column">
            <NotifyUnknownPortal v-bind:currentEnv="currentEnv"/>
            <NotifyUpdate v-bind:isVisible="updateRequired"/>
            <EnvSelector v-bind:environments="config.environments" v-bind:currentEnv.sync="currentEnv"/>
            <LocalSelector v-bind:extensions="config.localExtensions" v-bind:localExtension.sync="localExtension"/>
            <FeatureGroups v-bind:featureGroups.sync="config.featureGroups"/>
            <Settings v-bind:configLoader="configLoader"></Settings>
        </main>
    </div>
</div>
</template>

<script lang="ts">
import Analyze from "./components/Analyze.vue";
import Apply from "./components/Apply.vue";
import ConfigLoader from "./config/ConfigLoader";
import EnvSelector from "./components/EnvSelector.vue";
import FeatureGroups from "./components/FeatureGroups.vue";
import Header from "./components/Header.vue";
import LocalSelector from "./components/LocalSelector.vue";
import NotifyUnknownPortal from "./components/NotifyUnknownPortal.vue";
import NotifyUpdate from "./components/NotifyUpdate.vue";
import Settings from "./components/Settings.vue";
import Sidebar from "./components/Sidebar.vue";
import UrlParser from "./url/UrlParser";
import Versions from "./components/Versions.vue";
import Vue from "vue";
import { IConfiguration } from "./config/Schema";
import { IUrlComponents } from "./url/IUrlComponents";

export default Vue.extend({
    components: {
        Analyze,
        Apply,
        Settings,
        EnvSelector,
        FeatureGroups,
        Header,
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
            localExtension: "",
            configLoader: new ConfigLoader(),
            config: <IConfiguration>{
                version: "0",
                help: "",
                environments: [],
                localExtensions: [],
                featureGroups: [],
                dynamicFeatureGroups: []
            },
            updateRequired: false
        };
    },
    async created() {
        // get current url
        let urlParser = new UrlParser();
        this.currentUrl = await urlParser.parseUrl();

        // get config
        this.configLoader.loaded = config => {
            this.config = config;

            // check current env
            for (let env of config.environments) {
                if (this.currentUrl.origin === `https://${env.host}` && (!env.params || Object.keys(env.params).every(p => !env.params || this.currentUrl.query[p] === env.params[p]))) {
                    this.currentEnv = env.label;
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
            this.config.featureGroups.forEach(group => {
                group.features.forEach(feature => {
                    if (this.currentUrl.query.hasOwnProperty(feature.name)) {
                        feature.selected = this.currentUrl.query[feature.name];
                    }
                });
            });

            // get dynamic features
            if (config.dynamicFeatureGroups) {
                config.dynamicFeatureGroups.forEach(async group => {
                    if (group.source[this.currentEnv]) {
                        let features = await this.configLoader.loadFeatures(group.source[this.currentEnv], group.prefix);
                        features.forEach(feature => {
                            if (this.currentUrl.query.hasOwnProperty(feature.name)) {
                                feature.selected = this.currentUrl.query[feature.name];
                            }
                        });
                        this.config.featureGroups.push({
                            label: group.label,
                            features: features
                        });
                    }
                });
            }
        };
        this.configLoader.failedFetch = reason => {
            console.error("config load failed", reason);
        }
        this.configLoader.incompatible = (extVer, configVer) => {
            this.updateRequired = true;
        }

        await this.configLoader.loadConfig();
    }
})
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
