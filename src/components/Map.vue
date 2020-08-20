<template>
  <div>
    <loading :active.sync="isLoading" :is-full-page="fullPage"></loading>
    <GmapMap
      :center="myCoordinates"
      :zoom="zoom"
      class="w-full bg-gray-500 h-full"
      ref="mapRef"
      :options="options"
      @dragend="handleDrag"
    >
      <gmap-info-window
        :options="infoOptions"
        :position="infoWindowPos"
        :opened="infoWinOpen"
        @closeclick="infoWinOpen = false"
      ></gmap-info-window>

      <!-- <cluster> -->
      <!-- <Gmap-Marker
        v-for="(marker, index) in markers"
        :key="index"
        :position="marker.position"
        @click="markerInfo(marker, index)"
      ></Gmap-Marker>-->
      <Gmap-Marker
        v-if="this.place"
        @click="showInfo()"
        :position="{
          lat: this.place.geometry.location.lat(),
          lng: this.place.geometry.location.lng(),
        }"
        :icon="{ url: require('../assets/img/g-marker.png') }"
      ></Gmap-Marker>
      <!-- </cluster> -->
      <gmap-polygon :options="polygonOptions" :paths="paths"></gmap-polygon>
    </GmapMap>
    <!-- "top: 0; right: 0; width: calc(100% - 100px); position: absolute; z-index: 100" -->
    <div
      style="position: absolute; top: 70px; left: 10px; width: calc(100% - 100px); z-index: 999;"
    >
      <label>
        <gmap-autocomplete
          placeholder="Type an address Ex. Filellinon 10, Athens, Greece"
          class="shadow appearance-none border rounded w-2/6 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          @place_changed="setPlace"
        ></gmap-autocomplete>
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
          @click="usePlace"
        >Add</button>
      </label>
    </div>
    <div class="relative h-full w-full">
      <div class="absolute bottom-0 right-0 h-64 w-48" style="text-align: left;">
        <button
          @click="
            buttons.ote.isOn = !buttons.ote.isOn;
            showCabinets('ote');
          "
          :class="
            buttons.ote.isOn
              ? (buttons.ote.text = '✔ OTE')
              : (buttons.ote.text = 'OTE')
          "
          type="button"
          style="position: fixed; z-index: 999; bottom: 600px;"
          class="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
        >{{ buttons.ote.text }}</button>
        <button
          @click="
            buttons.wind.isOn = !buttons.wind.isOn;
            showCabinets('wind');
          "
          :class="
            buttons.wind.isOn
              ? (buttons.wind.text = '✔ WIND')
              : (buttons.wind.text = 'WIND')
          "
          style="position: fixed; z-index: 999; bottom: 550px;"
          class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded"
        >{{ buttons.wind.text }}</button>
        <button
          @click="
            buttons.vf.isOn = !buttons.vf.isOn;
            showCabinets('vf');
          "
          :class="
            buttons.vf.isOn
              ? (buttons.vf.text = '✔ Vodafone')
              : (buttons.vf.text = 'Vodafone')
          "
          style="position: fixed; z-index: 999; bottom: 500px;"
          class="bg-red-700 hover:bg-red-500 text-white font-bold py-2 px-4 rounded"
        >{{ buttons.vf.text }}</button>
        <button
          @click="
            buttons.rurcon.isOn = !buttons.rurcon.isOn;
            showCabinets('rurcon');
          "
          :class="
            buttons.rurcon.isOn
              ? (buttons.rurcon.text = '✔ Rural Connect')
              : (buttons.rurcon.text = 'Rural Connect')
          "
          style="position: fixed; z-index: 999; bottom: 450px;"
          class="bg-orange-800 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
        >{{ buttons.rurcon.text }}</button>
      </div>
    </div>

    <!-- <div v-if="debugging" style="z-index: 999;">
      <div
        style="max-width: 800px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between"
      >
        <div>
          <h1>Your coordinates:</h1>
          <p>{{ myCoordinates.lat }} Latitude, {{ myCoordinates.lng }} Longitude</p>
        </div>
        <div>
          <h1>Map coordinates:</h1>
          <p>
            {{ mapCoordinates.lat }} Latitude,
            {{ mapCoordinates.lng }} Longitude
          </p>
        </div>
      </div>
    </div>-->
    <div
      class="rounded relative h-48 w-36 left-2"
      style="position: relative; top: 250px; z-index: 999;"
    >
      <div class="rounded bg-white shadow-md h-48 w-36 p-6 flex flex-col justify-around">
        <div>
          <p class="text-base text-gray-600">Cabinets</p>
        </div>
        <div>
          <p class="text-2xl text-gray-700 font-bold">
            <animated-number :value="numberOfCabinets" :duration="3000" round="1" />
          </p>
        </div>
        <div>
          <p class="text-base text-gray-600">Centers</p>
        </div>
        <div>
          <p class="text-2xl text-gray-700 font-bold">
            <animated-number :value="numberOfCenters" :duration="5000" round="1" />
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import AnimatedNumber from "animated-number-vue";
import axios from "axios";
import * as MarkerClusterer from "marker-clusterer-plus";
import { clusterStyle, mapStyle } from "../assets/options";
import borders from "../assets/borders";

export default {
  data() {
    return {
      isLoading: false,
      fullPage: true,
      map: null,
      myCoordinates: {
        lat: 37.9432,
        lng: 23.6709,
      },
      zoom: 10,
      windowHeight: `${window.innerHeight - 65}px`,
      options: {
        styles: mapStyle,
      },
      buttons: {
        ote: {
          isOn: false,
          text: "OTE",
        },
        wind: {
          isOn: false,
          text: "WIND",
        },
        vf: {
          isOn: false,
          text: "Vodafone",
        },
        rurcon: {
          isOn: false,
          text: "Rural Connect",
        },
      },
      numberOfCabinets: 0,
      numberOfCenters: 0,
      storedMarkers: [],
      markerCluster: null,
      debugging: true,
      paths: [],
      polygons: [],
      polygonOptions: {
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.01,
      },
      markers: [],
      place: null,
      infoWindowPos: null,
      infoWinOpen: false,
      currentMidx: null,
      openInfoWindow: null,
      infoOptions: {
        content: null,
        //optional: offset infowindow so it visually sits nicely on top of our marker
        pixelOffset: {
          width: 0,
          height: -35,
        },
      },
      markerIcons: {
        Vodafone: require("../assets/img/vf-marker-minified.png"),
        OTE: require("../assets/img/ote-marker-minified.png"),
        WIND: require("../assets/img/wind-marker-minified.png"),
        RURALCONNECT: require("../assets/img/rurcon-marker-minified.png"),
      },
    };
  },
  components: {
    Loading,
    AnimatedNumber,
  },
  created() {
    // does the user have a saved center? use it instead of the default
    if (localStorage.center) {
      this.myCoordinates = JSON.parse(localStorage.center);
    } else {
      // get user's coordinates from browser request
      this.$getLocation({})
        .then((coordinates) => {
          this.myCoordinates = coordinates;
        })
        .catch((error) => alert(error));
    }

    // does the user have a saved zoom? use it instead of the default
    if (localStorage.zoom) {
      this.zoom = parseInt(localStorage.zoom);
    }
  },
  async mounted() {
    this.isLoading = true;
    let ref = this;
    // add the map to a data object
    this.$refs.mapRef.$mapPromise.then((map) => (this.map = map));

    // DSLAM LOADING
    let dslam = await axios
      .get("https://api.fttx.gr/api/v1/centers?limit=0&approved=true")
      .then((r) => r);

    this.numberOfCenters = dslam.data.data.length;
    dslam.data.data.forEach((d) => {
      d.infoText = `Center ID: ${d.id}<br>NAME: <b>${d.name}</b><br>Center Database ID: ${d._id}`;
      const marker = new google.maps.Marker({
        position: d.position,
        map: this.map,
        icon: require("../assets/img/ote-marker-center-minified.png"),
      });
      marker.db = d;
      const infowindow = new google.maps.InfoWindow({
        content: d.infoText,
      });
      marker.addListener("click", function () {
        this.showInfo;
        infowindow.open(this.map, marker);
      });
      this.markers.push(marker);
    });
    this.clusterMyMarkers();
    // DSLAM LOADING END -- POLYGON LOADING START
    borders.forEach((e) => {
      let storedPoly = new google.maps.Polygon({
        paths: e[0],
        strokeColor: "#FFF",
        strokeOpacity: 0,
        strokeWeight: 2,
        fillColor: "#FFF",
        fillOpacity: 0,
        map: this.map,
      });
      this.polygons.push(storedPoly);
      this.paths.push(e[0]);
    });
    // POLYGON LOADING END -- LOAD EVERYTHING ELSE BUT INVISIBLE (NOTE: This part here is what causing the initial lag spike because there's just too much data. Working on it.)
    let cabinets = await axios
      .get("https://api.fttx.gr/api/v1/cabinets?limit=0") // must be &approved=true
      .then((r) => r);
    cabinets = cabinets.data.data.filter((d) => d.type !== "DSLAM");
    this.numberOfCabinets = cabinets.length;
    cabinets.forEach((d) => {
      const marker = new google.maps.Marker({
        position: d.position,
        map: this.map,
        icon: this.markerIcons[d.isp],
      });
      marker.setVisible(false);
      marker.db = d;
      marker.addListener("click", function () {
        ref.infoWindow(marker);
      });
      this.markers.push(marker);
      this.storedMarkers.push("OTE");
      this.storedMarkers.push("Vodafone");
      this.storedMarkers.push("WIND");
      this.storedMarkers.push("RURALCONNECT");
    });
    this.isLoading = false;
  },
  methods: {
    async showCabinets(cab) {
      let ref = this;
      const format = {
        ote: "OTE",
        wind: "WIND",
        vf: "Vodafone",
        rurcon: "RURALCONNECT",
      };

      if (this.buttons[cab].isOn) {
        let temp = [];
        if (this.storedMarkers.includes(format[cab])) {
          const c = this.markers.filter((m) => m.db.isp === format[cab]);
          c.forEach((ca) => {
            temp.push(ca);
            ca.setVisible(true);
          });
        } else {
          let c = await axios
            .get(
              `https://api.fttx.gr/api/v1/cabinets?isp=${format[cab]}&limit=0`
            )
            .then((r) => r);

          this.storedMarkers.push(format[cab]);
          c.data.data.forEach((d) => {
            const dslams = this.markers.filter((d) => d.db.type === "DSLAM");
            let ak;
            const marker = new google.maps.Marker({
              position: d.position,
              map: this.map,
              icon: this.markerIcons[format[cab]],
            });
            marker.db = d;

            marker.addListener("click", function () {
              ref.infoWindow(marker);
            });
            this.markers.push(marker);
            temp.push(marker);
          });
        }
        this.markerCluster.addMarkers(temp);

        // this.clusterMyMarkers();
      }
      if (!this.buttons[cab].isOn) {
        let c = this.markers.filter((d) => d.db.isp === format[cab]);
        c.forEach((ca) => {
          ca.setVisible(false);
        });
        this.clusterMyMarkers("clear");
      }
    },
    infoWindow(marker) {
      if (this.openInfoWindow) {
        this.openInfoWindow.close();
        this.openInfoWindow = null;
      }
      let ak;
      this.polygons.forEach((p) => {
        if (
          google.maps.geometry.poly.containsLocation(marker.getPosition(), p)
        ) {
          this.markers.forEach((m) => {
            if (m.db.name) {
              if (
                google.maps.geometry.poly.containsLocation(m.getPosition(), p)
              ) {
                ak = m;
              }
            }
          });
        }
      });
      const text = `Cabinet ID ${marker.db._id}. ISP: ${marker.db.isp} AK: ${
        ak ? ak.db.name : "Unknown"
      }`;
      const infowindow = new google.maps.InfoWindow({
        content: text,
      });
      infowindow.open(this.map, marker);
      this.openInfoWindow = infowindow;
    },
    clusterMyMarkers(action = "default") {
      const clusterOptions = {
        gridSize: 40,
        maxZoom: 15,
        // styles: clusterStyle,
      };
      if (action === "default") {
        if (!this.markerCluster) {
          this.markerCluster = new MarkerClusterer(
            this.map,
            this.markers.filter((d) => d.visible === true),
            clusterOptions
          );
        } else {
          this.markerCluster.clearMarkers();
          this.markerCluster = null;
          this.markerCluster = new MarkerClusterer(
            this.map,
            this.markers.filter((d) => d.visible === true),
            clusterOptions
          );
        }
      } else if (action === "clear") {
        this.markerCluster.removeMarkers(
          this.markers.filter((d) => d.visible === false)
        );
      }
    },
    setDescription(description) {
      this.description = description;
    },
    setPlace(place) {
      this.myCoordinates = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      this.zoom = 18;
      this.place = place;
    },
    usePlace(place) {
      if (this.place) {
        this.markers.push({
          position: {
            lat: this.place.geometry.location.lat(),
            lng: this.place.geometry.location.lng(),
          },
          infoText: this.place.formatted_address,
        });
        this.place = null;
      }
    },
    handleDrag() {
      // get center and zoom level, store in localstorage
      let center = {
        lat: this.map.getCenter().lat(),
        lng: this.map.getCenter().lng(),
      };
      let zoom = this.map.getZoom();

      localStorage.center = JSON.stringify(center);
      localStorage.zoom = zoom;
    },
    markerInfo(marker, idx) {
      this.infoWindowPos = marker.position;
      this.infoOptions.content = marker.infoText;

      //check if its the same marker that was selected if yes toggle
      if (this.currentMidx == idx) {
        this.infoWinOpen = !this.infoWinOpen;
      }
      //if different marker set infowindow to open and reset current marker index
      else {
        this.infoWinOpen = true;
        this.currentMidx = idx;
      }
    },
    showInfo() {
      const position = {
        lat: this.place.geometry.location.lat(),
        lng: this.place.geometry.location.lng(),
      };
      this.infoWindowPos = position;
      //   this.infoOptions.content = this.place.formatted_address;
      this.infoWinOpen = !this.infoWinOpen;

      var distances = [];
      var closest = -1;
      for (var i = 0; i < this.markers.length; i++) {
        var d = google.maps.geometry.spherical.computeDistanceBetween(
          this.markers[i].position,
          this.place.geometry.location
        );
        distances[i] = d;
        if (closest == -1 || d < distances[closest]) {
          closest = i;
        }
      }
      const cabinet = this.markers[closest];
      const dis = google.maps.geometry.spherical.computeDistanceBetween(
        this.markers[closest].position,
        this.place.geometry.location
      );
      // this.infoOptions.content = this.markers[closest].infoText;
      this.infoOptions.content = `<a style="color: purple">Closest cabinet is <b>${dis.toFixed(
        2
      )} meters</b> away<br>ISP: ${cabinet.db.isp}<br>Cabinet ID ${
        cabinet.db.id
      }<br>Cabinet Database ID: ${cabinet.db._id}</a>`;
    },
  },
  computed: {
    mapCoordinates() {
      if (!this.map) {
        return {
          lat: 0,
          lng: 0,
        };
      }

      return {
        lat: this.map.getCenter().lat().toFixed(4),
        lng: this.map.getCenter().lng().toFixed(4),
      };
    },
  },
  async created() {
    const cabQuery = "cabinet?id=";
    if (window.location.pathname.includes(cabQuery)) {
      const cabId = window.location.pathname.split(cabQuery)[1];
    }
  },
};
</script>

<style scoped lang="postcss">
.vue-map-container {
  position: fixed;
}
</style>
