import { resolve } from 'path'
const path = require('path');
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import viteCompression from 'vite-plugin-compression'//开启gzip、br压缩
import babel from 'rollup-plugin-babel';

import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'

// 参考：https://cn.vitejs.dev/config/
export default defineConfig({
	base: './',
	resolve: {
		// 配置别名
		alias: {
			'@': resolve(__dirname, './src'),
			'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
		}
	},
	plugins: [
		vue(),
		vueSetupExtend(),
		Components({
			resolvers: [
				ElementPlusResolver({
					importStyle: 'sass'
				})
			]
		}),
		createSvgIconsPlugin({
			iconDirs: [resolve(__dirname, 'src/icons/svg')],
			symbolId: 'icon-[dir]-[name]'
		}),
		viteCompression({
			// 是否在控制台输出压缩结果
			verbose: true,
			// 是否禁用
			disable: false,
			// 体积大于 threshold 才会被压缩,单位 b
			threshold: 10240,
			// 压缩算法
			algorithm: 'gzip',
			// 生成的压缩包后缀
			ext: '.gz',
			// 压缩后是否删除源文件
			deleteOriginFile: false
		  }),
	],
	build: {
		target: 'es2015',
		outDir: path.resolve(__dirname, 'floor-21'),
		// 生产环境移除 console
		terserOptions: {
			compress: {
				drop_console: process.env.NODE_ENV === 'production' ? true : false,
				drop_debugger: process.env.NODE_ENV === 'production' ? true : false
			}
		},
		rollupOptions: {
			plugins: [
				babel({
					presets: ['@babel/preset-env'],
					// plugins: ['@babel/plugin-proposal-object-rest-spread', '@babel/plugin-transform-runtime'],
					// runtimeHelpers: true,
					exclude: 'node_modules/**' // 只编译我们的源代码
				})
			],
			// output:{
			//   entryFileNames: `assets/[name].js`,
			//   chunkFileNames: `assets/[name].js`,
			//   assetFileNames: `assets/[name].[ext]`,
			// }
		}
	},
	server: {
		host: '0.0.0.0',
		port: 3000, // 端口号
		open: false // 是否自动打开浏览器
	}
})
