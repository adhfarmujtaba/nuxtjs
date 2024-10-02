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
.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #3b82f6; /* Customize spinner color */
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>


  
  <style>
  body {
    font-family: Arial, sans-serif;
    background-color: #f5f5f5;
    margin: 0;
    padding: 0;
    transition: background-color 0.3s ease;
    }
    
    :root {
    --background-color: #f5f5f5;
    --card-background-color: #fff;
    --text-color: #333;
    --paragraph-color: #666;
    --box-shadow-color: rgba(0, 0, 0, 0.2);
    }
    
    @media (prefers-color-scheme: dark) {
    :root {
    --background-color:#2c2c2c;
    --card-background-color: #333;
    --text-color: #ccc;
    --paragraph-color: #aaa;
    --box-shadow-color: rgba(255, 255, 255, 0.1);
    }
    
    body {
    background-color: var(--background-color);
    }
    
    .card {
    background-color: var(--card-background-color);
    box-shadow: 0 4px 8px var(--box-shadow-color);
    }
    
    .card-content h2, .card-content p {
    color: var(--text-color);
    }
    
    .card-content p {
    color: var(--paragraph-color);
    }
    }
    
    .container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  padding: 0;
    }
    
    .card {
    background-color: var(--card-background-color);
    margin-bottom: 4px;
    width: 100%;
    
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px var(--box-shadow-color);
    }
    
    .card img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    }
    
    .card-content {
    padding: 10px;

    }
    
    .card-content h2 {
    font-size: 0.8rem;
    margin-bottom: 5px;
    color: var(--text-color);
    }
    
    .card-content p {
    font-size: 0.7rem;
    color: var(--paragraph-color);
    line-height: 1.2;
    margin-bottom: 7px;
    }
    
    .avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 5px;
    margin-left: 4px;
    }
    
    /* Skeleton Loading Styles */
    .skeleton-container {
    /* margin-top:50px; */
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    }
    .skeleton-card {
    background-color: #fff;
    margin-bottom: 5px;
    width: 100%;
    overflow: hidden;
    animation: skeleton-loading 1s infinite;
    }
    @keyframes skeleton-loading {
    0% { opacity: 0.6; }
    50% { opacity: 0.8; }
    100% { opacity: 0.6; }
    }
    .skeleton-image {
    width: 100%;
    height: 180px;
    background-color: #ccc;
    }
    .skeleton-title {
    width: 80%;
    height: 15px;
    background-color: #ccc;
    margin-bottom: 5px;
    }
    .skeleton-content {
    width: 100%;
    height: 50px;
    background-color: #ccc;
    margin-bottom: 5px;
    }
    .skeleton-category {
    width: 50%;
    height: 15px;
    background-color: #ccc;
    }
    .skeleton-avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #ccc;
    margin-right: 5px;
    }
    .skeleton-username {
    width: 80px;
    height: 15px;
    background-color: #ccc;
    }
    
    
    .skeleton-date {
    width: 80px;
    height: 10px;
    background-color: #ccc;
    margin-left: auto; /* Pushes the skeleton date to the right side */
    }
    
    .loader {
    display:none;
    position: relative;
    bottom: 10px;
    
    z-index: 9999;
    width: 100%;
    height: 40px; /* Adjust the height as needed */
    
    justify-content: center;
    align-items: center;
    z-index: 9999;
    }
    
    .loader-inner {
    left: 50%;
    transform: translateX(-50%);
    font-size: 38px;
    position: relative;
    
    width: 1em;
    height: 1em;
    }
    
    .loader-blade {
    
    position: absolute;
    left: 0.4629em;
    bottom: 0;
    width: 0.074em;
    height: 0.2777em;
    border-radius: 0.0555em;
    background-color: transparent;
    transform-origin: center -0.2222em;
    animation: loader-fade 1s infinite linear;
    }
    
    .loader-blade:nth-child(1) {
    animation-delay: 0s;
    transform: rotate(0deg);
    }
    
    .loader-blade:nth-child(2) {
    animation-delay: 0.083s;
    transform: rotate(30deg);
    }
    
    .loader-blade:nth-child(3) {
    animation-delay: 0.166s;
    transform: rotate(60deg);
    }
    
    .loader-blade:nth-child(4) {
    animation-delay: 0.249s;
    transform: rotate(90deg);
    }
    
    .loader-blade:nth-child(5) {
    animation-delay: 0.332s;
    transform: rotate(120deg);
    }
    
    .loader-blade:nth-child(6) {
    animation-delay: 0.415s;
    transform: rotate(150deg);
    }
    
    .loader-blade:nth-child(7) {
    animation-delay: 0.498s;
    transform: rotate(180deg);
    }
    
    .loader-blade:nth-child(8) {
    animation-delay: 0.581s;
    transform: rotate(210deg);
    }
    
    .loader-blade:nth-child(9) {
    animation-delay: 0.664s;
    transform: rotate(240deg);
    }
    
    .loader-blade:nth-child(10) {
    animation-delay: 0.747s;
    transform: rotate(270deg);
    }
    
    .loader-blade:nth-child(11) {
    animation-delay: 0.83s;
    transform: rotate(300deg);
    }
    
    .loader-blade:nth-child(12) {
    animation-delay: 0.913s;
    transform: rotate(330deg);
    }
    
    @keyframes loader-fade {
    0% {
    background-color: #69717d;
    }
    100% {
    background-color: transparent;
    }
    }
    
    
    .sticky-ads {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    min-height: 70px;
    max-height: 200px;
    padding: 5px 0;
    box-shadow: 0 -6px 18px 0 rgba(9,32,76,.1);
    -webkit-transition: all .1s ease-in;
    transition: all .1s ease-in;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 20;
    }
    
    .sticky-ads-close {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px 0 0;
    position: absolute;
    right: 0;
    top: -30px;
    background-color: rgba(0, 0, 0, 0.5);
    box-shadow: 0 -6px 18px 0 rgba(9,32,76,.08);
    }
    
    .sticky-ads .sticky-ads-close svg {
    width: 22px;
    height: 22px;
    fill: #000;
    }
    
    .sticky-ads .sticky-ads-content {
    overflow: hidden;
    display: block;
    position: relative;
    height: 70px;
    width: 100%;
    margin-right: 10px;
    margin-left: 10px;
    }
    
    
    
    .user-link {
    text-decoration: none;
    color: inherit;
    }
    
    .username, .views, .date {
    color: #666;
    font-size: 15px;
    font-weight: 320;
    }
    
    .username {
    margin-right: 5px;
    }
    
    .views .symbol {
    font-size: 14px;
    font-weight: bold;
    }
    
    .date {
    margin-left: auto;
    font-size: 10px;
    margin-right: 5px;
    }
    
    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
    :root {
    --text-color-dark: #ccc;
    }
    
    .username, .views, .date {
    color: var(--text-color-dark);
    }
    }
    
    .cat-tag{
    margin-top:52px;
    }
    
    /* Media query for desktop devices with a minimum width of 768px */
    @media screen and (min-width: 768px) {
        /* Add your desktop-specific styles here */
        body {
            font-size: 16px; /* Adjust font size for desktop */
        }
        
        .container {
            margin-top:15px;
            display: flex;
    flex-wrap: wrap;
    justify-content: center;
        }
        
        .card  {
            width: calc(25% - 20px); /* Set card width for desktop (4 cards per row) */
            margin-bottom: 20px; /* Add margin between cards */
            background-color: #fff; /* Card background color */
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Add subtle box shadow for depth */
            transition: transform 0.3s ease, box-shadow 0.3s ease; /* Smooth transition */
            display: inline-block; /* Display cards inline */
            vertical-align: top; /* Align cards to the top */
            margin-right: 20px; /* Add margin to the right of each card */
            border-radius: 8px; /* Rounded corners for cards */
            overflow: hidden; /* Hide any content that exceeds the card boundaries */
        }
        
    
    }
    .news-item-link {
        text-decoration: none;
    }   

    /* .skeleton-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skeleton-card {
  background: #e0e0e0;
  border-radius: 5px;
  padding: 10px;
}

.skeleton-image {
  width: 100%;
  height: 180px;
  background: #c0c0c0;
  border-radius: 5px;
}

.skeleton-title, .skeleton-content, .skeleton-avatar, .skeleton-username, .skeleton-date {
  background: #c0c0c0;
  border-radius: 5px;
}

.skeleton-title {
  height: 20px;
  width: 80%;
}

.skeleton-content {
  height: 15px;
  width: 100%;
}

.skeleton-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.skeleton-username {
  height: 15px;
  width: 50%;
  margin-left: 10px;
}

.skeleton-date {
  height: 15px;
  width: 30%;
  margin-left: 10px;
}

.infinite-scroll-loader {
  width: 50px;
  height: 50px;
} */

.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #007bff; /* Bootstrap primary color */
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
  </style>
  