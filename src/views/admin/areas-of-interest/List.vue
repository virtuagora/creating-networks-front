<template>
  <section>
    <h1 class="title is-3">List of areas of interest</h1>
    <p>Take a look at the areas of interest added to the platform</p>
    <br>
    <div class="card">
      <div class="card-content">
        <b-table :data="terms" :loading="fetching" striped>
          <template slot-scope="props">
            <b-table-column field="name" label="Areas" sortable>{{ props.row.name }}</b-table-column>
            <b-table-column width="50"><a @click="openModalDelete(props.row)" class="has-text-danger">Delete</a></b-table-column>
          </template>
          <template slot="empty">
            <empty-table></empty-table>
          </template>
        </b-table>
        <br>
        <pagination-bar
          resource-url="/v1/terms"
          :query="query"
          @update="getTerms"
          :fetching.sync="fetching"
        ></pagination-bar>
      </div>
    </div>
  </section>
</template>

<script>
import ConfirmDelete from '@/components/utils/modals/ConfirmDelete';
import PaginationBar from '@/components/utils/PaginationBar';
import EmptyTable from '@/components/utils/EmptyTable';

export default {
  components: {
    PaginationBar,
    EmptyTable,
  },
  data() {
    return {
      terms: [],
      fetching: null,
      query: {
        taxonomy: 'topics',
      },
    };
  },
  mounted() {},
  methods: {
    getTerms(data) {
      this.terms = data;
    },
    openModalDelete(resource) {
      this.$modal.open({
        parent: this,
        component: ConfirmDelete,
        props: {
          resourceType: 'areaOfInterest',
          resource,
        },
        hasModalCard: true,
        events: {
          confirm: (resource) => {
            this.deleteAreaOfInterest(resource);
          },
        },
      });
    },
    deleteAreaOfInterest(resource) {
      this.startLoading();
      this.$http.delete(`/v1/terms/${resource.id}`)
        .then(() => {
          this.$toast.open({
            message: '<i class="fas fa-check"></i>&nbsp;The area of interest has been deleted',
            type: 'is-success',
          });
          this.$refs.paginator.getResource();
        }).catch((err) => {
          console.error(err);
          this.$toast.open({
            message: '<i class="fas fa-times"></i>&nbsp;Error while deleting the area of interest',
            type: 'is-danger',
          });
          this.stopLoading();
        });
    },
  },
};
</script>

<style>
</style>
