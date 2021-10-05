<template>
  <section>
    <h1 class="title is-3">New initiative</h1>
    <p>Add initiatives as an admin. Later you can assign users as administrators of the initiative.</p>
    <br />
    <div class="card">
      <div class="card-content">
        <DataForm ref="data" :model.sync="model" />
      </div>
    </div>
    <div class="card">
      <div class="card-content">
        <LocationForm ref="location" :model.sync="model" />
      </div>
    </div>
    <div class="card">
      <div class="card-content">
        <div class="buttons is-right">
          <button @click="submit" class="button is-primary">
            <i class="fas fa-plus"></i>&nbsp;Create Initiative
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import DataForm from '@/components/utils/initiatives/DataForm.vue';
import LocationForm from '@/components/utils/initiatives/LocationForm.vue';

export default {
  components: {
    DataForm,
    LocationForm,
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
      },
    };
  },
  methods: {
    getPayload() {
      const data = {};
      const options = {};
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
      if (this.model.selectedCity) {
        options.registered_city_id = this.model.selectedCity.id;
      } else {
        options.registered_city_id = null;
      }
      // If user is admin, tell the api to not set the current user (admin) as the owner
      options.set_owner = false;
      return {
        data,
        options,
      };
    },
    submit() {
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
        this.$http
          .post('/v1/initiatives', this.getPayload())
          .then(() => {
            this.$toast.open({
              message: '<i class="fas fa-check"></i>&nbsp;New initiative has been created',
              type: 'is-success',
            });
            this.$router.push({ name: 'adminInitiativesList' });
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
  },
};
</script>

<style>
</style>
