<template>
  <section>
    <h1 class="title is-3">Administrators</h1>
    <p>Here you can see and add new administrators to the platform</p>
    <br>
    <div class="card">
      <div class="card-content">
        <div class="field">
          <label for class="label">Add a new admin</label>
          <div class="control">
            <input
              v-model="emailInput"
              type="text"
              class="input"
              name="Email"
              placeholder="Type the email"
              v-validate="{email: true}"
              @keyup.enter="findUser"
            >
            <p class="help is-dark">Write the new email of the new administrator</p>
            <p class="help is-danger" :v-show="errors.has('Email')">{{errors.first('Email')}}</p>
          </div>
        </div>
        <div class="buttons is-right">
          <button @click="findUser" class="button is-primary"><i class="fas fa-search"></i>&nbsp;Check user</button>
        </div>
      </div>
    </div>
    <div class="card" v-if="userFound">
      <div class="card-content">
        <b-notification type="is-dark" aria-close-label="Close notification" @close="userFound = null">
          <div class="content">

            <p>Found user <b>{{userFound.display_name}}</b><br>Do you want to add the user as an Administrator?</p>
            <div class="buttons">
              <button @click="submit" class="button is-primary is-small"><i class="fas fa-check"></i>&nbsp;Yes</button>
            </div>
          </div>
        </b-notification>
      </div>
    </div>
     <div class="card">
      <div class="card-content">
        <b-table :data="admins" :loading="fetching" striped>
          <template slot-scope="props">
          <b-table-column field="id" label="ID" width="40" numeric>{{ props.row.id }}</b-table-column>
            <b-table-column label="Avatar" width="100" centered><img :src="makeUserAvatar(props.row)" class="image is-rounded is-48x48 is-centered" alt=""></b-table-column>
            <b-table-column field="display_name" label="Name and surname" sortable>{{ props.row.display_name }}</b-table-column>
            <b-table-column label="Actions" width="100" centered>
              <div class="buttons is-marginless is-centered">
                <a class="button is-small" disabled><i class="fas fa-times"></i></a>
              </div>
            </b-table-column>
          </template>
          <template slot="empty">
            <empty-table></empty-table>
          </template>
        </b-table>
        <br>
        <pagination-bar
          ref="paginator"
          resource-url="/v1/subjects"
          @update="getAdmins"
          :fetching.sync="fetching"
          :query="query"
        ></pagination-bar>
      </div>
    </div>
  </section>
</template>

<script>
import PaginationBar from '@/components/utils/PaginationBar';
import EmptyTable from '@/components/utils/EmptyTable';

export default {
  components: {
    PaginationBar,
    EmptyTable,
  },
  data() {
    return {
      emailInput: null,
      admins: [],
      fetching: null,
      userFound: null,
    };
  },
  mounted() {},
  methods: {
    getAdmins(data) {
      this.admins = data;
    },
    findUser() {
      this.$http.get(`/v1/subjects?role=User&username=${this.emailInput}`)
        .then((res) => {
          if (res.data.data[0]) {
            this.userFound = res.data.data[0];
          }
          if (res.data.data.length === 0) {
            this.$toast.open({
              message: `No result with email <i class="fas fa-envelope fa-fw"></i>&nbsp;${this.emailInput}`,
              type: 'is-warning',
            });
          }
        });
    },
    getPayload() {
      const data = {};
      return { data };
    },
    submit() {
      this.startLoading();
      this.$http.post(`/v1/subjects/${this.userFound.id}/roles/Admin`, this.getPayload())
        .then(() => {
          this.userFound = null;
          this.$toast.open({
            message: '<i class="fas fa-check"></i>&nbsp;New administrator added',
            type: 'is-success',
          });
          this.$refs.paginator.getResource();
        }).catch((err) => {
          console.error(err);
          this.$toast.open({
            message: '<i class="fas fa-times"></i>&nbsp;Error while adding administrator',
            type: 'is-danger',
          });
          this.stopLoading();
        });
    },
  },
  computed: {
    query() {
      return { role: 'Admin' };
    },
  },
};
</script>

<style>
</style>
