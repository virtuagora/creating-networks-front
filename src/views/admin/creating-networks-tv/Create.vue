<template>
  <section>
    <h1 class="title is-3">Add video</h1>
    <p>Add a new video to Creating Networks TV</p>
    <br>
    <div class="card">
      <div class="card-content">
        <VideoForm ref="data" :model.sync="model" @submit="submit" />
      </div>
    </div>
  </section>
</template>


<script>
import VideoForm from '@/components/utils/videos/VideoForm.vue';

export default {
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
    };
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
          .post('/v1/videos', this.getPayload())
          .then(() => {
            this.$toast.open({
              message: '<i class="fas fa-check"></i>&nbsp;New video has been added to Creating Networks TV!',
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
        this.$toast.open(err.response.data.message);
      });
    },
  },
};
</script>

<style>
</style>
