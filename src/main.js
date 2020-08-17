import Vue from "vue";
import App from "./App.vue";
import VueGeolocation from "vue-browser-geolocation";
import GmapCluster from "vue2-google-maps/dist/components/cluster";
Vue.component("cluster", GmapCluster);
import "./assets/css/main.css";

Vue.config.productionTip = false;
Vue.use(VueGeolocation);

import * as VueGoogleMaps from "vue2-google-maps";
Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyAMkg5eswyQmqDEc6gkLfq8608cm6UCIWI",
    libraries: ["places", "geometry"],
  },
});

new Vue({
  render: (h) => h(App),
}).$mount("#app");
