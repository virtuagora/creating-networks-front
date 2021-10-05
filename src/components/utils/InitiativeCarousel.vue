
<template>
  <div v-if="!isFetching">
    <carousel
      class="initiative-carousel"
      v-if="initiatives.length > 0"
      :autoplay="autoplayEnabled"
      :loop="true"
      :autoplay-timeout="timeout"
      :per-page-custom="responsiveLayout"
      :navigation-enabled="navigationEnabled"
      pagination-active-color="#DA8313"
      pagination-color="#FFFFFF"
      navigationNextLabel="<i class='fas fa-angle-double-right fa-2x has-text-white'></i>"
      navigationPrevLabel="<i class='fas fa-angle-double-left fa-2x has-text-white'></i>"
    >
      <slide class="item-carousel" v-for="initiative in initiatives" :key="initiative.id">
        <router-link :to="{name: 'initiative', params: { id: initiative.id }}">

        <div class="box-initiative" :class="{'has-background': initiative.pictures && initiative.pictures.cover}" :style="backgroundImageUrl(initiative)">
          <div :class="{'has-background-gradient': initiative.pictures && initiative.pictures.cover}">
            <div class="to-bottom">
              <div class="field is-grouped is-grouped-multiline">
                <div class="control">
                  <div class="tags has-addons">
                    <span class="tag is-dark">
                      <i class="fas fa-map-marker-alt"></i>
                    </span>
                    <span class="tag is-white">#{{initiative.id}}</span>
                  </div>
                </div>
              </div>
              <h1 class="title is-4 is-800 is-marginless">{{initiative.name}}</h1>
              <p
                class="shadow-text some-other-effects"
              >{{getShortDescription(initiative.description,80)}}</p>
            </div>
          </div>
        </div>
        </router-link>
      </slide>
      <slide class="item-carousel">
        <router-link :to="{name: user ? 'newInitiative' : 'login'}">

        <div class="box-add-initiative">
          <div class="center-stuff">
            <p class="is-size-1 has-text-centered">
              <i class="fas fa-plus fa-fw has-text-white"></i>
              <i class="fas fa-map-marker fa-fw has-text-primary"></i>
            </p>
            <p class="is-size-6 has-text-centered">Add your initiative and be part of the project!</p>
          </div>
        </div>
        </router-link>
      </slide>
    </carousel>
    <div v-else class="notification is-light">
      <i class="fas fa-info-circle"></i> There are no iniciatives. Try again later.
    </div>
  </div>
  <div v-else>
    <div class="section has-text-centered">
      <p class="animated bounce infinite">
        <i class="fas fa-sync fa-spin"></i>
      </p>
      <p>Loading</p>
    </div>
  </div>
</template>

<script>
import { Carousel, Slide } from 'vue-carousel';

export default {
  data() {
    return {
      initiatives: [],
      isFetching: true,
      timeout: 7000,
    };
  },
  components: {
    Carousel,
    Slide,
  },
  mounted() {
    this.fetch();
  },

  methods: {
    fetch() {
      this.isFetching = true;
      this.$http.get('/v1/initiatives?size=10&sort=random').then((res) => {
        this.initiatives = this.shuffleArray(res.data.data);
        this.isFetching = false;
      });
    },
    getShortDescription(text, limit) {
      if (text.length > limit) {
        for (let i = limit; i > 0; i--) {
          if (
            text.charAt(i) === ' '
            && (text.charAt(i - 1) != ','
              || text.charAt(i - 1) != '.'
              || text.charAt(i - 1) != ';')
          ) {
            return `${text.substring(0, i)}...`;
          }
        }
      } else {
        return text;
      }
    },
    shuffleArray(arr) {
      return arr
        .map(a => [Math.random(), a])
        .sort((a, b) => a[0] - b[0])
        .map(a => a[1]);
    },
    backgroundImageUrl(initiative){
      if(!initiative) return null
      if (initiative.pictures && initiative.pictures.cover){
        return `background-image: url(${this.apiUrl}/${initiative.pictures.cover.path})`
      }
      return null
    }
  },
  computed: {
    navigationEnabled() {
      return !!(this.initiatives.length - 1);
    },
    autoplayEnabled() {
      return !!(this.initiatives.length - 1);
    },
    perPage() {
      if (this.initiatives.length > 2) {
        return 3;
      }
      return this.initiatives.length;
    },
    loopEnabled() {
      return !!(this.initiatives.length - 1);
    },
    responsiveLayout() {
      if (this.initiatives.length > 2) {
        return [[0, 1], [768, 2], [1024, 3]];
      } if (this.initiatives.length == 2) {
        return [[0, 1], [768, 2]];
      } if (this.initiatives.length == 1) {
        return null;
      } else {
        return null
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
