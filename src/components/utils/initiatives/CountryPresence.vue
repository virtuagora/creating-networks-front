<template>
  <section>
    <h1 class="title is-3 has-text-dark">Presence in countries</h1>
    <p>Countries there the initiative is working or doing presence</p>
    <br />
    <b-taglist v-if="model.countries && model.countries.length > 0">
      <b-tag
        v-for="country in model.countries"
        type="is-primary"
        size="is-medium"
        closable
        :key="country.id"
        @close="remove(country.id)"
      >{{ getSpaceLocalization(country) }}</b-tag>
    </b-taglist>
    <hr />
    <h1 class="subtitle has-text-dark is-4 is-marginless">Add a new country</h1>
    <p>Here you can add a new country where your initiative has presence:</p>
    <br />
    <div class="columns">
      <div class="column">
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
            >
              <template slot="empty">{{$t('admin.initiatives.create.fields.location.noResults')}}</template>
              <template slot-scope="props">{{ props.option.name }}</template>
            </b-autocomplete>
          </div>
        </div>
      </div>
      <div class="column is-narrow">
        <button class="button is-primary" @click="checkSubmit" :disabled="!selectedCountry">
          <i class="fas fa-plus"></i>&nbsp;Add country
        </button>
      </div>
    </div>
  </section>
</template>

<script>
// import PaginationBar from "@/components/utils/PaginationBar";
// import EmptyTable from "@/components/utils/EmptyTable";

export default {
  props: ["model", "id"],
  components: {
    // PaginationBar,
    // EmptyTable
  },
  data() {
    return {
      queryRegion: "",
      queryCountry: "",
      fetchingRegions: true,
      fetchingCountries: false,
      dataRegions: [],
      dataCountries: [],
      selectedRegion: null,
      selectedCountry: null
    };
  },
  mounted() {
    this.fetchRegions();
  },
  methods: {
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
    checkSubmit() {
      let found = this.model.countries.find(
        c => c.id == this.selectedCountry.id
      );
      if (!found) this.submit();
      else {
        this.$toast.open({
          message:
            '<i class="fas fa-check"></i>&nbsp;The country is already listed',
          type: "is-warning"
        });
        this.queryRegion = "";
        this.queryCountry = "";
        this.selectedRegion = null;
        this.selectedCountry = null;
      }
    },
    submit() {
      this.startLoading();
      this.$http
        .post(`/v1/initiatives/${this.id}/countries`, this.getPayload())
        .then(() => {
          this.$emit("updateModel");
          this.queryRegion = "";
          this.queryCountry = "";
          this.selectedRegion = null;
          this.selectedCountry = null;
          this.$toast.open({
            message:
              '<i class="fas fa-check"></i>&nbsp;New country associated to the initiative',
            type: "is-success"
          });
        })
        .catch(err => {
          console.error(err);
          this.$toast.open({
            message:
              '<i class="fas fa-times"></i>&nbsp;Error while adding country to initiative',
            type: "is-danger"
          });
        })
        .finally(() => {
          this.stopLoading();
        });
    },
    remove(id) {
      this.startLoading();
      this.$http
        .delete(`/v1/initiatives/${this.id}/countries/${id}`)
        .then(() => {
          this.$emit("updateModel");
          this.$toast.open({
            message:
              '<i class="fas fa-check"></i>&nbsp;The country has been removed from the initiative',
            type: "is-success"
          });
        })
        .catch(err => {
          console.error(err);
          this.$toast.open({
            message:
              '<i class="fas fa-times"></i>&nbsp;Error while removing country from initiative',
            type: "is-danger"
          });
        })
        .finally(() => {
          this.stopLoading();
        });
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

<style>
</style>
