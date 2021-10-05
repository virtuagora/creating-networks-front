<template>
  <section>
    <div class="field">
      <label for class="label">Paste the link of your YouTube video</label>
      <div class="control">
        <div class="field has-addons">
          <p class="control">
            <a class="button is-static">
              <i class="fab fa-youtube fa-fw"></i>
            </a>
          </p>
          <p class="control">
            <a class="button is-static">YouTube URL</a>
          </p>
          <div class="control is-expanded">
            <input
              type="text"
              v-model="urlInput"
              class="input"
              name="twitter"
              v-validate="{required: true, url: true, min: 8, max:250 }"
              :data-vv-as="$t('admin.videos.create.fields.public_data.networks.youtube')"
              :placeholder="$t('admin.videos.create.placeholder')"
              @blur="extractVideoId"
            />
          </div>
        </div>
        <div class="help is-danger" v-if="errors.has('youtube')">{{errors.first('youtube')}}</div>
        <div class="help is-danger" v-if="noVideoId">Invalid YouTube video</div>
        <a
          :href="`https://youtube.com/watch?v=${model.public_data.youtube}`"
          class="has-text-primary help"
          v-if="!errors.has('youtube') && model.public_data.youtube"
        >{{$t('admin.videos.create.fields.public_data.networks.test')}}</a>
      </div>
    </div>
    <hr />
    <div class="field">
      <label for class="label">{{$t('admin.videos.create.fields.title.label')}}</label>
      <div class="control">
        <input
          type="text"
          v-model="model.title"
          v-validate="{required: true, min: 1, max: 100}"
          :data-vv-as="$t('admin.videos.create.fields.title.label')"
          name="title"
          class="input"
          :placeholder="$t('admin.videos.create.placeholder')"
        />
        <div class="help is-danger" v-if="errors.has('title')">{{errors.first('title')}}</div>
      </div>
    </div>
    <div class="field">
      <label for class="label">{{$t('admin.videos.create.fields.content.label')}}</label>
      <div class="control">
        <textarea
          v-model="model.content"
          class="textarea"
          rows="4"
          v-validate="{required:true, min: 1, max:1000 }"
          :data-vv-as="$t('admin.videos.create.fields.content.label')"
          name="content"
          :placeholder="$t('admin.videos.create.placeholder')"
        ></textarea>
        <div class="help is-danger" v-if="errors.has('content')">{{errors.first('content')}}</div>
      </div>
    </div>
    <hr>
    <div class="columns" v-if="showYoutubePanel">
      <div class="column is-4">
        <div class="videoWrapper">
          <iframe
            width="100%"
            height="auto"
            :src="`https://www.youtube.com/embed/${model.public_data.youtube}`"
            frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </div>
      <div class="column">
        <h1 class="title is-3 has-text-dark">{{model.title}}</h1>
        <p class="add-br">{{model.content}}</p>
      </div>
    </div>
    <hr>
    <div class="field">
      <div class="control">
        <div class="buttons is-right">
          <button @click="$emit('submit')" class="button is-primary">
            <i class="fas" :class="{'fa-save': edit, 'fa-plus': !edit}"></i>&nbsp;{{edit ? 'Update' : 'Create'}} video
          </button>
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
    return {
      showYoutubePanel: false,
      urlInput: null,
      noVideoId: false,
    };
  },
  mounted() {
    if (this.edit) {
      this.urlInput = `https://youtube.com/watch?v=${this.model.public_data.youtube}`;
      this.showYoutubePanel = true;
    }
  },
  methods: {
    extractVideoId() {
      this.noVideoId = false;
      // eslint-disable-next-line no-useless-escape
      const regex = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
      const r = this.urlInput.match(regex);
      this.model.public_data.youtube = r[1];
      if (r[1]) this.showYoutubePanel = true;
      else {
        this.showYoutubePanel = false;
        this.noVideoId = true;
      }
    },
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

<style lang="scss" scoped>
.videoWrapper {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 */
  padding-top: 25px;
  height: 0;
}
.videoWrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
