<template>
  <div id="app">
    <Header @setPage="setCurrentPage" />
    <Map @setPage="setCurrentPage" v-if="currentPage === 'map'" />
    <Add v-if="currentPage === 'add'" />
  </div>
</template>

<script>
import Header from "./components/Header.vue";
import Map from "./components/Map";
import Add from "./components/Add";

export default {
  name: "App",
  components: {
    Header,
    Map,
    Add,
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
