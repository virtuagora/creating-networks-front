<template>
  <section>
    <h1 class="title is-3">{{$t('user.userPanel.areasOfInterest.title')}}</h1>
    <p v-html="$t('user.userPanel.areasOfInterest.subtitle')"></p>
    <br>
     <div class="card">
      <div class="card-content">
      <h1 class="title has-text-dark is-3">{{$t('user.userPanel.areasOfInterest.currentAreas')}}</h1>
      <b-taglist v-if="currentAreas && currentAreas.length > 0">
        <b-tag v-for="area in currentAreas" type="is-primary" size="is-medium" closable :key="area.id" @close="remove(area.id)">{{area.name}}</b-tag>
      </b-taglist>
      <div class="notification is-warning" v-else>
        <i class="fas fa-exclamation-circle"></i>&nbsp;{{$t('user.userPanel.areasOfInterest.emptyAreas')}}
      </div>
    <hr>
    <h1 class="title has-text-dark is-3">{{$t('user.userPanel.areasOfInterest.manage.title')}}</h1>
    <p>{{$t('user.userPanel.areasOfInterest.manage.subtitle')}}</p>
    <br>
    <div class="columns">
      <div class="column">
        <div class="notification">
        <h1 class="subtitle is-5">{{$t('user.userPanel.areasOfInterest.manage.availableAreasTitle')}}</h1>
        <b-taglist>
           <b-tag v-for="area in availableAreas" @click.native="selectedAreas.push(area)" type="is-info" :key="area.id" style="cursor: pointer">{{area.name}}</b-tag>
        </b-taglist>
        </div>
      </div>
      <div class="column is-narrow is-hidden-touch"><br><i class="fas fa-arrow-right fa-lg"></i></div>
      <div class="column">
        <div class="notification">
        <h1 class="subtitle is-5">{{$t('user.userPanel.areasOfInterest.manage.newAreasTitle')}}</h1>
        <b-taglist>
           <b-tag v-for="area in selectedAreas" type="is-info" :key="area.id">{{area.name}}</b-tag>
        </b-taglist>
        </div>
    <div class="field">
          <div class="control">
              <div class="buttons is-right">
            <button class="button is-primary" @click="submit" :disabled="selectedAreas.length == 0" >{{$t('user.userPanel.areasOfInterest.manage.submit')}}</button>
            </div>
          </div>
        </div>
      </div>
      </div>
      </div>
    </div>

  </section>
</template>

<script>
import { differenceBy } from 'lodash';
// import PaginationBar from '@/components/utils/PaginationBar';
// import EmptyTable from '@/components/utils/EmptyTable';

export default {
  components: {
    // PaginationBar,
    // EmptyTable,
  },
  data() {
    return {
      currentAreas: [],
      areas: [],
      selectedAreas: [],
    };
  },
  mounted() {
    this.fetchUser();
    this.fetchAvailableAreasOfInterest();
  },
  methods: {
    sync(data) {
      if (!data.person.terms) this.currentAreas = [];
      this.currentAreas = data.person.terms;
    },
    fetchUser() {
      this.startLoading();
      this.$http
        .get(`/v1/users/${this.user.id}`)
        .then((res) => {
          this.sync(res.data.data);
        })
        .catch((err) => {
          console.error(err);
          if (err.response && err.response.data) this.$toast.open(err.response.data.message);
        })
        .finally(() => {
          this.stopLoading();
        });
    },
    fetchAvailableAreasOfInterest() {
      this.startLoading();
      this.$http
        .get('/v1/terms?taxonomy=topics&size=100')
        .then((res) => {
          this.areas = res.data.data;
        })
        .catch((err) => {
          console.error(err);
          this.$toast.open({
            message: '<i class="fas fa-times"></i>&nbsp;Error while fetching areas of interest',
            type: 'is-danger',
          });
        })
        .finally(() => {
          this.stopLoading();
        });
    },


    getPayload() {
      const data = { };
      data.terms = this.selectedAreas.map(a => a.id);
      return { data };
    },
    submit() {
      this.startLoading();
      this.$http
        .post(
          `/v1/users/${this.user.id}/terms`,
          this.getPayload(),
        )
        .then(() => {
          this.selectedAreas.forEach((area) => {
            this.currentAreas.push(area);
          });
          this.selectedAreas = [];
          this.$emit('updateModel');
          this.$toast.open({
            message: '<i class="fas fa-check"></i>&nbsp;Areas of interests added to your profile',
            type: 'is-success',
          });
        })
        .catch((err) => {
          console.error(err);
          this.$toast.open({
            message: '<i class="fas fa-times"></i>&nbsp;Error while adding the area of interest',
            type: 'is-danger',
          });
        })
        .finally(() => {
          this.stopLoading();
        });
    },
    remove(id) {
      this.startLoading();
      this.$http
        .delete(
          `/v1/users/${this.user.id}/terms/${id}`,
        )
        .then(() => {
          this.currentAreas = this.currentAreas.filter(area => area.id != id);
          this.$toast.open({
            message: '<i class="fas fa-check"></i>&nbsp;Area of interest has been removed from your profile',
            type: 'is-success',
          });
        })
        .catch((err) => {
          console.error(err);
          this.$toast.open({
            message: '<i class="fas fa-times"></i>&nbsp;Error while removing Area of interest from your profile',
            type: 'is-danger',
          });
        })
        .finally(() => {
          this.stopLoading();
        });
    },
  },
  computed: {
    availableAreas() {
      if (!this.areas) return [];
      const auxAreas = differenceBy(this.areas, this.currentAreas, 'id');
      return differenceBy(auxAreas, this.selectedAreas, 'id');
    },
  },
};
</script>

<style>
</style>
