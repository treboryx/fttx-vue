import Vue from "vue";
import App from "./App.vue";
import VueGeolocation from "vue-browser-geolocation";
import GmapCluster from "vue2-google-maps/dist/components/cluster";
Vue.component("cluster", GmapCluster);
import "./assets/css/main.css";
import VueAnalytics from "vue-analytics";
import * as VueGoogleMaps from "vue2-google-maps";
Vue.config.productionTip = false;
Vue.use(VueGeolocation);

Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyAMkg5eswyQmqDEc6gkLfq8608cm6UCIWI",
    libraries: ["places", "geometry"],
  },
});

Vue.use(VueAnalytics, {
  id: "UA-129649039-2",
});

new Vue({
  render: (h) => h(App),
}).$mount("#app");
