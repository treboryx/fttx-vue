<template>
  <div id="app">
    <Header @setPage="setCurrentPage" />
    <Map v-if="currentPage === 'map'" />
  </div>
</template>

<script>
import Header from "./components/Header.vue";
import Map from "./components/Map";

export default {
  name: "App",
  components: {
    Header,
    Map,
  },
  data() {
    return {
      currentPage: "map",
    };
  },
  methods: {
    setCurrentPage(page) {
      this.currentPage = page;
    },
  },
};
</script>

<style>
#app {
  text-align: center;
  color: #2c3e50;
  height: 100%;
}
</style>
