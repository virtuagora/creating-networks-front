<template>
  <div>
      <div class="content">
      <p
        class="has-text-centered is-italic"
      v-for="(p,index) in $t('forms.user.addInitiative.step8.conversation')" :key="index">{{p}}</p>
    </div>
      <h1 class="subtitle is-5 has-text-centered">
        <span class="is-500 has-text-primary">5.</span>&nbsp;{{$t('forms.user.addInitiative.step8.fields[0].question')}}
      </h1>
      <div class="field">
        <div class="control">
          <input
            type="email"
            v-model="model.private_data.contact_email"
            v-validate="{required: true, email: true }"
            :data-vv-as="$t('forms.user.addInitiative.step8.fields[0].fieldName')"
            name="contact_email"
            class="input is-medium has-text-centered"
            :placeholder="$t('forms.user.addInitiative.step8.fields[0].placeholder')"
          >
          <div
            class="help is-danger"
            v-if="errors.has('contact_email')"
          >{{errors.first('contact_email')}}</div>
        </div>
      </div>
    <br>
      <h1 class="subtitle is-5 has-text-centered">
        <span class="is-500 has-text-primary">6.</span>&nbsp;{{$t('forms.user.addInitiative.step8.fields[1].question')}}
      </h1>
      <div class="field">
        <div class="control">
          <input
            type="text"
            v-model="model.private_data.contact_phone"
            v-validate="{required: false, min: 5, max: 30 }"
            :data-vv-as="$t('forms.user.addInitiative.step8.fields[1].fieldName')"
            name="contact_phone"
            class="input is-medium has-text-centered"
            :placeholder="$t('forms.user.addInitiative.step8.fields[1].placeholder')"
          >
          <div
            class="help is-danger"
            v-if="errors.has('contact_phone')"
          >{{errors.first('contact_phone')}}</div>
        </div>
      </div>
    <br>
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
      required: true,
    },
  },
  methods: {
    goForward() {
      this.$validator.validateAll().then((valid) => {
        if (!valid) {
          this.$toast.open({
            message: this.$t('globals.errors.formNotValid'),
            type: 'is-warning',
            position: 'is-bottom',
          });
          return;
        }
        this.$emit('forward');
      });
    },
  },
};
</script>
