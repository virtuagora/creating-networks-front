<template>
  <section>
    <h1 class="title is-3">Edit video</h1>
    <p>Edit the video data of Creating Networks TV</p>
    <br>
    <div class="card">
      <div class="card-content">
        <VideoForm ref="data" :edit="true" :model.sync="model" @submit="submit" />
      </div>
    </div>
  </section>
</template>


<script>
import merge from 'lodash/merge';
// import omit from 'lodash/omit';
import VideoForm from '@/components/utils/videos/VideoForm.vue';

export default {
  props: ['id'],
  components: {
    VideoForm,
  },
  data() {
    return {
      activeTab: 0,
      model: {
        title: null,
        content: null,
        public_data: {
          youtube: null,
        },
      },
      originalDataPayload: null,
    };
  },
  beforeMount() {
    this.startLoading();
    this.$http.get(`/v1/videos/${this.id}`)
      .then((res) => {
        this.model = merge(this.model, res.data.data);
      }).catch((err) => {
        console.error(err);
        this.$toast.open({
          message: this.$t('globals.errors.error'),
          type: 'is-warning',
          position: 'is-bottom',
        });
      }).finally(() => {
        this.stopLoading();
      });
  },
  methods: {
    getPayload() {
      const data = {};
      const options = {};
      data.title = this.model.title;
      data.content = this.model.content;
      data.public_data = {
        youtube: this.model.public_data.youtube,
      };
      data.private_data = null;
      return {
        data,
        options,
      };
    },
    submit() {
      Promise.all([this.$refs.data.validate()]).then((values) => {
        if (
          values.some(x => x == false)
        ) {
          this.$toast.open({
            message: this.$t('globals.errors.formNotValid'),
            type: 'is-warning',
            position: 'is-bottom',
          });
          return;
        }
        this.startLoading();
        this.$http
          .patch(`/v1/videos/${this.id}`, this.getPayload())
          .then(() => {
            this.$toast.open({
              message: '<i class="fas fa-check"></i>&nbsp;Your video has been edited',
              type: 'is-success',
            });
            this.$router.push({ name: 'adminCreatingNetworksTvList' });
          })
          .catch((err) => {
            console.error(err);
            if (err.response && err.response.data) this.$toast.open(err.response.data.message);
          })
          .finally(() => {
            this.stopLoading();
          });
      }).catch((err) => {
        console.error(err);
        this.$toast.open(this.$t('globals.errors.unexpected'));
      });
    },
  },
};
</script>

<style>
</style>
