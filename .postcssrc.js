// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  'plugins': {
    'postcss-import': {
      resolve: function(id, basedir, importOptions) {
        if (id.match(/@pages/) && id.match(/@pages/).index === 0) {
          return path.join(_dirname, 'static/css', id.substr[6]);
        }
        return id
      }
    },
    'postcss-url': {},
    // to edit target browsers: use "browserslist" field in package.json
    'autoprefixer': {}
  }
}
