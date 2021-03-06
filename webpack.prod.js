const path = require('path');

const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin'); //installed via npm
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
//const EncodingPlugin = require('webpack-encoding-plugin');

const buildPath = path.resolve(__dirname, 'production');

module.exports = {
   devtool: 'source-map',
   entry: './src/index.js',
   output: {
      filename: '[name].[hash:20].js',
      path: buildPath,
      publicPath: '/static/campanas/cierrapuertas/evento/2019/mayo/home/'
   },
   node: {
      fs: 'empty'
   },
   module: {
      rules: [
         {
            test: /\.js$/,
            exclude: [/node_modules/,/node_modules\/(?!(swiper|dom7)\/).*/, /src\/js\//],
            loader: 'babel-loader',

            options: {
               presets: ['env']
            }
         },
         {
            test: /\.(scss|css|sass)$/,
            use: [
               {
                  loader: MiniCssExtractPlugin.loader
               },
               {
                  // translates CSS into CommonJS
                  loader: 'css-loader',
                  options: {
                     sourceMap: true
                  }
               },
               {
                  // Runs compiled CSS through postcss for vendor prefixing
                  loader: 'postcss-loader',
                  options: {
                     sourceMap: true
                  }
               },
               {
                  // compiles Sass to CSS
                  loader: 'sass-loader',
                  options: {
                     outputStyle: 'expanded',
                     sourceMap: true,
                     sourceMapContents: true
                  }
               }
            ]
         },
         {
            // Load all images as base64 encoding if they are smaller than 8192 bytes
            test: /\.(png|jpg|gif|svg)$/,
            use: [
               {
                  loader: 'url-loader',
                  options: {
                     name: '[name].[hash:20].[ext]',
                     limit: 8192
                  }
               }
            ]
         }
      ]
   },
   plugins: [
      new HtmlWebpackPlugin({
         template: './header-prod.html',
         filename: 'sections/section-header.html',
         inject: false,
      }),
      new HtmlWebpackPlugin({
         template: './src/html/layouts/section-intro.html',
         filename: 'sections/section-intro.html',
         inject: false
      }),
      new HtmlWebpackPlugin({
         template: './src/html/layouts/section-latest-products.html',
         filename: 'sections/section-latest-products.html',
         inject: false
      }),
      new HtmlWebpackPlugin({
         template: './src/html/layouts/section-product-panel.html',
         filename: 'sections/section-product-panel.html',
         inject: false
      }),
      new HtmlWebpackPlugin({
         template: './src/html/layouts/section-daily-deals.html',
         filename: 'sections/section-daily-deals.html',
         inject: false
      }),
      new HtmlWebpackPlugin({
         template: './src/html/layouts/section-promotions.html',
         filename: 'sections/section-promotions.html',
         inject: false
      }),
      new HtmlWebpackPlugin({
         template: './src/html/layouts/section-news.html',
         filename: 'sections/section-news.html',
         inject: false
      }),
      new HtmlWebpackPlugin({
         template: './src/html/layouts/section-others.html',
         filename: 'sections/section-others.html',
         inject: false
      }),
      new HtmlWebpackPlugin({
         template: './src/html/layouts/section-our-brands.html',
         filename: 'sections/section-our-brands.html',
         inject: false
      }),
      new HtmlWebpackPlugin({
         template: './src/html/layouts/section-our-benefits.html',
         filename: 'sections/section-our-benefits.html',
         inject: false
      }),
      new HtmlWebpackPlugin({
         template: './footer-prod.html',
         filename: 'sections/section-footer.html',
         inject: false,
      }),
      new CleanWebpackPlugin(buildPath),
      /*        new FaviconsWebpackPlugin({
          // Your source logo
          logo: './src/assets/icon.png',
          // The prefix for all image files (might be a folder or a name)
          prefix: 'icons-[hash]/',
          // Generate a cache file with control hashes and
          // don't rebuild the favicons until those hashes change
          persistentCache: true,
          // Inject the html into the html-webpack-plugin
          inject: true,
          // favicon background color (see https://github.com/haydenbleasel/favicons#usage)
          background: '#fff',
          // favicon app title (see https://github.com/haydenbleasel/favicons#usage)
          title: 'registration-contest}}',

          // which icons should be generated (see https://github.com/haydenbleasel/favicons#usage)
          icons: {
              android: true,
              appleIcon: true,
              appleStartup: true,
              coast: false,
              favicons: true,
              firefox: true,
              opengraph: false,
              twitter: false,
              yandex: false,
              windows: false
          }
      }), */
      new MiniCssExtractPlugin({
         filename: 'styles.[contenthash].css'
      }),
      new OptimizeCssAssetsPlugin({
         cssProcessor: require('cssnano'),
         cssProcessorOptions: {
            map: {
               inline: false,
            },
            discardComments: {
               removeAll: true
            }
         },
         canPrint: true
      }),
   ]
};
