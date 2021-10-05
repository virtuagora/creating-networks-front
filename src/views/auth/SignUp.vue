<template>
  <section class="has-text-centered" v-if="!response.ok">
    <p>
    {{$t('auth.signUp.welcome')}}
    </p>
    <br>
    <div class="field">
      <div class="control">
        <input type="email" v-model="email" name="email" class="input is-medium has-text-centered" v-validate="{required:true, email:true}" placeholder="Email">
        <span class="help is-danger" v-if="errors.has('email')">{{errors.first('email')}}</span>
      </div>
    </div>
    <div class="field">
      <div class="control">
        <vue-recaptcha :sitekey="siteKey" @verify="catchRecaptcha" @expired="recaptcha = null"></vue-recaptcha>
      </div>
    </div>
    <br>
    <div class="field">
      <div class="control has-text-centered">
          <a @click="submit" :disabled="!recaptcha" class="is-size-4 has-text-primary">
            {{$t('auth.signUp.actionButton')}}&nbsp;&nbsp;<i class="fas fa-user-plus fa-lg"></i>
          </a>
      </div>
    </div>
    <br>
    <p>
    {{$t('auth.signUp.goBack[0]')}} <router-link :to="{name: 'login'}" class="has-text-primary">{{$t('auth.signUp.goBack[1]')}}</router-link>
    </p>
  </section>
  <section v-else>
    <h1 class="title animated fadeInUp is-4 has-text-centered"> {{$t('auth.signUp.response.title')}}</h1>
    <div class="box is-light has-text-centered">
      <p class="animated heartBeat delay-1s has-text-black"><i class="fas fa-info-circle fa-lg"></i></p>
      <p class="has-text-black">{{$t('auth.signUp.response.notification')}}</p>
    </div>
    <div class="content has-text-centered">
    <p>{{$t('auth.signUp.response.instruction')}}</p>
    </div>
  </section>
</template>

<script>
import VueRecaptcha from 'vue-recaptcha';

export default {
  components: { VueRecaptcha },
  data() {
    return {
      email: null,
      recaptcha: null,
      response: {
        ok: false,
      },
    };
  },
  methods: {
    // Make postPayload
    catchRecaptcha(response) {
      this.recaptcha = response;
    },
    getPayload() {
      const data = {};
      data.email = this.email;
      data.locale = this.currentLanguage;
      const { recaptcha } = this;
      return { data, recaptcha };
    },
    // Submit new pending user
    submit() {
      this.$validator.validateAll().then((valid) => {
        if (!valid) {
          // Not valid
          this.$toast.open({ message: this.$t('globals.formNotValid'), type: 'is-danger' });
          return false;
        }
        // is valid, then...
        this.startLoading();
        this.$http.post('/v1/pending-users', this.getPayload())
          .then(() => {
            this.response.ok = true;
          }).catch((err) => {
            console.error(err);
            if (err.response && err.response.data) this.$toast.open(err.response.data.message);
          }).finally(() => {
            this.stopLoading();
          });
      });
    },
  },
  computed: {
    siteKey() {
      return process.env.VUE_APP_RECAPTCHA_SITE_KEY;
    },
  },
};
</script>
