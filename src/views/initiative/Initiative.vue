<template>
  <section>
    <section>
      <div id="hero" class="hero is-medium is-dark" :class="{'has-background': initiative.pictures && initiative.pictures.cover}" :style="backgroundImageUrl">
        <router-link :to="{name: 'home'}" class="cn-back-home">
          <img src="/iso-cn.svg" class="image" alt />
        </router-link>
        <div class="hero-body">
          <div class="container">
            <br class="is-hidden-desktop">
          <img :src="`${makeUserAvatar(initiative.subject)}`" class="image initiative-logo is-centered" v-if="initiative.subject.img_type == 2" alt="Initiative logo">
            <p class="title is-1 is-size-3-touch has-text-centered">{{initiative.name}}</p>
            <p v-if="initiative.city" class="subtitle is-6 is-size-7-touch has-text-centered">Located in <b>{{`${getSpaceLocalization(initiative.city.country.region)}, ${getSpaceLocalization(initiative.city.country)}, ${getSpaceLocalization(initiative.city)}`}}</b></p>
            <div class="columns is-centered is-mobile">
              <div class="column is-narrow">
              <a :href="`https://${initiative.public_data.website}`" target="_blank" class="has-text-white" v-if="initiative.public_data.website"><i class="fas fa-globe fa-lg fa-fw"></i></a>
              </div>
              <div class="column is-narrow">
              <a :href="`https://facebook.com/${initiative.public_data.facebook}`" target="_blank" class="has-text-white" v-if="initiative.public_data.facebook"><i class="fab fa-facebook-f fa-lg fa-fw"></i></a>
              </div>
              <div class="column is-narrow">
              <a :href="`https://twitter.com/${initiative.public_data.twitter}`" target="_blank" class="has-text-white" v-if="initiative.public_data.twitter"><i class="fab fa-twitter fa-lg fa-fw"></i></a>
              </div>
              <div class="column is-narrow">
              <a :href="`https://${initiative.public_data.other_network}`" target="_blank" class="has-text-white" v-if="initiative.public_data.other_network"><i class="fas fa-external-link-alt fa-lg fa-fw"></i></a>
              </div>
            </div>
            <div class="buttons is-centered" v-if="user" >
              <button @click="followInitiative" v-if="initiativeContext && initiativeContext.connection == null" class="button is-outlined is-white is-small is-800">
                <i class="fas fa-plus fa-lg fa-fw"></i>&nbsp; F O L L O W
              </button>
              <button @click="unfollowInitiative" v-if="initiativeContext && initiativeContext.connection && initiativeContext.connection.relation=='follower'" class="button is-outlined is-white is-small is-800">
                <i class="fas fa-minus fa-lg fa-fw"></i>&nbsp; U N F O L L O W
              </button>
              <EditButton :initiative="initiative.id" />
            </div>
          </div>
        </div>
        <div class="hero-foot">
          <nav class="tabs is-centered is-boxed">
            <div class="container">
              <ul>
                <li>
                  <router-link :to="{ name: 'home'}"><i class="fas fa-reply fa-lg"></i>&nbsp;&nbsp;Go back</router-link>
                </li>
                <li :class="{'is-active': $route.name === 'initiative'}">
                  <router-link :to="{ name: 'initiative', params: { id: initiative.id } }">Overview</router-link>
                </li>
                <li :class="{'is-active': $route.name === 'initiativeLocation'}" v-if="initiative.city">
                  <router-link :to="{ name: 'initiativeLocation', params: { id: initiative.id } }">Location</router-link>
                </li>
                <li :class="{'is-active': $route.name === 'initiativeMembers'}">
                  <router-link :to="{ name: 'initiativeMembers', params: { id: initiative.id } }">Members</router-link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
        <vue-particles color="FFFFFF" :hoverEffect="false" :clickEffect="false"></vue-particles>
      </div>
    </section>
    <div class="section">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-8">
            <router-view></router-view>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import store from '@/store';
import http from '@/http';
import EditButton from "./EditButton.vue"

export default {
  data() {
    return {

    }
  },
  components: {
    EditButton
  },
  methods: {
    followInitiative: function(){
      if(!this.user) {
        this.$router.push({name: 'login'})
        return false
      }
      this.startLoading()
      this.$http.post(`/v1/initiatives/${this.initiative.id}/members/${this.user.id}`)
      .then(() => {
        this.$toast.open({
            message:
              '<i class="fas fa-check"></i>&nbsp;You are now following this initiative!',
            type: "is-success"
          });
        this.updateInitiative()
      })
      .catch(err => {
        console.error(err)
        this.$toast.open({
            message:
              '<i class="fas fa-times"></i>&nbsp;There was an error',
            type: "is-danger"
          });
      })
      .finally( () => {
        this.stopLoading()
      }) 
    },
    unfollowInitiative: function(){
      if(!this.user) {
        this.$router.push({name: 'login'})
        return false
      }
      this.startLoading()
      this.$http.delete(`/v1/initiatives/${this.initiative.id}/members/${this.user.id}`)
      .then(() => {
        this.$toast.open({
            message:
              '<i class="fas fa-check"></i>&nbsp;You don\'t follow the initiative anymore',
            type: "is-success"
          });
        this.updateInitiative()
      })
      .catch(err => {
        console.error(err)
        this.$toast.open({
            message:
              '<i class="fas fa-times"></i>&nbsp;There was an error',
            type: "is-danger"
          });
      })
      .finally( () => {
        this.stopLoading()
      }) 
    },
    updateInitiative: function() {
      this.$http
        .get(`/v1/initiatives/${this.initiative.id}`)
        .then((response) => {
          this.$store.commit('setInitiative', response.data);
        })
        .catch(err => {
          console.error(err)
        })

    }
  },
  computed: {
    initiative() {
      return this.$store.getters.initiative;
    },
    initiativeContext() {
      return this.$store.getters.initiativeContext;
    },
    backgroundImageUrl(){
      if(!this.initiative) return null
      if (this.initiative.pictures && this.initiative.pictures.cover){
        return `background-image: url(${this.apiUrl}/${this.initiative.pictures.cover.path})`
      }
      return null
    }
  },
  beforeRouteUpdate: (to, from, next) => {
    if (to.params.id === from.params.id) {
      console.log('Same initiative, dont load');
      next();
    } else {
      console.log('First time entering, getting initiative...');
      http
        .get(`/v1/initiatives/${to.params.id}`)
        .then((response) => {
          store.commit('setInitiative', response.data);
          console.log('GET OK - Got initiative');
          next();
        })
        .catch((error) => {
          console.log('Fetching data failed.', error);
          next({ name: 'home' });
        });
    }
  },
};
</script>

<style lang="scss" scoped>
#hero {
  position: relative;
  background: #16222a; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to bottom,
    #3a6073,
    #16222a
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to bottom,
    #3a6073,
    #16222a
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  .hero-body {
    z-index: 10;
  }
  .hero-foot {
    border-bottom: 1px solid rgba(255, 255, 255, 0.397);
    z-index: 10;
  }
  &.has-background{
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
    .hero-body{
      background: transparent; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to bottom,
    #3a607370,
    #16222a
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to bottom,
    #3a607370,
    #16222a
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    }
    .hero-foot{
      background-color: #16222a;
    }
  }
}
.initiative-logo{
  height: 128px;
  margin-bottom:10px;
}
#particles-js {
  // background-size: cover;
  position: absolute;
  // top: 0;
  // left: 0;
  width: 100%;
  height: 100%;
}
</style>
