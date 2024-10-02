<template>
  <div>
    <h1 v-if="post.title">{{ post.title }}</h1>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <img v-if="post.image" :src="post.image" alt="Post Image" class="post-image" />
      <p v-if="post.meta_description">{{ post.meta_description }}</p>
      <div v-html="post.content"></div> <!-- Assuming content is in HTML format -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      post: {},
      loading: true,
      error: null,
    };
  },
  async mounted() {
    await this.fetchPost();
  },
  methods: {
    async fetchPost() {
      this.loading = true;
      this.error = null; // Reset error before fetching
      const postSlug = this.$route.params.slug; // Get slug from route parameters

      try {
        const response = await this.$axios.$get(`https://blog.tourismofkashmir.com/apis?post_slug=${postSlug}`);
        console.log('Post Response:', response); // Log the entire response

        // Assign the post directly from the response object
        if (response) {
          this.post = response; // Use the post directly
        } else {
          this.error = 'Post not found.';
        }
      } catch (err) {
        this.error = 'Failed to load post.';
        console.error('Error fetching post:', err); // Debug error
      } finally {
        this.loading = false;
        console.log('Loading complete.'); // Debug line
      }
    },
  },
  head() {
    return {
      title: this.post.title || 'Default Title',
      meta: [
        { hid: 'og:title', property: 'og:title', content: this.post.title || 'Default Title' },
        { hid: 'og:description', property: 'og:description', content: this.post.meta_description || 'Default description' },
        { hid: 'og:image', property: 'og:image', content: this.post.image || 'default-image-url.jpg' },
        { hid: 'og:url', property: 'og:url', content: this.$route.fullPath },
        { hid: 'og:type', property: 'og:type', content: 'article' },
      ],
    };
  },
};
</script>

<style>
.post-image {
  max-width: 100%;
  height: auto;
}
</style>
