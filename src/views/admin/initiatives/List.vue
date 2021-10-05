<template>
  <section>
    <h1 class="title is-3">List of initiatives</h1>
    <p>Take a look at the initiatives added to the platform</p>
    <br>
    <div class="card">
      <div class="card-content">
        <b-table :data="initiatives" :loading="fetching" striped>
          <template slot-scope="props">
            <b-table-column field="id" label="ID" width="40" numeric>{{ props.row.id }}</b-table-column>
            <b-table-column field="name" label="Name" sortable>
              <router-link :to="{ name: 'adminInitiativesEdit', params: { id: props.row.id } }">{{ props.row.name }}</router-link></b-table-column>
            <b-table-column field="created_at" label="Created">{{ props.row.created_at.split(' ')[0] }}</b-table-column>
            <b-table-column width="80"><router-link :to="{name: 'initiative', params: {id: props.row.id}}">View</router-link>&nbsp;&nbsp;<router-link :to="{name: 'adminInitiativesEdit', params: {id: props.row.id}}">Edit</router-link>&nbsp;&nbsp;<a @click="openModalDelete(props.row)" class="has-text-danger">Delete</a></b-table-column>
          </template>
          <template slot="empty">
            <empty-table></empty-table>
          </template>
        </b-table>
        <br>
        <pagination-bar
          ref="paginator"
          resource-url="/v1/initiatives"
          @update="getInitiatives"
          :fetching.sync="fetching"
        ></pagination-bar>
      </div>
    </div>
  </section>
</template>

<script>
import PaginationBar from '@/components/utils/PaginationBar';
import EmptyTable from '@/components/utils/EmptyTable';
import ConfirmDelete from '@/components/utils/modals/ConfirmDelete';

export default {
  components: {
    PaginationBar,
    EmptyTable,
  },
  data() {
    return {
      initiatives: [],
      fetching: null,
    };
  },
  mounted() {},
  methods: {
    getInitiatives(data) {
      this.initiatives = data;
    },
    openModalDelete(resource) {
      this.$modal.open({
        parent: this,
        component: ConfirmDelete,
        props: {
          resourceType: 'initiative',
          resource,
        },
        hasModalCard: true,
        events: {
          confirm: (resource) => {
            this.deleteInitiative(resource);
          },
        },
      });
    },
    deleteInitiative(resource) {
      this.startLoading();
      this.$http.delete(`/v1/initiatives/${resource.id}`)
        .then(() => {
          this.$toast.open({
            message: '<i class="fas fa-check"></i>&nbsp;The initiative has been deleted',
            type: 'is-success',
          });
          this.$refs.paginator.getResource();
        }).catch((err) => {
          console.error(err);
          this.$toast.open({
            message: '<i class="fas fa-times"></i>&nbsp;Error while deleting an initiative',
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
