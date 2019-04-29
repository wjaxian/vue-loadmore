const serve = process.env.NODE_ENV === 'production'
module.exports = {
	publicPath: '/',
	filenameHashing: true,
	//index.html 相关配置
	pages: {
		index: {
			entry: 'src/main.js',
			template: 'public/index.html',
			filename: 'index.html',
			title: '首页',
			chunks: ['chunk-vendors', 'chunk-common', 'index']
		}
	},
	//webpack loader配置
	chainWebpack: config => {
		//将小于 4kb 的资源内联，以减少 HTTP 请求的数量
		config.module
      .rule('images')
        .use('url-loader')
          .loader('url-loader')
          .tap(options => Object.assign(options, { limit: 10240 }))
	},

	// eslint-loader 是否在保存的时候检查
	lintOnSave: true,

	// 是否使用包含运行时编译器的Vue核心的构建
	runtimeCompiler: false,

	// 默认情况下 babel-loader 忽略其中的所有文件 node_modules
	transpileDependencies: [],

	// 生产环境 sourceMap
	productionSourceMap: serve,

	// 配置高于chainWebpack中关于 css loader 的配置
	css: {
		// 是否开启支持 foo.module.css 样式
		modules: false,

		// 是否使用 css 分离插件 ExtractTextPlugin，采用独立样式文件载入，不采用 <style> 方式内联至 html 文件中
		extract: serve,

		// 是否构建样式地图，false 将提高构建速度
		sourceMap: false,

		// css预设器配置项
		loaderOptions: {
			css: {
				
			},
			// `
			// 	@import "@/scss/_variables.scss";
			// 	@import "@/scss/_mixins.scss";
			// `
			sass: {
				// data: `
				// 	@import "./src/assets/style/_variables.scss";
				// `
			},

			postcss: {
			// options here will be passed to postcss-loader
			}
		}
	},
	devServer: {
		open: true,
		host: '127.0.0.1',
		port: 8080,
		https: false,
		hotOnly: false,
		proxy: null
	},
	// 构建时开启多进程处理 babel 编译
	parallel: require('os').cpus().length > 1,

	// https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
	pwa: {},

	// 第三方插件配置
	pluginOptions: {},

	//webpack配置
	configureWebpack: {
		resolve: {
			alias: {
				'vue$': 'vue/dist/vue.esm.js' 
			}
		}
	}
}