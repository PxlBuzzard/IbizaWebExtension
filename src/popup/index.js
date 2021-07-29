import App from "./App.vue";
import ElementPlus from "element-plus";
import "element-plus/lib/theme-chalk/index.css";
import { createApp } from "vue";

const app = createApp(App);
app.use(ElementPlus);
app.mount("#app");
