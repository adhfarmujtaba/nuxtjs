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
    // '@nuxtjs/tailwindcss' // Example: Tailwind CSS module
  ],

  // Modules
  modules: [
    '@nuxtjs/axios', // Axios module for making HTTP requests
    '@nuxtjs/pwa', // PWA module for a better mobile experience
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
    buildDir: 'dist/.nuxt', // Specify a directory for built files
    // Add any additional build configurations here
  },

  // Target Configuration
  target: 'static', // Use 'server' if you prefer server-side rendering

  // Generate configuration for static sites
  generate: {
    dir: 'dist' // Specify the output directory for static site generation
  },

  // PWA configuration (if using PWA module)
  pwa: {
    manifest: {
      name: 'News App',
      short_name: 'News',
      lang: 'en',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#4DBA87',
      icons: [
        {
          src: 'icon.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    }
  }
}
