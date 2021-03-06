<template>
  <section>
    <Slideout
      ref="initiativesNotLocatedSlider"
      menu="#menu"
      panel="#panel"
      @on-open="openSlider"
      :padding="400"
      :touch="false"
    >
      <nav id="menu">
        <InitiativesNotLocated ref="initiativesNotLocated" @close="closeSlider" />
      </nav>
      <section id="panel">
        <router-link :to="{name: 'home'}" class="logo">
          <img src="/iso-cn.svg" class="image" alt />
        </router-link>
        <div class="control-header">
          <div class="field">
            <div class="control">
              <b-autocomplete
                v-model="queryCity"
                :placeholder="placeholderInput"
                :keep-first="true"
                :data="filteredCities"
                :loading="fetchingCities"
                field="name"
                icon="plane-departure"
                :disabled="disableInput"
                @select="option => selectCity(option)"
              >
                <template slot="empty">
                  Oh sorry.. we don't have flights to {{queryCity}}&nbsp;
                  <i class="fas fa-sad-tear"></i>
                </template>
              </b-autocomplete>
              <p class="help" v-if="!fetchingCities && mapReady">
                <a
                  class="has-text-primary"
                  @click="randomDesination"
                >Don't know? Try a random destination!</a>
              </p>
              <p class="help" v-if="!fetchingCities && mapReady">
                <b-switch
                type='is-primary'
                @input="changeToggleView">Show only presence in countries</b-switch>
              </p>
            </div>
          </div>
        </div>
        <div class="control-footer">
          <div v-if="mapReady" class="has-text-centered">
            <router-link
              :to="{name: user ? 'newInitiative' : 'login' }"
              class="button is-medium is-primary animated bounce is-outlined is-hidden-touch"
            >
              <i class="fas fa-plus"></i>&nbsp;Add your initiative
            </router-link>
            <router-link
              :to="{name: user ? 'newInitiative' : 'login' }"
              class="button is-primary animated bounce is-outlined is-hidden-desktop"
            >
              <i class="fas fa-plus"></i>&nbsp;Add your initiative
            </router-link>
            <br />
            <br class="is-hidden-touch"/>
            <a class="has-text-white toggle-button is-size-7-touch" @click="openUnlocated">
              <i class="fas fa-clipboard-list fa-lg"></i>&nbsp;&nbsp;List initiatives without city
            </a>
          </div>
          <p v-else class="animated infinite bounce is-size-4">
            <i class="fas fa-sync fa-spin"></i>&nbsp;Loading
          </p>
        </div>
        <div class="map-container">
          <InitiativeMap
            ref="initiativeMap"
            class="the-map"
            @mapReady="mapReady = true"
            v-if="!fetchingCities"
            :cities="cities"
          ></InitiativeMap>
        </div>
      </section>
    </Slideout>
  </section>
</template>

<script>
import Slideout from 'vue-slideout';
import InitiativeMap from '@/components/InitiativeMap.vue';
import InitiativesNotLocated from '@/components/InitiativesNotLocated.vue';

export default {
  components: {
    InitiativeMap,
    Slideout,
    InitiativesNotLocated,
  },
  data() {
    return {
      mapLoaded: true,
      fetchingCities: true,
      cities: null,
      queryCity: '',
      selectedCity: null,
      mapReady: false,
      countriesFetched: false,
    };
  },
  created() {
    this.getCities();
  },
  methods: {
    getCities() {
      this.$http.get('/v1/cities').then((res) => {
        this.cities = res.data.data;
        this.fetchingCities = false;
      });
    },
    selectCity(city) {
      if (city == null) return;
      this.selectedCity = city;
      this.$refs.initiativeMap.flyTo(city.space.point.coordinates);
    },
    fetchCountries(){
      if(this.countriesFetched) return
      this.startLoading()
      this.$http.get('/v1/countries?having=initiatives').then(res => {
        this.countriesFetched = true
        this.prepareCountryGeoJson(res.data.data)
      }).finally( () => {
        this.stopLoading()
      })
    },
    prepareCountryGeoJson(data){
      let geojson = {
        type: "geojson",
        data: {
          type: 'FeatureCollection',
          features: []
        }
      }
      data.forEach( country => {
        let feature = {
          type: "Feature",
          id: `${country.code_3}`,
          properties:{
            countryId: country.id,
            name: country.name,
            initiatives: country.initiatives_count
          },
        }
        switch(country.space.type){
          case 'Polygon':
            feature.geometry = country.space.polygon
            // geojson.layer.filter = ["==", "$type", "Polygon"]
            break;
          case 'MultiPolygon':
            feature.geometry  = country.space.multi_polygon
            // geojson.layer.filter = ["==", "$type", "MultiPolygon"]
            break;
        }
        geojson.data.features.push(feature)
      })
      this.$refs.initiativeMap.drawCountryGeoJson(geojson)
    },
    randomDesination() {
      let randomCity = null;
      do {
        randomCity = this.cities[
          Math.floor(Math.random() * this.cities.length)
        ];
      } while (
        randomCity.name === (this.selectedCity && this.selectedCity.name)
      );
      this.queryCity = randomCity.name;
      this.selectedCity = randomCity;
      this.$refs.initiativeMap.flyTo(randomCity.space.point.coordinates);
    },
    openUnlocated() {
      this.$refs.initiativesNotLocatedSlider.slideout.toggle();
    },
    handleOpenUnlocated() {},
    handleCloseUnlocated() {},
    openSlider() {
      this.$refs.initiativesNotLocated.startPanel();
    },
    closeSlider() {
      this.$refs.initiativesNotLocatedSlider.slideout.close();
    },
    changeToggleView: function(newVal){
      console.log(newVal)
      if(newVal == true){
        if(!this.countriesFetched) this.fetchCountries()
        else this.$refs.initiativeMap.toggleCountriesVisibility();
      }
      else {
        this.$refs.initiativeMap.toggleCountriesVisibility();
      }
    }
  },
  computed: {
    placeholderInput() {
      if (!this.fetchingCities) {
        if (!this.mapReady) return 'Preparing your flight.. get ready!';
        return 'Where do you want to flight today? ✈';
      }
      return 'Fetching cities, hold on!';
    },
    disableInput() {
      return this.fetchingCities || !this.mapReady;
    },
    filteredCities() {
      if (!this.cities) return [];
      return this.cities.filter(
        option => option.name
          .toString()
          .toLowerCase()
          .indexOf(this.queryCity.toLowerCase()) >= 0,
      );
    },
  },
};
</script>

<style lang="scss" scoped>

.control-footer {
  position: fixed;
  left: 50%;
  bottom: 20px;
  transform: translate(-50%, -50%);
  z-index: 10;
  margin: 0 auto;
}
.logo {
  position: fixed;
  left: 12px;
  top: 12px;
  width: 27px;
  z-index: 20;
}
.control-header {
  width: 100%;
  position: absolute;
  padding-right: 65px;
  padding-left: 40px;
  top: 10px;
  left: 10px;
  z-index: 10;
  @include from($desktop) {
    width: 30%;
  }
}
.map-container {
  height: 100vh;
  width: 100%;
  .the-map {
    height: 100vh;
  }
}

// Slideout menu
.slideout-menu {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 400px;
  height: 100vh;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  z-index: 0;
  display: none;
  background-color: #181d27;
  color: white;
}

.slideout-menu-left {
  left: 0;
}

.slideout-menu-right {
  right: 0;
}

.slideout-panel {
  background-color: #181d27;
  color: white;
  position: relative;
  z-index: 1;
  will-change: transform;
  min-height: 100vh;
}

.slideout-open,
.slideout-open body,
.slideout-open .slideout-panel {
  overflow: hidden;
}

.slideout-open .slideout-menu {
  display: block;
}
</style>
