<template>
  <div>
    <div class="content">
      <p
        class="has-text-centered is-italic"
        v-for="(p,index) in $t('forms.user.addInitiative.step6.conversation')"
        :key="index"
      >{{p}}</p>
    </div>
    <h1 class="subtitle is-5 has-text-centered">
      <span class="is-500 has-text-primary">6.</span>&nbsp;Search countries by region and add it to the list
    </h1>
   <div class="columns">
      <div class="column ">
        <div class="field">
          <div class="control">
            <b-autocomplete
              rounded
              v-model="queryRegion"
              :data="filteredRegions"
              :placeholder="placeholderRegions"
              :open-on-focus="true"
              :loading="fetchingRegions"
              field="name"
              @select="option => selectRegion(option)"
              size="is-medium"
            >
              <template slot="empty">{{$t('admin.initiatives.create.fields.location.noResults')}}</template>
              <template slot-scope="props">{{ props.option.name }}</template>
            </b-autocomplete>
          </div>
        </div>
      </div>
      <div class="column">
        <div class="field">
          <div class="control">
            <b-autocomplete
              rounded
              v-model="queryCountry"
              :data="filteredCountries"
              :placeholder="placeholderCountries"
              :open-on-focus="true"
              :loading="fetchingCountries"
              field="name"
              :readonly="!selectedRegion"
              :disabled="!selectedRegion"
              @select="option => selectCountry(option)"
              size="is-medium"
            >
              <template slot="empty">{{$t('admin.initiatives.create.fields.location.noResults')}}</template>
              <template slot-scope="props">{{ props.option.name }}</template>
            </b-autocomplete>
          </div>
        </div>
      </div>
      <div class="column is-narrow">
        <button class="button is-primary is-medium" @click="add" :disabled="!selectedCountry">
          <i class="fas fa-plus"></i>&nbsp;Add
        </button>
      </div>
    </div>
   <h1 class="subtitle is-5 has-text-centered">
      <span class="is-500 has-text-primary"></span>&nbsp;List of countries where the initiative has presence
    </h1>
    <b-taglist v-if="model.countries && model.countries.length > 0" class="is-centered">
        <b-tag v-for="country in model.countries" type="is-primary" size="is-medium" closable :key="country.id" @close="remove(country.id)">{{ getSpaceLocalization(country) }}</b-tag>
      </b-taglist>
    <p class="is-italic has-text-centered" v-else>No countries listed</p>
    <br />
    <div class="buttons is-centered">
      <button @click="$emit('backward')" class="button is-rounded is-white is-outlined is-medium">
        <i class="fas fa-arrow-left"></i>
      </button>
      <button @click="goForward" class="button is-rounded is-primary is-outlined is-medium">
        <i class="fas fa-arrow-right"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    model: {
      type: Object,
      required: true
    }
  },
  data(){
    return {
      queryRegion: "",
      queryCountry: "",
      fetchingRegions: true,
      fetchingCountries: false,
      dataRegions: [],
      dataCountries: [],
      selectedRegion: null,
      selectedCountry: null
    }
  },
  mounted() {
    this.fetchRegions();
  },
  methods: {
    goForward() {
      this.$emit('forward');
    },
    fetchRegions() {
      this.$http
        .get("/v1/regions?size=100")
        .then(res => {
          this.dataRegions = res.data.data;
        })
        .finally(() => {
          this.fetchingRegions = false;
        });
    },
    selectRegion(selectedRegion) {
      if (selectedRegion === null) return;
      this.fetchingCountries = true;
      this.selectedRegion = selectedRegion;
      this.queryCountry = "";
      this.selectedCountry = null;
      this.$http
        .get(`/v1/countries?size=100&region_id=${selectedRegion.id}`)
        .then(res => {
          this.dataCountries = res.data.data;
        })
        .finally(() => {
          this.fetchingCountries = false;
        });
    },
    selectCountry(selectedCountry) {
      if (selectedCountry == null) return;
      this.selectedCountry = selectedCountry;
    },
    getPayload() {
      const data = { countries: [this.selectedCountry.id] };
      return { data };
    },
    resetState() {
      this.queryRegion = "";
      this.queryCountry = "";
      this.dataRegions = [];
      this.dataCountries = [];
      this.fetchingRegions = true;
      this.fetchingCountries = false;
      this.selectedRegion = null;
      this.selectedCountry = null;
      this.fetchRegions();
    },
    add() {
      let found = this.model.countries.find( c => c.id == this.selectedCountry.id)
      if(!found) this.model.countries.push(this.selectedCountry)
      else {
         this.$toast.open({
          message:
            '<i class="fas fa-exclamation-triangle"></i>&nbsp;The country is already listed',
          type: "is-warning"
        });
      }
      this.queryRegion = "";
      this.queryCountry = "";
      this.selectedRegion = null;
      this.selectedCountry = null;
    },
    remove(id) {
      this.model.countries = this.model.countries.filter( c => c.id != id)           
    }
  },
  computed: {
    placeholderRegions() {
      return this.fetchingRegions
        ? this.$t("admin.initiatives.create.fields.location.fetchingRegions")
        : this.$t("admin.initiatives.create.fields.location.startTypingRegion");
    },
    placeholderCountries() {
      return this.fetchingCountries
        ? this.$t("admin.initiatives.create.fields.location.fetchingCountries")
        : this.$t(
            "admin.initiatives.create.fields.location.startTypingCountry"
          );
    },
    filteredRegions() {
      return this.dataRegions.filter(
        option =>
          option.name
            .toString()
            .toLowerCase()
            .indexOf(this.queryRegion.toLowerCase()) >= 0
      );
    },
    filteredCountries() {
      return this.dataCountries.filter(
        option =>
          option.name
            .toString()
            .toLowerCase()
            .indexOf(this.queryCountry.toLowerCase()) >= 0
      );
    },
    query() {
      return {};
    }
  }
};
</script>
