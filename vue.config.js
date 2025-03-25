const { defineConfig } = require('@vue/cli-service');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all',
        maxSize: 244 * 1024,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      }
    },
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: process.env.ANALYZE ? 'server' : 'disabled',
        openAnalyzer: false
      })
    ]
  },
  pwa: {
    name: 'Pasteles de Gaby',
    themeColor: '#F7F0F0',
    msTileColor: '#F7F0F0',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    mobileWebAppCapable: 'yes',
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: './src/service-worker.js',
      swDest: 'service-worker.js',
      exclude: [
        /\.map$/,
        /_redirects/,
        /_headers/,
        /\.hot-update\.js$/,
        /^manifest.*\.js$/
      ],
      include: [
        /\.html$/,
        /\.js$/,
        /\.css$/,
        /manifest\.json$/,
        /\.(png|jpe?g|gif|webp|ico|svg)$/, // Añade svg aquí
        /\.(woff2?|eot|ttf|otf)$/
      ]
    }
  },
  chainWebpack: config => {
    // Elimina la configuración específica para SVG
    // Esto dejará que webpack maneje los SVG por defecto
    
    config.plugin('eslint').tap(args => {
      args[0].fix = true;
      return args;
    });
  }
});