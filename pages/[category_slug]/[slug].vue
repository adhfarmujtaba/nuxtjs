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
  async asyncData({ params, $axios }) {
    const postSlug = params.slug; // Get slug from route parameters
    let post = {};
    let loading = true;
    let error = null;

    try {
      const response = await $axios.$get(`https://blog.tourismofkashmir.com/apis?post_slug=${postSlug}`);
      if (response) {
        post = response; // Assign the post directly from the response object
      } else {
        error = 'Post not found.';
      }
    } catch (err) {
      error = 'Failed to load post.';
      console.error('Error fetching post:', err); // Debug error
    } finally {
      loading = false; // Set loading to false after fetch
    }

    return { post, loading, error }; // Return the data
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


<style>
.post-image {
  max-width: 100%;
  height: auto;
}
</style>
