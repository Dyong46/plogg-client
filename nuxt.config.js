import enLib from "./vuelib/locales/en";
import en from "./locales/en";

import frLib from "./vuelib/locales/fr";
import fr from "./locales/fr";

import { dev, getProxies } from "./vuelib";

const assetUrl = process.env.NODE_ENV === "production"
	? "https://storage.googleapis.com/rely-media"
	: "https://storage.googleapis.com/rely-media-rc";

export default () => ({
	storesBuild: [{
		destination: "./store",
		source: "./vuelib/store"
	}],
	target: "server",
	ssr: false,
	dev,
	workbox: {
		runtimeCaching: [
			{
				urlPattern: `${assetUrl}/.*`,
				strategyOptions: {
					cacheName: "our-cache"
				},
				strategyPlugins: [{
					use: "Expiration",
					config: {
						maxEntries: 10,
						maxAgeSeconds: 300
					}
				}]
			}
		]
	},

	head: {
		titleTemplate: "Plogg dental",
		title: "Plogg Dental",
		meta: [
			{ charset: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ hid: "og:title", name: "og:title", content: "Plogg dental" },
			{ hid: "description", name: "description", content: "Plogg dental." },
			{ hid: "og:description", property: "og:description", content: "Plogg dental" },
			{ name: "format-detection", content: "telephone=no" }
		],
		link: [
			{ rel: "icon", type: "image/svg+xml", href: "/logo/icon-avalability-client.svg" }
		]
	},
	env: {
		dev,
		hostname: dev ? (process.env.HOSTNAME ? process.env.HOSTNAME.toLowerCase() : "") : "",
		appName: "Plogg Dental",
		gtag: "G-1D172FENH7",
		ASSETS_URL: assetUrl,
		ENV: process.env.ENV
	},
	router: {
		middleware: ["auth"]
	},
	auth: {
		plugins: [
			"~/vuelib/plugins/auth",
			"~/vuelib/plugins/refresh"
		],
		redirect: {
			login: "/login",
			logout: "/login",
			home: false
		},
		strategies: {
			rely: {
				scope: "avalability-client",
				sender: "avalability-client",
				scheme: "~/vuelib/schemes/relyScheme",
				token: {
					property: "jwt"
				},
				refreshToken: {
					property: "refresh",
					data: "refreshToken"
				},
				endpoints: {
					login: {
						url: "/api/account/auth/login",
						method: "post"
					},
					refresh: {
						url: "/api/account/auth/refresh",
						method: "post"
					},
					logout: false,
					user: {
						url: "/api/account/auth/profile",
						method: "get"
					}
				}
			}
		}
	},
	buildModules: [
		"@nuxt/typescript-build",
		"@nuxtjs/vuetify"
	],
	build: {
		extend (config, _) {
			config.module.rules.push({
				enforce: "pre",
				test: /\.txt$/,
				loader: "raw-loader",
				exclude: /(node_modules)/
			});
		}
	},
	modules: [
		"@nuxtjs/axios",
		"@nuxtjs/proxy",
		"@nuxtjs/pwa",
		"@nuxtjs/i18n",
		"@nuxtjs/auth-next",
		"~/vuelib/module",
		"vue-swatches/nuxt"
	],
	css: [
		"~/vuelib/assets/scss/index.scss",
		"~/assets/scss/index.scss"
	],
	components: [
		"~/components",
		"~/vuelib/components"
	],
	plugins: [
		"~/plugins/global",
		"~/vuelib/plugins/bus",
		"~/vuelib/plugins/filters",
		"~/vuelib/plugins/helper",
		"~/vuelib/plugins/locale",
		"~/vuelib/plugins/maps",
		"~/vuelib/plugins/rely",
		"~/vuelib/plugins/time",
		"~/vuelib/plugins/rules",
		"~/vuelib/plugins/vueflags",
		"~/vuelib/plugins/vuex-persist",
		"~/vuelib/plugins/phone",
		"~/vuelib/plugins/error",
		"~/vuelib/plugins/customer",
		"~/vuelib/plugins/voc",
		"~/vuelib/plugins/order",
		"~/vuelib/plugins/eav",
		"~/vuelib/plugins/currency",
		"~/vuelib/plugins/util",
		"~/vuelib/plugins/where",
		"~/vuelib/plugins/gtag",
		"~/vuelib/plugins/promise",
		"~/plugins/validation",
		"~/plugins/filter"
	],
	pwa: {
		icon: {
			fileName: "icon.png?v"
		},
		manifest: {
			lang: "en"
		}
	},
	axios: {
		proxy: true,
		retry: true
	},
	proxy: getProxies(),
	i18n: {
		strategy: "prefix",
		vueI18nLoader: true,
		locales: [{
			code: "en",
			name: "English"
		}, {
			code: "fr",
			name: "Français"
		}],
		defaultLocale: "en",
		vueI18n: {
			silentFallbackWarn: true,
			fallbackLocale: "en",
			messages: {
				en: {
					...enLib,
					...en
				},
				fr: {
					...frLib,
					...fr
				}
			}
		}
	},
	publicRuntimeConfig: {
		logo: "/logo/avalability-client-logo.jpg"
	},

	vuetify: {
		treeShake: true,
		customVariables: ["~/assets/variables.scss"],
		theme: {
			dark: false,
			themes: {
				light: {
					background: "#f0f0f0",
					primary: "#000000",
					success: "#4CAF50",
					info: "#5A917F",
					warning: "#FB8C00",
					error: "#FF5252",
					secondary: "#505f96",
					accent: "#805c0e",
					greyTerm: "#EEEEEE",
					teal: "#5A917F"
				},
				dark: {
					background: "#111111",
					primary: "#807a3c",
					info: "#3951A7",
					success: "#39A751",
					warning: "#F3BB29",
					error: "#A73939",
					secondary: "#505f96",
					accent: "#805c0e",
					greyTerm: "#EEEEEE",
					teal: "#5A917F"
				}
			}
		}
	}
});
