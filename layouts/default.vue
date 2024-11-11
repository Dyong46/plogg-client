<template>
	<v-app :class="{ 'background-cover': background }" :style="style">
		<v-snackbar v-if="messages.length" v-model="snackbar" :timeout="3000">
			<v-alert
				:value="messages.at(-1).value"
				:type="messages.at(-1).type"
				:icon="`mdi-${messages.at(-1).icon || 'alert'}`"
				elevation="5"
				class="ma-0"
			>
				{{ messages.at(-1).message }}
			</v-alert>

			<template #action>
				<v-btn icon>
					<v-icon @click="snackbar = false">
						mdi-close
					</v-icon>
				</v-btn>
			</template>
		</v-snackbar>
		<nav-bar v-if="$auth.loggedIn" />
		<v-main class="background position-relative" :class="{ 'background-cover': background }" :style="style">
			<v-container>
				<Nuxt />
			</v-container>
		</v-main>
	</v-app>
</template>

<script>
import { mapFields } from "vuex-map-fields";

export default {
	name: "DefaultLayout",
	data () {
		return {
			snackbar: false,
			snackbarTime: 0
		};
	},

	computed: {
		...mapFields("app", ["background", "dark", "drawer"]),
		...mapFields("alerts", ["messages"]),

		style () {
			return this.background ? `background-image: url(${this.background})` : "";
		}
	},
	watch: {
		"$auth.loggedIn" () {
			if (this.$auth.loggedIn) {
				this.$router.push(this.localePath("/"));
			}
		},
		messages () {
			if (
				this.messages.length > 0 &&
				this.messages.at(-1).created.getTime() > this.snackbarTime
			) {
				this.snackbar = true;
				this.snackbarTime = this.messages.at(-1).created.getTime();
			}
		}
	},
	created () {
		this.$vuetify.theme.dark = this.dark;
	}
};
</script>
