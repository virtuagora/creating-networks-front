<template>
  <section>
    <h1 class="title is-3">List of videos for Creating Networks TV</h1>
    <p>All the videos added to Creating Networks Tv</p>
    <br>
    <div class="card">
      <div class="card-content">
        <b-table :data="videos" :loading="fetching" striped>
          <template slot-scope="props">
            <b-table-column field="id" label="ID" width="40" numeric>{{ props.row.id }}</b-table-column>
            <b-table-column field="name" label="Name" sortable>
              <router-link :to="{ name: 'initiative', params: { id: props.row.id } }">{{ props.row.title }}</router-link></b-table-column>
            <b-table-column field="created_at" label="Created">{{ props.row.created_at }}</b-table-column>
            <b-table-column width="50"><router-link :to="{name: 'adminCreatingNetworksTvEdit', params: {id: props.row.id}}">Edit</router-link>&nbsp;<a @click="openModalDelete(props.row)" class="has-text-danger">Delete</a></b-table-column>
          </template>
          <template slot="empty">
            <empty-table></empty-table>
          </template>
        </b-table>
        <br>
        <pagination-bar
          ref="paginator"
          resource-url="/v1/videos"
          @update="getVideos"
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
      videos: [],
      fetching: null,
    };
  },
  mounted() {},
  methods: {
    getVideos(data) {
      this.videos = data;
    },
    openModalDelete(resource) {
      this.$modal.open({
        parent: this,
        component: ConfirmDelete,
        props: {
          resourceType: 'videos',
          resource,
        },
        hasModalCard: true,
        events: {
          confirm: (resource) => {
            this.deleteVideo(resource);
          },
        },
      });
    },
    deleteVideo(resource) {
      this.startLoading();
      this.$http.delete(`/v1/videos/${resource.id}`)
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
