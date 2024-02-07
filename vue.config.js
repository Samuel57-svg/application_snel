const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: config => {
    config.plugin('define').tap(definitions => {
      definitions[0]['__VUE_PROD_DEVTOOLS__'] = false;
      definitions[0]['__VUE_OPTIONS_API__'] = true;
      return definitions;
    });
  }
});
