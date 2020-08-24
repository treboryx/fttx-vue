import Vue from "vue";
import App from "./App.vue";
import VueGeolocation from "vue-browser-geolocation";
import GmapCluster from "vue2-google-maps/dist/components/cluster";
Vue.component("cluster", GmapCluster);
import "./assets/css/main.css";
import VueAnalytics from "vue-ua";
import * as VueGoogleMaps from "vue2-google-maps";
Vue.config.productionTip = false;
Vue.use(VueGeolocation);

Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyBg4wE12cEcuWJGQMbKNnb6m2CUTydSZSY",
    libraries: ["places", "geometry"],
  },
});

Vue.use(VueAnalytics, {
  appName: "fttx",
  appVersion: "1.0.0",
  trackingId: "UA-129649039-2",
});
new Vue({
  render: (h) => h(App),
}).$mount("#app");
