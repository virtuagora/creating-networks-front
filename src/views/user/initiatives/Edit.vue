<template>
  <section>
    <h1 class="title is-3">Edit initiative</h1>
    <p>Edit your initiative as an admin. You can edit it's info or it's location.</p>
    <br />
    <b-tabs type="is-toggle" v-model="activeTab" expanded class="is-marginless">
      <b-tab-item label="Information" icon="scroll" icon-pack="fas"></b-tab-item>
      <b-tab-item label="Location" icon="map-marker-alt" icon-pack="fas"></b-tab-item>
    </b-tabs>
    <div class="card">
      <div class="card-content">
        <DataForm ref="data" v-show="activeTab == 0" @update="submitData" edit :model.sync="model" />
        <LocationForm ref="location" v-show="activeTab ==  1" @update="submitLocation" edit :model.sync="model" />
      </div>
    </div>
  </section>
</template>

<script>
import DataForm from "@/components/utils/initiatives/DataForm.vue";
import LocationForm from "@/components/utils/initiatives/LocationForm.vue";
import MemberForm from "@/components/utils/initiatives/MemberForm.vue";
import merge from 'lodash/merge'
import omit from 'lodash/omit'

export default {
  props: ['id'],
  components: {
    DataForm,
    LocationForm,
    MemberForm
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
          role_of_youth: null
        },
        private_data: {
          contact_email: null,
          contact_phone: null
        },
        selectedRegion: null,
        selectedCountry: null,
        selectedCity: null,
        city: null,
      },
      originalDataPayload: null,
      originalLocationPayload: null
    };
  },
  beforeMount: function(){
    this.startLoading()
    this.$http.get(`/v1/initiatives/${this.id}`)
    .then(res => {
      console.log(res.data.data)
      this.model = merge(this.model, res.data.data)
      this.originalDataPayload = this.createPayloadDataForm()
      this.originalLocationPayload = this.createPayloadLocationForm()
    }).catch(err => {
      console.error(err)
      this.$toast.open(err.response.data.message);
    }).finally( () => {
      this.stopLoading()
    })
  },
  methods: {
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
        other_network: this.isOptional(this.model.public_data.other_network)
      }),
        (data.private_data = {
          contact_email: this.model.private_data.contact_email,
          contact_phone: this.isOptional(this.model.private_data.contact_phone)
        });
      return data;
    },
    createPayloadLocationForm() {
      const data = {};
      if (this.model.city) {
        data.registered_city_id = this.model.city.id;
      } else {
        if (this.model.selectedCity) {
          data.registered_city_id = this.model.selectedCity.id;
        } else {
        data.registered_city_id = null;
        }
      }
      return data;
    },
    makePayload(data) {
      return {data: data}
    },
    submitData() {
      Promise.all([this.$refs.data.validate()]).then(values => {
        if (
          values.some(x => {
            return x == false;
          })
        ) {
          this.$toast.open({
            message: this.$t("globals.errors.formNotValid"),
            type: "is-warning",
            position: "is-bottom"
          });
          return;
        }
        this.startLoading();
        let dataPayloadModified = this.createPayloadDataForm()
        let payload = this.diffObject(this.originalDataPayload, dataPayloadModified)
        this.$http
          .patch(`/v1/initiatives/${this.id}`, this.makePayload(payload))
          .then(res => {
            this.$toast.open({
              message: `<i class="fas fa-check"></i>&nbsp;Initiative has been updated`,
              type: "is-success"
            });
            this.$router.push({name: "userInitiativesList"});
          })
          .catch(err => {
            console.error(err);
            if (err.response && err.response.data)
              this.$toast.open(err.response.data.message);
          })
          .finally(() => {
            this.stopLoading();
          });
      }).catch(err => {
        this.$toast.open(err.response.data.message);
      });
    },
    submitLocation() {
      this.startLoading();
      let locationPayloadModified = this.createPayloadLocationForm()
      let payload = this.diffObject(this.originalLocationPayload, locationPayloadModified)
      if(payload.registered_city_id == null){
        this.$http.delete(`/v1/initiatives/${this.id}/city`)
        .then(res => {
          this.$toast.open({
            message: `<i class="fas fa-check"></i>&nbsp;Initiative has been updated`,
            type: "is-success"
          });
          this.$router.push({name: "userInitiativesList"});
        })
        .catch(err => {
          console.error(err);
          if (err.response && err.response.data)
            this.$toast.open(err.response.data.message);
        })
        .finally(() => {
          this.stopLoading();
          return
        });
      }
      if(payload.registered_city_id){
        this.$http
        .post(`/v1/initiatives/${this.id}/city`, this.makePayload(payload))
        .then(res => {
          this.$toast.open({
            message: `<i class="fas fa-check"></i>&nbsp;Initiative has been updated`,
            type: "is-success"
          });
          this.$router.push({name: "userInitiativesList"});
        })
        .catch(err => {
          console.error(err);
          if (err.response && err.response.data)
            this.$toast.open(err.response.data.message);
        })
        .finally(() => {
          this.stopLoading();
          return
        });
      }
    }
  }
};
</script>

<style>
</style>