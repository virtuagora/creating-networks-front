<template>
  <section>
    <h1 class="title is-3">Edit initiative</h1>
    <p>Edit your initiative. <router-link :to="{ name: 'initiative', params: { id: id } }" class="has-text-primary">Go to the initiative&nbsp;<i class="fas fa-arrow-right"></i></router-link></p>
    <br />
    <b-tabs type="is-toggle" v-model="activeTab" expanded class="is-marginless">
      <b-tab-item label="Information" icon="scroll" icon-pack="fas"></b-tab-item>
      <b-tab-item label="Customize" icon="paint-roller" icon-pack="fas"></b-tab-item>
      <b-tab-item label="Location" icon="map-marker-alt" icon-pack="fas"></b-tab-item>
      <b-tab-item label="Members" icon="users" icon-pack="fas"></b-tab-item>
      <b-tab-item label="Countries" icon="map-signs" icon-pack="fas"></b-tab-item>
      <b-tab-item label="Areas of interest" icon="tag" icon-pack="fas"></b-tab-item>
    </b-tabs>
    <div class="card">
      <div class="card-content">
        <DataForm ref="data" v-if="activeTab == 0" @update="submitData" edit :model.sync="model" />
        <CustomizeForm ref="customize" v-if="activeTab ==  1" edit :model.sync="model" :id="id" @updateModel="updateModel" />
        <LocationForm ref="location" v-if="activeTab ==  2" @update="submitLocation" edit :model.sync="model" />
        <MemberForm ref="member" v-if="activeTab ==  3" :model.sync="model" :id="id" />
        <CountryPresence ref="countries" v-if="activeTab ==  4" :model.sync="model" :id="id"  @updateModel="updateModel" />
        <AreasOfInterestForm ref="location" v-if="activeTab ==  5" :model.sync="model" :id="id" @updateModel="updateModel"/>
      </div>
    </div>
  </section>
</template>

<script>
import merge from 'lodash/merge';
import DataForm from '@/components/utils/initiatives/DataForm.vue';
import CustomizeForm from '@/components/utils/initiatives/CustomizeForm.vue';
import LocationForm from '@/components/utils/initiatives/LocationForm.vue';
import MemberForm from '@/components/utils/initiatives/MemberForm.vue';
import CountryPresence from '@/components/utils/initiatives/CountryPresence.vue';
import AreasOfInterestForm from '@/components/utils/initiatives/AreasOfInterestForm.vue';

export default {
  props: ['id'],
  components: {
    DataForm,
    CustomizeForm,
    LocationForm,
    MemberForm,
    CountryPresence,
    AreasOfInterestForm,
  },
  data() {
    return {
      activeTab: 0,
      model: {
        name: null,
        description: null,
        public_data: {
          goals: null,
          founding_year: null,
          website: null,
          facebook: null,
          twitter: null,
          other_network: null,
          role_of_youth: null,
        },
        private_data: {
          contact_email: null,
          contact_phone: null,
        },
        selectedRegion: null,
        selectedCountry: null,
        selectedCity: null,
        city: null,
        countries: null,
        subject: null,
        pictures: null
      },
      originalDataPayload: null,
      originalLocationPayload: null,
    };
  },
  beforeMount() {
    this.startLoading();
    this.$http.get(`/v1/initiatives/${this.id}`)
      .then((res) => {
        this.model = merge(this.model, res.data.data);
        this.originalDataPayload = this.createPayloadDataForm();
        this.originalLocationPayload = this.createPayloadLocationForm();
      }).catch((err) => {
        console.error(err);
        this.$toast.open(err.response.data.message);
      }).finally(() => {
        this.stopLoading();
      });
  },
  methods: {
    updateModel() {
      this.$http.get(`/v1/initiatives/${this.id}`)
        .then((res) => {
          this.model = merge(this.emptyModel(), res.data.data)
          this.originalDataPayload = this.createPayloadDataForm();
          this.originalLocationPayload = this.createPayloadLocationForm();
        }).catch((err) => {
          console.error(err);
          this.$toast.open(err.response.data.message);
        });
    },
    createPayloadDataForm() {
      const data = {};
      data.name = this.model.name;
      data.description = this.model.description;
      (data.public_data = {
        goals: this.model.public_data.goals,
        founding_year: this.model.public_data.founding_year,
        role_of_youth: this.model.public_data.role_of_youth,
        website: this.isOptional(this.model.public_data.website),
        facebook: this.isOptional(this.model.public_data.facebook),
        twitter: this.isOptional(this.model.public_data.twitter),
        other_network: this.isOptional(this.model.public_data.other_network),
      }),
      (data.private_data = {
        contact_email: this.model.private_data.contact_email,
        contact_phone: this.isOptional(this.model.private_data.contact_phone),
      });
      return data;
    },
    createPayloadLocationForm() {
      const data = {};
      if (this.model.city) {
        data.registered_city_id = this.model.city.id;
      } else if (this.model.selectedCity) {
        data.registered_city_id = this.model.selectedCity.id;
      } else {
        data.registered_city_id = null;
      }
      return data;
    },
    makePayload(data) {
      return { data };
    },
    emptyModel(){
      return {
        name: null,
        description: null,
        public_data: {
          goals: null,
          founding_year: null,
          website: null,
          facebook: null,
          twitter: null,
          other_network: null,
          role_of_youth: null,
        },
        private_data: {
          contact_email: null,
          contact_phone: null,
        },
        selectedRegion: null,
        selectedCountry: null,
        selectedCity: null,
        countries: null,
        city: null,
      }
    },
    submitData() {
      Promise.all([this.$refs.data.validate()]).then((values) => {
        if (
          values.some(x => x == false)
        ) {
          this.$toast.open({
            message: this.$t('globals.errors.formNotValid'),
            type: 'is-warning',
            position: 'is-bottom',
          });
          return;
        }
        this.startLoading();
        const dataPayloadModified = this.createPayloadDataForm();
        const payload = this.diffObject(this.originalDataPayload, dataPayloadModified);
        this.$http
          .patch(`/v1/initiatives/${this.id}`, this.makePayload(payload))
          .then(() => {
            this.$toast.open({
              message: '<i class="fas fa-check"></i>&nbsp;Initiative has been updated',
              type: 'is-success',
            });
            this.$router.push({ name: 'userInitiativesList' });
          })
          .catch((err) => {
            console.error(err);
            if (err.response && err.response.data) this.$toast.open(err.response.data.message);
          })
          .finally(() => {
            this.stopLoading();
          });
      }).catch((err) => {
        this.$toast.open(err.response.data.message);
      });
    },
    submitLocation() {
      this.startLoading();
      const locationPayloadModified = this.createPayloadLocationForm();
      const payload = this.diffObject(this.originalLocationPayload, locationPayloadModified);
      if (payload.registered_city_id == null) {
        this.$http.delete(`/v1/initiatives/${this.id}/city`)
          .then(() => {
            this.$toast.open({
              message: '<i class="fas fa-check"></i>&nbsp;Initiative has been updated',
              type: 'is-success',
            });
            this.$router.push({ name: 'userInitiativesList' });
          })
          .catch((err) => {
            console.error(err);
            if (err.response && err.response.data) this.$toast.open(err.response.data.message);
          })
          .finally(() => {
            this.stopLoading();
          });
      }
      if (payload.registered_city_id) {
        this.$http
          .post(`/v1/initiatives/${this.id}/city`, this.makePayload(payload))
          .then(() => {
            this.$toast.open({
              message: '<i class="fas fa-check"></i>&nbsp;Initiative has been updated',
              type: 'is-success',
            });
            this.$router.push({ name: 'userInitiativesList' });
          })
          .catch((err) => {
            console.error(err);
            if (err.response && err.response.data) this.$toast.open(err.response.data.message);
          })
          .finally(() => {
            this.stopLoading();
          });
      }
    },
  },
};
</script>

<style>
</style>
