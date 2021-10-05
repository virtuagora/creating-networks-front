<template>
  <section>
    <h1 class="title is-3 has-text-dark">Members of the initiative</h1>
    <p>Here you can see and add new members to the initiative.<br>You can add members to your initiative <b>AFTER</b> they are followers of your initiative</p>
    <br />
    <div class="notification is-dark">
      <p>
        <i class="fas fa-exclamation-triangle"></i>&nbsp;<b>BE CAREFUL</b>
      </p>
      <p class="is-size-7">* Try not to lock yourself out of the initiative without any responsables. If that happens, contact an admin.</p>
      <p class="is-size-7">* Remember, only users with role "owner" can edit an initiative</p>
    </div>
    <b-table :data="subjects" :loading="fetching" striped>
      <template slot-scope="props">
        <b-table-column label="Avatar" width="60" centered>
          <img :src="makeUserAvatar(props.row)" class="image is-rounded is-32x32 is-centered" alt />
        </b-table-column>
        <b-table-column
          field="display_name"
          label="Name and surname"
        >
        <p class="is-size-5">{{ props.row.display_name }}</p>
          </b-table-column>
        <b-table-column
          field="pivot.relation"
          label="Role"
          centered
        >
        <span class="tag is-dark is-rounded" v-if="props.row.pivot.relation == 'owner'"><i class="fas fa-shield-alt"></i>&nbsp;Owner</span>
        <span class="tag is-dark is-rounded" v-if="props.row.pivot.relation == 'member'"><i class="fas fa-user"></i>&nbsp;Member</span>
          </b-table-column>
        <b-table-column label="Actions" width="200">
          <div class="action-list">
            <p>
              <a @click="changeRelation('owner',props.row.id)" class="has-text-link" v-if="props.row.pivot.relation == 'member'">
                <i class="fas fa-arrow-up"></i> Promote to owner
              </a>
            </p>
            <p>
              <a @click="openModalDemote('member',props.row)" class="has-text-link" v-if="props.row.pivot.relation == 'owner'">
                <i class="fas fa-arrow-down"></i> Demote to member
              </a>
            </p>
            <p>
              <a @click="changeRelation('member',props.row.id)" class="has-text-link" v-if="props.row.pivot.relation == 'follower'">
                <i class="fas fa-arrow-up"></i> Promote to member
              </a>
            </p>
            <p>
              <a @click="openModalDemote('follower',props.row)" class="has-text-link" v-if="props.row.pivot.relation == 'member'">
                <i class="fas fa-arrow-down"></i> Demote to follower
              </a>
            </p>
          </div>
        </b-table-column>
      </template>
      <template slot="empty">
        <empty-table></empty-table>
      </template>
    </b-table>
    <br />
    <pagination-bar
      ref="paginator"
      :resource-url="`v1/initiatives/${id}/members`"
      @update="getSubjects"
      :fetching.sync="fetching"
      :query="query"
    ></pagination-bar>
  </section>
</template>

<script>
import PaginationBar from "@/components/utils/PaginationBar";
import EmptyTable from "@/components/utils/EmptyTable";
import ConfirmDemote from '@/components/utils/modals/ConfirmDemote';

export default {
  props: {
    model: {
      type: Object,
      required: true
    },
    id: {
      type: Number,
      required: true
    }
  },
  components: {
    PaginationBar,
    EmptyTable
  },
  data() {
    return {
      subjects: [],
      fetching: null,
    };
  },
  mounted() {},
  methods: {
    getSubjects(data) {
      this.subjects = data;
    },
    
    openModalDemote(resourceType,resource) {
      this.$modal.open({
        parent: this,
        component: ConfirmDemote,
        props: {
          resourceType,
          resource,
        },
        hasModalCard: true,
        events: {
          confirm: (resource,resourceType) => {
            this.changeRelation(resourceType,resource.id);
          },
        },
      });
    },
    remove(id) {
      this.startLoading();
      this.$http
        .delete(`/v1/initiatives/${this.id}/members/${id}`)
        .then(() => {
          this.userFound = null;
          this.$toast.open({
            message:
              '<i class="fas fa-check"></i>&nbsp;User has been removed from the initiative',
            type: "is-success"
          });
          this.$refs.paginator.getResource();
        })
        .catch(err => {
          console.error(err);
          this.$toast.open({
            message:
              '<i class="fas fa-times"></i>&nbsp;Error while removing user from initiative',
            type: "is-danger"
          });
          this.stopLoading();
        });
    },
    changeRelation(type,id){
      this.startLoading();
      this.$http
        .patch(
          `/v1/initiatives/${this.id}/members/${id}`,
          {
            data: {
              relation: type
            }
          }
        )
        .then(() => {
          this.$toast.open({
            message:
              '<i class="fas fa-check"></i>&nbsp;User has been updated',
            type: "is-success"
          });
          if(!this.isAdmin && this.$route.name != 'adminInitiativesEdit'){
            if(this.user.id === id && (type == "member" || type == "follower")){
              this.$store.dispatch('logout');
              this.$router.push({ name: 'home' });
            } else {
              this.$refs.paginator.getResource();
            }
          }
          this.$refs.paginator.getResource();
        })
        .catch(err => {
          console.error(err);
          this.$toast.open({
            message:
              '<i class="fas fa-times"></i>&nbsp;Error while removing user from initiative',
            type: "is-danger"
          });
        })
        .finally( () => {
          this.stopLoading();
        });
    }
  },
  computed: {
    query() {
      return {};
    }
  }
};
</script>

<style>
</style>
