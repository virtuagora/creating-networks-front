<template>
  <router-link :to="theLink" class="button is-outlined is-white is-small is-800" v-if="!isLoading && (showAdminEdit || showUserEdit)">
    <i class="fas fa-pencil-alt fa-lg fa-fw"></i>&nbsp; E D I T
  </router-link>
</template>

<script>
export default {
  props: ['initiative'],
  data(){
    return {
      isLoading: true,
      showUserEdit: false,
      showAdminEdit: false,
      owners: []
    }
  },
  mounted: function(){
    if(!this.user) return
    if(this.isAdmin) {
      this.showAdminEdit = true
      this.isLoading = false
    } else {
      this.getOwners()
    }
  },
  methods: {
    getOwners: function(){
      this.$http
        .get(`/v1/initiatives/${this.initiative}/members`, {
          params: {
            offset: 0,
            size: 100,
            relation: 'owner'
          },
        })
        .then( res => {
          this.owners = res.data.data.map( u => u.id )
          if(this.owners.includes(this.user.id)) {
            this.showUserEdit = true
          }
        }).catch(() => {
          return
        })
        .finally( () => {
          this.isLoading = false
        })
    }
  },
  computed: {
    theLink: function(){
      if(this.showAdminEdit) return {name: 'adminInitiativesEdit', params: {id: this.initiative}}
      if(this.showUserEdit) return {name: 'userInitiativesEdit', params: {id: this.initiative}}
      return {name: 'home'}
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>