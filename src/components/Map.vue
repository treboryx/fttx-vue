<template>
  <div>
    <GmapMap
      :center="myCoordinates"
      :zoom="zoom"
      class="w-full bg-gray-500 h-full"
      ref="mapRef"
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
      ></Gmap-Marker> -->
      <Gmap-Marker
        v-if="this.place"
        label="!"
        @click="showInfo()"
        :position="{
          lat: this.place.geometry.location.lat(),
          lng: this.place.geometry.location.lng(),
        }"
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
        >
          Add
        </button>
      </label>
      <!-- <label class="md:w-2/3 block text-gray-500 font-bold">
        <input class="mr-2 leading-tight" type="checkbox" />
        <span class="text-sm">Send me your newsletter!</span>
      </label>-->
    </div>
    <div class="relative h-full w-full">
      <div
        class="absolute bottom-0 right-0 h-64 w-48"
        style="text-align: left;"
      >
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
        >
          {{ buttons.ote.text }}
        </button>
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
        >
          {{ buttons.wind.text }}
        </button>
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
        >
          {{ buttons.vf.text }}
        </button>
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
        >
          {{ buttons.rurcon.text }}
        </button>
      </div>
    </div>

    <div v-if="debugging" style="z-index: 999;">
      <div
        style="max-width: 800px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between"
      >
        <div>
          <h1>Your coordinates:</h1>
          <p>
            {{ myCoordinates.lat }} Latitude, {{ myCoordinates.lng }} Longitude
          </p>
        </div>
        <div>
          <h1>Map coordinates:</h1>
          <p>
            {{ mapCoordinates.lat }} Latitude,
            {{ mapCoordinates.lng }} Longitude
          </p>
        </div>
      </div>
    </div>
    -->
  </div>
</template>
<script>
import axios from "axios";
import * as MarkerClusterer from "marker-clusterer-plus";

export default {
  data() {
    return {
      map: null,
      myCoordinates: {
        lat: 37.9432,
        lng: 23.6709,
      },
      zoom: 10,
      windowHeight: `${window.innerHeight - 65}px`,
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
      storedMarkers: [],
      debugging: true,
      paths: [
        { lat: 25.774, lng: -80.19 },
        { lat: 18.466, lng: -66.118 },
        { lat: 32.321, lng: -64.757 },
        { lat: 25.774, lng: -80.19 },
      ],
      polygonOptions: {
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
      },
      markers: [],
      place: null,
      infoWindowPos: null,
      infoWinOpen: false,
      currentMidx: null,

      infoOptions: {
        content: "",
        //optional: offset infowindow so it visually sits nicely on top of our marker
        pixelOffset: {
          width: 0,
          height: -35,
        },
      },
    };
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
  mounted() {
    // add the map to a data object
    this.$refs.mapRef.$mapPromise.then((map) => (this.map = map));
  },
  methods: {
    showCabinets(cab) {
      const format = {
        ote: "OTE",
        wind: "WIND",
        vf: "Vodafone",
        rurcon: "RURALCONNECT",
      };
      let ispCabinets = this.storedMarkers.filter(
        (d) => d.db.isp === format[cab]
      );
      if (this.buttons[cab].isOn) {
        ispCabinets.forEach((c) => {
          c.setMap(this.map);
          const infowindow = new google.maps.InfoWindow({
            content: c.db.infoText,
          });
          c.addListener("click", function() {
            infowindow.open(this.map, c);
          });
          this.markers.push(c);
        });
        var mcOptions = { gridSize: 40, maxZoom: 15 };
        var markerCluster = new MarkerClusterer(
          this.map,
          this.markers,
          mcOptions
        );
      }
      if (!this.buttons[cab].isOn) {
        ispCabinets.forEach((c) => {
          c.setMap(null);
          this.markers = this.markers.filter((d) => d.db.isp !== format[cab]);
        });
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
        let pos = new google.maps.LatLng(
          this.markers[i].position.lat,
          this.markers[i].position.lng
        );
        var d = google.maps.geometry.spherical.computeDistanceBetween(
          pos,
          this.place.geometry.location
        );
        distances[i] = d;
        if (closest == -1 || d < distances[closest]) {
          closest = i;
        }
      }

      //   this.infoOptions.content = this.markers[closest].infoText;
      this.infoOptions.content = `<a style="color: purple">Closest marker is <b>${d.toFixed(
        2
      )}</b> meters</a>`;
      //check if its the same marker that was selected if yes toggle
      //   if (this.currentMidx == idx) {
      //     this.infoWinOpen = !this.infoWinOpen;
      //   }
      //   //if different marker set infowindow to open and reset current marker index
      //   else {
      //     this.infoWinOpen = true;
      //     this.currentMidx = idx;
      //   }
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
        lat: this.map
          .getCenter()
          .lat()
          .toFixed(4),
        lng: this.map
          .getCenter()
          .lng()
          .toFixed(4),
      };
    },
  },
  async created() {
    // MarkerClusterer.prototype.getDraggable = function() {
    //   return false;
    // };
    const cabQuery = "cabinet?id=";
    if (window.location.pathname.includes(cabQuery)) {
      const cabId = window.location.pathname.split(cabQuery)[1];
    }

    let cabinets = await axios
      .get("https://api.fttx.gr/api/v1/cabinets?limit=0")
      .then((r) => r);
    // cabinets = cabinets.toJSON();
    cabinets.data.data.forEach((c) => {
      c.infoText = `Cabinet ID ${c._id}`;
      const marker = new google.maps.Marker({
        position: c.position,
        map: null,
      });
      marker.db = c;
      const infowindow = new google.maps.InfoWindow({
        content: c.infoText,
      });
      marker.addListener("click", function() {
        infowindow.open(this.map, marker);
      });
      this.storedMarkers.push(marker);
      if (c.type === "DSLAM") {
        marker.map = this.map;
        this.markers.push(marker);
      }
    });
    var mcOptions = { gridSize: 40, maxZoom: 15 };
    var markerCluster = new MarkerClusterer(this.map, this.markers, mcOptions);
  },
};
</script>

<style scoped lang="postcss">
.vue-map-container {
  position: fixed;
}

/* .vue-map-container .vue-map {
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  position: absolute;
}

.vue-map-hidden {
  display: none;
} */
</style>
