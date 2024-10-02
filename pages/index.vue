<template>
  <div @scroll="onScroll" style="overflow-y: auto; height: 100vh;">
    <div v-if="initialLoading" class="skeleton-container">
      <div v-for="index in 10" :key="index" class="card skeleton-card">
        <div class="skeleton-image"></div>
        <div class="card-content">
          <div class="skeleton-title"></div>
          <div class="skeleton-content"></div>
          <div style="display: flex; align-items: center;">
            <div class="skeleton-avatar"></div>
            <div class="skeleton-username"></div>
            <div class="skeleton-date"></div>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <div v-if="posts.length === 0">No articles found.</div>
      <div v-for="post in posts" :key="post.id" class="post">
        <nuxt-link :to="`${post.category_slug}/${post.slug}/`" class="card-link">
          <div class="image-container" style="position: relative">
            <img
              :src="post.image"
              :alt="post.title"
              class="news-item-image"
              style="width: 100%; height: 180px; object-fit: cover"
            />
            <div
              style="position: absolute; bottom: 10px; right: 10px; background-color: rgba(0, 0, 0, 0.5); color: white; padding: 5px; border-radius: 5px; font-size: 0.8rem;"
            >
              {{ post.read_time }} min read
            </div>
          </div>
          <div class="card-content">
            <h2>{{ truncateText(post.title, 10) }}</h2>
            <p>{{ truncateText(post.meta_description, 20) }}</p>
          </div>
        </nuxt-link>
        <div style="display: flex; align-items: center; margin-bottom: 5px;">
          <nuxt-link :to="`/profile/${post.username}`" style="text-decoration: none; color: inherit; display: flex; align-items: center;">
            <img
              :src="`https://blog.tourismofkashmir.com/${post.avatar}`"
              alt="Avatar"
              class="avatar"
              style="width: 30px; height: 30px; border-radius: 50%; margin-right: 5px"
            />
            <span class="username">{{ post.username }}</span>
          </nuxt-link>
          <span class="views">. {{ formatViews(post.views) }} views</span>
          <span class="date">{{ formatDate(post.created_at) }}</span>
        </div>
      </div>
      <!-- Spinner Loader -->
      <div v-if="loadingMore" class="spinner-container">
        <div class="spinner"></div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  data() {
    return {
      posts: [],
      initialLoading: true, // Track initial loading state
      loadingMore: false,
      page: 1,
      error: null,
      hasMorePosts: true, // Track if there are more posts to load
    };
  },
  async mounted() {
    await this.fetchPosts();
    this.debouncedOnScroll = _.debounce(this.onScroll, 200); // Debounce scroll event
    window.addEventListener('scroll', this.debouncedOnScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.debouncedOnScroll);
  },
  methods: {
    async fetchPosts() {
      if (this.loadingMore) return; // Prevent multiple fetch calls

      this.loadingMore = true; // Show spinner during loading
      this.error = null; // Reset error before fetching
      try {
        const response = await this.$axios.$get(`https://blog.tourismofkashmir.com/apis?posts&page=${this.page}`);
        if (Array.isArray(response) && response.length > 0) {
          this.posts = [...this.posts, ...response];
        } else {
          this.hasMorePosts = false; // No more posts to load
          if (this.posts.length === 0) {
            this.error = 'No articles found.'; // Show error if there are no posts
          }
        }
      } catch (err) {
        this.error = 'Failed to load posts.';
      } finally {
        this.loadingMore = false;
        this.initialLoading = false; // End initial loading after fetching
      }
    },
    onScroll() {
      const scrollY = window.scrollY || window.pageYOffset; // Get current scroll position
      const windowHeight = window.innerHeight; // Get viewport height
      const documentHeight = document.documentElement.scrollHeight; // Get total height of the document

      // Load more posts if user is near the bottom of the page
      if (scrollY + windowHeight >= documentHeight - 50 && this.hasMorePosts && !this.loadingMore) {
        this.page++;
        this.fetchPosts();
      }
    },
    truncateText(text, maxWords) {
      const wordsArray = text.split(' ');
      return wordsArray.length > maxWords ? wordsArray.slice(0, maxWords).join(' ') + '...' : text;
    },
    formatViews(views) {
      if (views >= 10000000) return Math.floor(views / 10000000) + 'cr';
      if (views >= 1000000) return Math.floor(views / 1000000) + 'M';
      if (views >= 100000) return Math.floor(views / 100000) + 'L';
      if (views >= 1000) return Math.floor(views / 1000) + 'k';
      return views;
    },
    formatDate(date) {
      const currentDate = new Date();
      const postDate = new Date(date);
      const seconds = Math.floor((currentDate - postDate) / 1000);
      if (seconds < 60) return seconds + ' sec ago';
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return minutes + ' mins ago';
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return hours + ' hours ago';
      const days = Math.floor(hours / 24);
      if (days < 7) return days + ' days ago';
      const weeks = Math.floor(days / 7);
      return weeks < 4 ? weeks + ' weeks ago' : Math.floor(days / 30) + ' months ago';
    }
  }
};
</script>


<style>

  </style>
  