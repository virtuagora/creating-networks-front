<template>
  <nav class="pagination is-small" role="navigation" aria-label="pagination">
    <a :disabled="disablePrevious" @click="fetchPrevious" class="pagination-previous">Previous</a>
    <a :disabled="disableNextPage" @click="fetchNext" class="pagination-next">Next page</a>
    <ul class="pagination-list">
      <li v-if="!isLoading">
      <a class="pagination-ellipsis">Page {{this.currentPage}} of {{this.totalPages}}</a>
      </li>
      <!-- <li>
        <a class="pagination-link" aria-label="Goto page 1">1</a>
      </li>
      <li>
        <span class="pagination-ellipsis">&hellip;</span>
      </li>
      <li>
        <a class="pagination-link" aria-label="Goto page 45">45</a>
      </li>
      <li>
        <a class="pagination-link is-current" aria-label="Page 46" aria-current="page">46</a>
      </li>
      <li>
        <a class="pagination-link" aria-label="Goto page 47">47</a>
      </li>
      <li>
        <span class="pagination-ellipsis">&hellip;</span>
      </li>
      <li>
        <a class="pagination-link" aria-label="Goto page 86">86</a>
      </li> -->
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    resourceUrl: {
      type: String,
      required: true,
    },
    query: {
      type: Object,
      required: false,
    },
    fetching: Boolean,
  },
  data() {
    return {
      defaultQuery: {
        size: 10,
      },
      pagination: {
        offset: null,
        size: null,
        total: 0,
      },
      links: null,
      isLoading: false,
    };
  },
  created() {
    this.getResource();
  },
  methods: {
    getResource() {
      this.isLoading = true;
      this.startLoading();
      this.$emit('update:fetching', true);
      let url = this.resourceUrl;
      if (this.queryString) {
        url = `${url}?${this.queryString}`;
      }
      console.log(this.query);
      console.log(url);
      this.$http
        .get(url)
        .then((res) => {
          this.updatePagination(res.data.pagination, res.data.links);
          this.$emit('update', res.data.data);
        })
        .finally(() => {
          this.isLoading = false;
          this.stopLoading();
          this.$emit('update:fetching', false);
        });
    },
    updatePagination(pagination, links) {
      this.pagination = pagination;
      this.links = links;
    },
    fetchNext() {
      // eslint-disable-next-line no-useless-escape
      const url = this.links.next.replace(/^.*\/\/[^\/]+/, '');
      this.startLoading();
      this.$emit('update:fetching', true);
      this.$http.get(url)
        .then((res) => {
          this.updatePagination(res.data.pagination, res.data.links);
          this.$emit('update', res.data.data);
        })
        .finally(() => {
          this.stopLoading();
          this.$emit('update:fetching', false);
        });
    },
    fetchPrevious() {
      // eslint-disable-next-line no-useless-escape
      const url = this.links.prev.replace(/^.*\/\/[^\/]+/, '');
      this.startLoading();
      this.$emit('update:fetching', true);
      this.$http.get(url)
        .then((res) => {
          this.updatePagination(res.data.pagination, res.data.links);
          this.$emit('update', res.data.data);
        })
        .finally(() => {
          this.stopLoading();
          this.$emit('update:fetching', false);
        });
    },
  },
  computed: {
    queryString() {
      let theQuery = this.defaultQuery;
      if (!this.isEmptyObject(this.query)) {
        theQuery = Object.assign(theQuery, this.query);
      }
      return Object.keys(theQuery)
        .map(key => `${key}=${theQuery[key]}`)
        .join('&');
    },
    disableNextPage() {
      if (this.links && this.links.next) {
        return false;
      }
      return true;
    },
    disablePrevious() {
      if (this.links && this.links.prev) {
        return false;
      }
      return true;
    },
    currentPage() {
      return ((this.pagination.offset / this.pagination.size) + 1);
    },
    totalPages() {
      if (this.pagination.total % this.pagination.size) {
        return Math.floor(this.pagination.total / this.pagination.size) + 1;
      }
      if (this.pagination.total == 0) return 1;
      return (this.pagination.total / this.pagination.size);
    },
  },
};
</script>

<style>
</style>
