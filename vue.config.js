module.exports = {
  
  "transpileDependencies": [
    "vuetify"
  ],

  publicPath:'./',
  outputDir:'dist',
  assetsDir:'static2',
  indexPath:'debug.html',

  devServer:{
    port:8090,
    proxy:{
      '/gateway':{
        target:"http://127.0.0.1:8600/",
        changeOrigin:true,
        pathRewrite:{
          '^/gateway':'http://127.0.0.1:8600/'
        }
      },
      '/service':{
        target:"https://127.0.0.1:8501/",
        changeOrigin:true,
        pathRewrite:{
          '^/service':'https://127.0.0.1:8501'
        }
      }

    }
  }
}