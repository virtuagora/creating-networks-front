module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "~bulma/sass/utilities/initial-variables.sass";
        @import "~bulma/sass/utilities/mixins.sass";`
       
      },
    },
  },
  pages: {
    index: {
      // entry for the page
      entry: 'src/main.js',
      // the source template
      template: 'public/index.html',
      // output as dist/index.html
      filename: 'index.html',
      // when using title option,
      // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
      title_en: 'Creating Networks',
      // chunks to include on this page, by default includes
      // extracted common chunks and vendor chunks.
      chunks: ['chunk-vendors', 'chunk-common', 'index'],
    },
    es: {
      entry: 'src/main.js',
      template: 'public/es/index.html',
      filename: 'es/index.html',
      title_es: 'Creando Redes',
      chunks: ['chunk-vendors', 'chunk-common', 'index'],
    },
    pt: {
      entry: 'src/main.js',
      template: 'public/pt/index.html',
      filename: 'pt/index.html',
      title_pt: 'Creando Redes',
      chunks: ['chunk-vendors', 'chunk-common', 'index'],
    },
    // when using the entry-only string format,
    // template is inferred to be `public/subpage.html`
    // and falls back to `public/index.html` if not found.
    // Output filename is inferred to be `subpage.html`.
    // subpage: 'src/subpage/main.js',
  },
  devServer: {
    // disableHostCheck: true,
    // proxy: 'http://192.168.0.114:8123',
  },
};
