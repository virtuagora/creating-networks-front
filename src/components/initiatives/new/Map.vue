<template>
  <div id="map">
    <MglMap
      :accessToken="accessToken"
      :zoom="7"
      :center="marker"
      class="my-mapbox"
      :mapStyle.sync="mapStyle"
       @load="onMapLoaded"
    >
      <!-- <MglNavigationControl></MglNavigationControl> -->
      <MglMarker :coordinates="marker">
        <MglPopup>
          <div>
            <p class="title is-6 is-800 has-text-dark is-marginless">{{name}}</p>
            <p
              class="has-text-dark is-size-7"
            >{{fixedDescription}}</p>
          </div>
        </MglPopup>
      </MglMarker>
    </MglMap>
  </div>
</template>

<script>
import {
  MglMap, MglMarker, MglPopup,
} from 'vue-mapbox';

export default {
  components: {
    MglMap,
    MglMarker,
    MglPopup,
  },
  props: [
    'name',
    'description',
    'coordinates',
  ],
  data() {
    return {
      accessToken: process.env.VUE_APP_MAPBOX_TOKEN_MAPTILES, // your access token. Needed if you using Mapbox maps
      mapStyle: process.env.VUE_APP_MAPBOX_STYLE, // your map style
      marker: this.coordinates,
    };
  },
  methods: {
    onMapLoaded() {
      console.info('Map has loaded');
      // in component
      // this.map = event.map;
      // or just to store if you want have access from other components
      // this.$store.map = event.map;
    },
  },
  computed: {
    fixedDescription() {
      return this.description.length > 200 ? (`${this.description.slice(0, 200)}...`) : this.description;
    },
  },
};
</script>

<style lang="scss" scoped>
#map{
  height: 100%
}
</style>
