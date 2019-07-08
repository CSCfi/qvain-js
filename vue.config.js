/* ADD_LICENSE_HEADER */
const path = require('path')
const child_process = require('child_process')

module.exports = {
	publicPath: process.env.VUE_APP_PUBLIC_PATH,
	lintOnSave: false,
	assetsDir: "static",
	chainWebpack: config => {
		// make sure BABEL_ENV is set to whatever NODE_ENV is set to in .env files
		if (process.env.BABEL_ENV !== process.env.NODE_ENV) {
			process.env.BABEL_ENV = process.env.NODE_ENV
		}

		// set global vars
		config
			.plugin('define')
			.tap(args => {
				Object.assign(args[0], {
					APP_DEBUG: JSON.stringify('zork'),
				})
				Object.assign(args[0]['process.env'], {
					VUE_APP_MODE: JSON.stringify(process.env.VUE_CLI_MODE || process.env.NODE_ENV),
					VUE_APP_VERSION: JSON.stringify(require('./package.json').version),
					VUE_APP_COMMIT_HASH: JSON.stringify((()=>{
						try {
							return child_process.execSync('git rev-parse HEAD').toString().trim()
						} catch (e) {
							return "undefined"
						}
					})()),
				})
				return args
			})

		// ignore old code in src/Attic/
		config
			.module
			.rule('attic')
			.exclude
			.add(path.resolve(__dirname, 'src', 'Attic'))
			.end()

		// vue-cli minifies html by default for production; don't
		if (process.env.NODE_ENV === 'production') {
			config
				.plugin('html')
				.tap(([options]) => [Object.assign(options, {
					minify: {
						removeComments: true,
						collapseWhitespace: false,
						conservativeCollapse: false,
						preserveLineBreaks: true,
						removeAttributeQuotes: false,
					},
				})])
		}

		// configure public address for dev server so hot reloading can work with a proxy
		if (process.env.APP_HOSTNAME) {
			config.devServer.public(process.env.APP_HOSTNAME)
		}

		// watch needs to be in poll mode for it to work properly in Vagrant
		// set watch options for dev server mode (e.g. npm run serve)
		config.devServer.watchOptions({
			poll: 1500,
			ignored: [/node_modules/],
		})

		// set watch options for build mode with watch enabled (e.g. npm run watch)
		config.watchOptions({
			poll: 1500,
			ignored: [/node_modules/],
		})
	},
	css: {
		loaderOptions: {
			sass: {
				data: `
					@import "@/assets/css/_variables.scss";
				`,
			},
		},
	},
}
