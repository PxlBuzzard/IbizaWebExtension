import Vue from "vue";
import VueFluent from "vue-fluent";
import App from "./App.vue";

import "vue-fluent/dist/vue-fluent.min.css"

Vue.use(VueFluent);

new Vue({
    render: h => h(App)
}).$mount("#app");
