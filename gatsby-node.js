// var ExtractTextPlugin = require("extract-text-webpack-plugin")

exports.modifyWebpackConfig = function(config, env) {
  console.log('gatsby env: ', env);
  
  config.loader('stylus', function(cfg) {
    cfg.test = /\.styl$/;
    // if ('develop' !== env) {
    //   cfg.loader = ExtractTextPlugin.extract("css?-url&minimize!stylus");
    // } else {
    cfg.loader = 'style!css?-url!stylus-relative';
    // }
    return cfg;
  });

  config.loader('png', function(cfg) {
    cfg.test = /\.png$/;
    cfg.loader = 'file';
    return cfg;
  });

  config.loader('jpg', function(cfg) {
    cfg.test = /\.jpg$/;
    cfg.loader = 'file';
    return cfg;
  });

  // if ('develop' !== env) {
  //   config.plugin('extract-css', ExtractTextPlugin, ['styles.css', { allChunks: true }]);
  // }

  return config;
};



