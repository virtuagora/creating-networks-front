<template>
  <div id="map">
    <MglMap
      ref="theMap"
      :accessToken="accessToken"
      :minZoom="1"
      :maxZoom="8"
      class="my-mapbox"
      :mapStyle.sync="mapStyle"
      @load="onMapLoad"
    >
      <MglNavigationControl></MglNavigationControl>
      <MglMarker
        :coordinates="city.space.point.coordinates"
        anchor="bottom"
        v-for="city in citiesArray"
        :key="city.id"
        :color="colorMarker"
      >
        <MglPopup @open="fireCityFetch(`city-${city.id}`)">
          <CityPopUp :city="city" :ref="`city-${city.id}`"></CityPopUp>
        </MglPopup>
      </MglMarker>
      <!-- <MglGeojsonLayer
        v-for="(country,index) in countriesArray"
        :key="`country-${index}`"
        :source="country.source[country.id]"
        :sourceId="country.id"
        :layerId="country.layer.id"
        :layer="country.layer"
        @click="openCountryModalLayer(country)"
        @mouseenter="changeCursor"
        @mouseleave="revertCursor"
      />-->
    </MglMap>
  </div>
</template>

<script>
import {
  MglMap,
  MglNavigationControl,
  MglMarker,
  MglPopup
} from "vue-mapbox";
import CityPopUp from "./CityPopUp";
import CountryPopUp from "./CountryPopUp";

export default {
  components: {
    MglMap,
    MglNavigationControl,
    MglMarker,
    MglPopup,
    CityPopUp
  },
  props: {
    cities: {
      type: Array
    }
  },
  data() {
    return {
      mapbox: null,
      colorMarker: "#da8313",
      accessToken: process.env.VUE_APP_MAPBOX_TOKEN_MAPTILES, // your access token. Needed if you using Mapbox maps
      mapStyle: process.env.VUE_APP_MAPBOX_STYLE, // your map style
      // theCenter: [-60.675328, -31.617428],
      // theCenter: [32, -15],
      showCities: true
    };
  },
  methods: {
    async onMapLoad() {
      // Here we cathing 'load' map event
      this.$emit("mapReady");
    },
    async flyTo(coordinates) {
      const newParams = await this.$refs.theMap.actions.flyTo({
        center: coordinates,
        zoom: 4,
        speed: 0.4
      });
      console.log(newParams);
      return true;
    },
    fireCityFetch(ref) {
      this.$refs[ref][0].getCity();
    },
    openCountryModalLayer(country) {
      this.$modal.open({
        parent: this,
        component: CountryPopUp,
        props: {
          resource: country
        },
        hasModalCard: true,
        events: {}
      });
    },
    changeCursor: function() {
      console.log("pointer!");
      this.$refs.theMap.map.getCanvas().style.cursor = "pointer";
    },
    revertCursor: function() {
      console.log("grab!");
      this.$refs.theMap.map.getCanvas().style.cursor = "grab";
    },
    toggleCountriesVisibility: async function() {
      var visibility = await this.$refs.theMap.map.getLayoutProperty(
        "countries-layer",
        "visibility"
      );

      if (visibility === "visible") {
        await this.$refs.theMap.map.setLayoutProperty(
          "countries-layer",
          "visibility",
          "none"
        );
        this.className = "";
      } else {
        this.className = "active";
        await this.$refs.theMap.map.setLayoutProperty(
          "countries-layer",
          "visibility",
          "visible"
        );
      }
      this.toggleShowCities();
    },
    toggleShowCities: function() {
      this.showCities = !this.showCities;
    },
    drawCountryGeoJson: async function(geojson) {
      console.log(geojson);
      await this.$refs.theMap.map.addSource("countries", geojson);
      await this.$refs.theMap.map.addLayer({
        id: "countries-layer",
        type: "fill",
        source: "countries",
        layout: {
          visibility: "visible"
        },
        paint: {
          "fill-color": "#da8313",
          "fill-opacity": 0.4
        }
        // "filter": ["==", "$type", "Polygon"]
      });
      await this.$refs.theMap.map.on("mouseenter", "countries-layer", () => {
        this.$refs.theMap.map.getCanvas().style.cursor = "pointer";
      });
      await this.$refs.theMap.map.on("mouseleave", "countries-layer", () => {
        this.$refs.theMap.map.getCanvas().style.cursor = "";
      });
      await this.$refs.theMap.map.on("click", "countries-layer", (e) => {
        this.openCountryModalLayer(e.features[0].properties);
      });
      this.toggleShowCities();
      // await this.$refs.theMap.map.addLayer({
      //   id: "countries-labels",
      //   type: "symbol",
      //   source: "countries",
      //   layout: {
      //     "visibility": "visible",
      //     "text-field": ["get", "name"],
      //     "text-variable-anchor": ["top", "bottom", "left", "right"],
      //     "text-radial-offset": 0.5,
      //     "text-justify": "auto",
      //   },
      //   // paint: {
      //   //   "fill-color": "#da8313",
      //   //   "fill-opacity": 0.4,
      //   // }
      //   // "filter": ["==", "$type", "Feature"]
      // });
    }
  },
  computed: {
    citiesArray: function() {
      if (this.showCities) return this.cities;
      else return [];
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
