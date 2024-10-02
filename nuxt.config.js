export default {
  // Global page headers
  head: {
    title: 'News',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS
  css: [
    'bootstrap/dist/css/bootstrap.css', // Include Bootstrap CSS
    '@/assets/css/main.css' // Path to your custom CSS file
  ],
  

  // Plugins to run before rendering page
  plugins: [
    // Add your plugins here, if any
  ],

  // Auto import components
  components: true,

  // Modules for dev and build (recommended)
  buildModules: [
    // Add any build modules here, if needed
  ],

  // Modules
  modules: [
    '@nuxtjs/axios', // Axios module for making HTTP requests
    'bootstrap-vue/nuxt', // Bootstrap Vue module for styling
  ],

  // Axios module configuration
  axios: {
    baseURL: 'https://blog.tourismofkashmir.com/apis' // Base URL for your API
  },

  // Custom routing
  router: {
    extendRoutes(routes, resolve) {
      routes.push({
        name: 'post',
        path: '/:category_slug/:slug',
        component: resolve(__dirname, 'pages/[category_slug]/[slug].vue')
      });
    }
  },
  layoutTransition: {
    name: 'fade',
    mode: 'out-in'
  },

  // Build Configuration
  build: {
    buildDir: 'dist', 
  }
}
