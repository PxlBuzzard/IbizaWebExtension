import App from "./App.vue";
import Vue from "vue";
import VueFluent from "vue-fluent";

import "vue-material-design-icons/styles.css";
import "vue-fluent/dist/vue-fluent.min.css";

Vue.config.devtools = false;

Vue.use(VueFluent);

new Vue({
    render: h => h(App)
}).$mount("#app");
