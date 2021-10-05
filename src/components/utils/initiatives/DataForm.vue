<template>
  <section>
    <div class="field">
      <label for class="label">{{$t('admin.initiatives.create.fields.name.label')}}</label>
      <div class="control">
        <input
          type="text"
          v-model="model.name"
          v-validate="{required: true}"
          :data-vv-as="$t('admin.initiatives.create.fields.name.label')"
          name="name"
          class="input"
          :placeholder="$t('admin.initiatives.create.placeholder')"
        />
        <div class="help is-danger" v-if="errors.has('name')">{{errors.first('name')}}</div>
      </div>
    </div>
    <div class="field">
      <label for class="label">{{$t('admin.initiatives.create.fields.description.label')}}</label>
      <div class="control">
        <textarea
          v-model="model.description"
          class="textarea"
          rows="4"
          v-validate="{required:true, max:500 }"
          :data-vv-as="$t('admin.initiatives.create.fields.description.label')"
          name="description"
          :placeholder="$t('admin.initiatives.create.placeholder')"
        ></textarea>
        <div class="help is-danger" v-if="errors.has('description')">{{errors.first('description')}}</div>
      </div>
    </div>
    <br />
    <h1
      class="title is-3 has-text-black"
    >{{$t('admin.initiatives.create.fields.public_data.label')}}</h1>
    <div class="field">
      <label for class="label">{{$t('admin.initiatives.create.fields.public_data.goals.label')}}</label>
      <div class="control">
        <textarea
          v-model="model.public_data.goals"
          class="textarea"
          rows="4"
          v-validate="{required:true, max:750}"
          :data-vv-as="$t('admin.initiatives.create.fields.public_data.goals.label')"
          name="goals"
          :placeholder="$t('admin.initiatives.create.placeholder')"
        ></textarea>
        <div class="help is-danger" v-if="errors.has('goals')">{{errors.first('goals')}}</div>
      </div>
    </div>
    <div class="field">
      <label
        for
        class="label"
      >{{$t('admin.initiatives.create.fields.public_data.founding_year.label')}}</label>
      <div class="control">
        <input
          type="text"
          v-model="model.public_data.founding_year"
          v-validate="{required: true, between: [1900,2020], date_format: 'yyyy' }"
          :data-vv-as="$t('admin.initiatives.create.fields.public_data.founding_year.label')"
          name="founding_year"
          class="input"
          :placeholder="$t('admin.initiatives.create.placeholder')"
        />
        <div
          class="help is-danger"
          v-if="errors.has('founding_year')"
        >{{errors.first('founding_year')}}</div>
      </div>
    </div>
    <div class="field">
      <label
        for
        class="label"
      >{{$t('admin.initiatives.create.fields.public_data.role_of_youth.label')}}</label>
      <div class="control">
        <div class="block">
          <b-radio
            v-model="model.public_data.role_of_youth"
            v-validate="{required:true}"
            name="role"
            native-value="targetAudience"
          >{{$t('admin.initiatives.create.fields.public_data.role_of_youth.options')['targetAudience']}}</b-radio>
          <b-radio
            v-model="model.public_data.role_of_youth"
            v-validate="{required:true}"
            name="role"
            native-value="leadership"
          >{{$t('admin.initiatives.create.fields.public_data.role_of_youth.options')['leadership']}}</b-radio>
          <b-radio
            v-model="model.public_data.role_of_youth"
            v-validate="{required:true}"
            name="role"
            native-value="membership"
          >{{$t('admin.initiatives.create.fields.public_data.role_of_youth.options')['membership']}}</b-radio>
        </div>
        <div class="help is-danger" v-if="errors.has('role')">{{errors.first('role')}}</div>
      </div>
    </div>
    <div class="field">
      <label for class="label">{{$t('admin.initiatives.create.fields.public_data.networks.label')}}</label>
      <div class="control">
        <div class="field">
          <div class="control">
            <div class="field has-addons">
              <p class="control">
                <a class="button is-static">
                  <i class="fas fa-globe fa-fw"></i>
                </a>
              </p>
              <p class="control">
                <a class="button is-static">https://</a>
              </p>
              <div class="control is-expanded">
                <input
                  type="text"
                  v-model="model.public_data.website"
                  class="input has-text-centered"
                  name="website"
                  v-validate="{required: false, min: 5, max:100, url: true }"
                  :data-vv-as="$t('admin.initiatives.create.fields.public_data.networks.website')"
                  :placeholder="$t('forms.user.addInitiative.optional')"
                />
              </div>
            </div>
            <div class="help is-danger" v-if="errors.has('website')">{{errors.first('website')}}</div>
            <a
              :href="`https://${model.public_data.website}`"
              class="has-text-primary help"
              v-if="!errors.has('website') && model.public_data.website"
            >{{$t('admin.initiatives.create.fields.public_data.networks.test')}}</a>
          </div>
        </div>
        <div class="field">
          <div class="control">
            <div class="field has-addons">
              <p class="control">
                <a class="button is-static">
                  <i class="fab fa-facebook fa-fw"></i>
                </a>
              </p>
              <p class="control">
                <a class="button is-static">https://facebook.com/</a>
              </p>
              <div class="control is-expanded">
                <input
                  type="text"
                  v-model="model.public_data.facebook"
                  class="input has-text-centered"
                  name="facebook"
                  v-validate="{required: false, min: 3, max:100 }"
                  :data-vv-as="$t('admin.initiatives.create.fields.public_data.networks.facebook')"
                  :placeholder="$t('forms.user.addInitiative.optional')"
                />
              </div>
            </div>
            <div class="help is-danger" v-if="errors.has('facebook')">{{errors.first('facebook')}}</div>
            <a
              :href="`https://facebook.com/${model.public_data.facebook}`"
              class="has-text-primary help"
              v-if="!errors.has('facebook') && model.public_data.facebook"
            >{{$t('admin.initiatives.create.fields.public_data.networks.test')}}</a>
          </div>
        </div>
        <div class="field">
          <div class="control">
            <div class="field has-addons">
              <p class="control">
                <a class="button is-static">
                  <i class="fab fa-twitter fa-fw"></i>
                </a>
              </p>
              <p class="control">
                <a class="button is-static">https://twitter.com/</a>
              </p>
              <div class="control is-expanded">
                <input
                  type="text"
                  v-model="model.public_data.twitter"
                  class="input has-text-centered"
                  name="twitter"
                  v-validate="{required: false, min: 3, max:100 }"
                  :data-vv-as="$t('admin.initiatives.create.fields.public_data.networks.twitter')"
                  :placeholder="$t('forms.user.addInitiative.optional')"
                />
              </div>
            </div>
            <div class="help is-danger" v-if="errors.has('twitter')">{{errors.first('twitter')}}</div>
            <a
              :href="`https://twitter.com/${model.public_data.twitter}`"
              class="has-text-primary help"
              v-if="!errors.has('twitter') && model.public_data.twitter"
            >{{$t('admin.initiatives.create.fields.public_data.networks.test')}}</a>
          </div>
        </div>
        <div class="field">
          <div class="control">
            <div class="field has-addons">
              <p class="control">
                <a class="button is-static">
                  <i class="fas fa-asterisk fa-fw"></i>
                </a>
              </p>
              <p class="control">
                <a class="button is-static">https://</a>
              </p>
              <div class="control is-expanded">
                <input
                  type="text"
                  v-model="model.public_data.other_network"
                  class="input has-text-centered"
                  name="other_network"
                  v-validate="{required: false, min: 5, max:100, url: true }"
                  :data-vv-as="$t('admin.initiatives.create.fields.public_data.networks.other_network')"
                  :placeholder="$t('admin.initiatives.create.fields.public_data.networks.other_network')"
                />
              </div>
            </div>
            <div
              class="help is-danger"
              v-if="errors.has('other_network')"
            >{{errors.first('other_network')}}</div>
            <a
              :href="`https://${model.public_data.other_network}`"
              class="has-text-primary help"
              v-if="!errors.has('other_network') && model.public_data.other_network"
            >{{$t('admin.initiatives.create.fields.public_data.networks.test')}}</a>
          </div>
        </div>
      </div>
    </div>
    <br />
    <h1
      class="title is-3 has-text-black"
    >{{$t('admin.initiatives.create.fields.private_data.label')}}</h1>
    <div class="field">
      <label
        for
        class="label"
      >{{$t('admin.initiatives.create.fields.private_data.contact_email.label')}}</label>
      <div class="control">
        <input
          type="text"
          v-model="model.private_data.contact_email"
          v-validate="{required: true, email: true}"
          :data-vv-as="$t('admin.initiatives.create.fields.private_data.contact_email.label')"
          name="contact_email"
          class="input"
          :placeholder="$t('admin.initiatives.create.placeholder')"
        />
        <div
          class="help is-danger"
          v-if="errors.has('contact_email')"
        >{{errors.first('contact_email')}}</div>
      </div>
    </div>
    <div class="field">
      <label
        for
        class="label"
      >{{$t('admin.initiatives.create.fields.private_data.contact_phone.label')}}</label>
      <div class="control">
        <input
          type="text"
          v-model="model.private_data.contact_phone"
          v-validate="{required: false, min: 5, max: 30 }"
          :data-vv-as="$t('admin.initiatives.create.fields.private_data.contact_phone.label')"
          name="contact_phone"
          class="input"
          :placeholder="$t('admin.initiatives.create.optional')"
        />
        <div
          class="help is-danger"
          v-if="errors.has('contact_phone')"
        >{{errors.first('contact_phone')}}</div>
      </div>
    </div>
    <div v-if="edit">
      <hr>
      <div class="field">
        <div class="control">
          <div class="buttons is-right">
            <button @click="$emit('update')" class="button is-primary">
              <i class="fas fa-save"></i>&nbsp;Update
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    model: {
      type: Object,
      required: true,
    },
    edit: {
      type: Boolean,
    },
  },
  data() {
    return {};
  },
  methods: {
    validate() {
      const promise = new Promise((resolve) => {
        this.$validator.validateAll().then((result) => {
          if (!result) {
            return resolve(result);
          }
          return resolve(result);
        });
      });
      return promise;
    },
  },
};
</script>

<style>
</style>
