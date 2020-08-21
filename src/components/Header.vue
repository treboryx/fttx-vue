<template>
  <div>
    <nav class="bg-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <img class="h-10 w-10" src="@/assets/img/fttx-logo.png" alt="FTTx.gr logo" />
            </div>
            <div class="hidden md:block">
              <div class="ml-10 flex items-baseline">
                <a
                  href="/"
                  :class="[
                    currPage == 'map' ? 'text-white bg-gray-900' : '',
                    'text-gray-300',
                  ]"
                  @click.prevent="currentPage('map')"
                  class="px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:text-white focus:bg-gray-700"
                >Map</a>
                <a
                  :class="[
                    currPage == 'add' ? 'text-white bg-gray-900' : '',
                    'text-gray-300',
                  ]"
                  @click.prevent="currentPage('add')"
                  href="/"
                  class="ml-4 px-3 py-2 rounded-md text-sm font-medium hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
                >Add Cabinet</a>
                <a
                  href="https://github.com/fttx-gr"
                  class="text-gray-300 ml-4 px-3 py-2 rounded-md text-sm font-medium hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
                >GitHub</a>
              </div>
            </div>
          </div>
          <!-- Bell Icon for news -->
          <div class="hidden md:block">
            <div class="ml-4 flex items-center md:ml-6">
              <button
                class="p-1 border-2 border-transparent text-gray-400 rounded-full hover:text-white focus:outline-none focus:text-white focus:bg-gray-700"
                aria-label="Notifications"
              >
                <svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      currPage: "map",
      profileDropdown: false,
      vcoConfig: {
        events: ["dblclick", "click"],
        isActive: true,
      },
    };
  },
  methods: {
    currentPage(page) {
      this.currPage = page;
      this.$emit("setPage", page);
    },
    track() {
      this.$ga.page("/");
    },
  },
};
</script>
<style scoped lang="postcss">
html,
body {
  margin: 0;
}
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.2s ease;
}
.slide-fade-enter {
  transform: translateY(-50px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateY(-50px);
  opacity: 0;
}
</style>
