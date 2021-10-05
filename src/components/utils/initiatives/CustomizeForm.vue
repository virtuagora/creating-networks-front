<template>
  <section>
    <h1 class="title is-3 has-text-dark">Customize your page</h1>
    <p>Here you can customize the page of your initiative. Add a logo, or a cover picture.</p>
    <br />
    <div class="columns">
      <div class="column">
        <div class="box has-text-black has-text-centered">
          <div v-if="model.subject.img_type == 2" >
          <img :src="`${makeUserAvatar(model.subject)}?${timestamp}`" class="image showPicture is-centered" alt="">
          <button @click="removePicture('avatar')" class="button is-small is-danger is-outlined">
            <i class="fas fa-times"></i>&nbsp;Remove
          </button>
          <hr>
          </div>
          <p class="is-size-4">Submit a logo</p>
          <p>You can upload a logo for your initiative page</p>
          <br />
          <b-field class="file is-centered" v-if="!fileAvatar">
            <b-upload v-model="fileAvatar" drag-drop>
              <section class="section">
                <div class="content has-text-centered">
                  <p>
                    <i class="fas fa-upload fa-2x"></i>
                  </p>
                  <p>Drop your file here or click to upload</p>
                </div>
              </section>
            </b-upload>
          </b-field>
          <div class v-else>
            <p>
              <i class="fas fa-file fa-2x"></i>
            </p>
            <p class="is-size-7 has-text-centered">
              {{ fileAvatar.name }}
              <a @click="fileAvatar = null">
                <i class="fas fa-times-circle fa-lg has-text-danger"></i>
              </a>
            </p>
            <br />
            <button @click="uploadFile('avatar')" class="button is-primary is-small">
              <i class="fas fa-upload"></i> Upload file
            </button>
          </div>
        </div>
      </div>
      <div class="column has-text-centered">
        <div class="box has-text-black">
          <div v-if="model.pictures && model.pictures.cover" >

          <img :src="`${apiUrl}/${model.pictures.cover.path}?${timestamp}`" class="image showPicture is-centered" alt="">
          <button @click="removePicture('cover')" class="button is-small is-danger is-outlined">
            <i class="fas fa-times"></i>&nbsp;Remove
          </button>
          <hr>
          </div>
          <p class="is-size-4">Add a picture cover</p>
          <p>You can upload a cover for your initiative page</p>
          <br />
          <b-field class="file is-centered" v-if="!fileCover">
            <b-upload v-model="fileCover" drag-drop>
              <section class="section">
                <div class="content has-text-centered">
                  <p>
                    <i class="fas fa-upload fa-2x"></i>
                  </p>
                  <p>Drop your file here or click to upload</p>
                </div>
              </section>
            </b-upload>
          </b-field>
            <div class v-else>
            <p>
              <i class="fas fa-file fa-2x"></i>
            </p>
            <p class="is-size-7 has-text-centered">
              {{ fileCover.name }}
              <a @click="fileCover = null">
                <i class="fas fa-times-circle fa-lg has-text-danger"></i>
              </a>
            </p>
            <br />
            <button @click="uploadFile('cover')" class="button is-primary is-small">
              <i class="fas fa-upload"></i> Upload file
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
// import PaginationBar from "@/components/utils/PaginationBar";
// import EmptyTable from "@/components/utils/EmptyTable";
// import axios from 'axios'

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
    // PaginationBar,
    // EmptyTable
  },
  data() {
    return {
      fileAvatar: null,
      fileCover: null,
      hasAvatar: false,
      timestamp: Math.round((new Date()).getTime() / 1000)
    };
  },
  mounted() {
  },
  methods: {
    uploadFile(type){
      this.startLoading()
      let theFile = null
      let theUrl = null
      switch(type){
        case 'avatar':
          theFile = this.fileAvatar
          theUrl = `/v1/subjects/${this.model.subject.id}/picture`
          break;
        case 'cover':
          theFile = this.fileCover
          theUrl = `/v1/initiatives/${this.id}/pictures/cover`
          break;
        default:
          return
      }
      this.$http.put(theUrl,
      theFile,
      {
        headers: {
          'content-type': theFile.type
        }
      })
      .then(() => {
        this.$toast.open({
            message:
              '<i class="fas fa-check"></i>&nbsp;Picture was successfully loaded!',
            type: "is-success"
          });
        this.$emit('updateModel')
        this.fileAvatar = this.fileCover = null
        this.timestamp = this.getTimestamp()
      }).catch(err => {
        console.error(err)
        this.$toast.open({
            message:
              '<i class="fas fa-times"></i>&nbsp;There was an error while uploading your picture',
            type: "is-danger"
          });
      }).finally(() => {
        this.stopLoading()
      })
    },
    removePicture(type){
      let theUrl = null
      this.startLoading()
      switch(type){
        case 'avatar':
          theUrl = `/v1/subjects/${this.model.subject.id}/picture`
          break;
        case 'cover':
          theUrl = `/v1/initiatives/${this.id}/pictures/cover`
          break;
        default:
          return
      }
      this.$http.delete(theUrl)
        .then(() => {
          this.$emit('updateModel')
          this.$toast.open({
            message:
              '<i class="fas fa-check"></i>&nbsp;Picture was successfully deleted!',
            type: "is-success"
          });
        })
        .catch(err => {
          console.error(err)
          this.$toast.open({
            message:
              '<i class="fas fa-times"></i>&nbsp;There was an error while deleting the picture',
            type: "is-danger"
          });
        }).finally(() => {
          this.stopLoading()
        })
    }
  },
  computed: {
    query() {
      return {};
    }
  }
};
</script>

<style lang="scss" scoped>
.showPicture{
  max-height: 128px;
  margin-bottom: 10px;
}
</style>