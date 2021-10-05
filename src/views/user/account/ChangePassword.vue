<template>
  <section>
    <h1 class="title is-3">Change my password</h1>
    <p>Here you can change your password</p>
    <br>
    <section v-if="!response.ok">
      <div class="card">
      <div class="card-content">
        <div class="field">
          <label for class="label">Your old and dusty password</label>
          <div class="control">
            <input
              v-model="currentPassword"
              type="password"
              class="input"
              name="currentPassword"
              data-vv-as="Old password"
              placeholder="Type your old password"
              v-validate="{required: true, min: 6}"
            >
            <p
              class="help is-danger"
              :v-show="errors.has('currentPassword')"
            >{{errors.first('currentPassword')}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-content">
        <div class="field">
          <label for class="label">Your new brillant password</label>
          <div class="control">
            <input
              v-model="password"
              type="password"
              class="input"
              name="newPassword"
              ref="newPassword"
              data-vv-as="New password"
              placeholder="Type your new password"
              v-validate="{required: true, min: 6}"
            >
            <p
              class="help is-danger"
              :v-show="errors.has('newPassword')"
            >{{errors.first('newPassword')}}</p>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-content">
          <div class="field">
            <label for class="label">Now rewrite your awesome password</label>
            <div class="control">
              <input
                v-model="confirmPassword"
                type="password"
                class="input"
                name="confirmPassword"
                data-vv-as="Confirm password"
                placeholder="Confirm your new password"
                v-validate="{required: true, confirmed: 'newPassword'}"
              >
              <p
                class="help is-danger"
                :v-show="errors.has('confirmPassword')"
              >{{errors.first('confirmPassword')}}</p>
            </div>
          </div>
          <div class="buttons is-right" >
            <div class="button is-primary" @click="submit">Save</div>
          </div>
        </div>
      </div>
    </div>
    </section>
    <div class="notification is-success" v-else>
      <i class="fas fa-check"></i>&nbsp; Success!
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      currentPassword: null,
      password: null,
      confirmPassword: null,
      response: {
        ok: false,
      },
    };
  },
  methods: {
    getPayload() {
      const data = {};
      const options = {};
      data.password = this.password;
      options.current_password = this.currentPassword;
      return { data, options };
    },
    // Submit new pending user
    submit() {
      this.$validator.validateAll().then((valid) => {
        if (!valid) {
          // Not valid
          this.$toast.open({
            message: this.$t('globals.formNotValid'),
            type: 'is-danger',
          });
          return false;
        }
        // is valid, then...
        this.startLoading();
        this.$http
          .put(`/v1/users/${this.user.id}/password`, this.getPayload())
          .then(() => {
            this.response.ok = true;
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
