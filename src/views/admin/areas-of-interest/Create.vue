<template>
  <section>
    <h1 class="title is-3">New area of interest</h1>
    <p>Add a new area of interest.</p>
    <br />
    <div class="card">
      <div class="card-content">

    <div class="field">
          <label for class="label">Name of the area of interest</label>
          <div class="control">
            <input
              v-model="termInput"
              type="text"
              class="input"
              name="Area"
              placeholder="Type the name"
              v-validate="{required: true, max: 100}"
            >
            <p class="help is-danger" :v-show="errors.has('Area')">{{errors.first('Area')}}</p>
          </div>
        </div>
        <div class="field">
          <div class="control">
        <div class="buttons is-right">
          <button @click="submit" class="button is-primary">
            <i class="fas fa-plus"></i>&nbsp;Create area of interest
          </button>
        </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>

export default {
  components: {

  },
  data() {
    return {
      termInput: null,
    };
  },
  methods: {
    getPayload() {
      const data = {};
      const options = {};
      data.name = this.termInput;
      data.taxonomy_id = 'topics';
      data.data = null;
      return {
        data,
        options,
      };
    },
    submit() {
      this.$validator.validateAll().then((valid) => {
        if (!valid) {
          this.$toast.open({ message: this.$t('globals.formNotValid'), type: 'is-danger' });
          return false;
        }
        this.startLoading();
        this.$http
          .post('/v1/terms', this.getPayload())
          .then(() => {
            this.$toast.open({
              message: '<i class="fas fa-check"></i>&nbsp;New area of interest has been created',
              type: 'is-success',
            });
            this.$router.push({ name: 'adminAreasOfInterestList' });
          })
          .catch((err) => {
            console.error(err);
            if (err.response && err.response.data) this.$toast.open(err.response.data.message);
          })
          .finally(() => {
            this.stopLoading();
          });
      });
    },
  },
};
</script>

<style>
</style>
