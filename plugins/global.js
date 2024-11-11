import Vue from "vue";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default ({ app }, inject) => {
	inject("global", Vue.observable({
		scope: "avalability-client",
		sender: "avalability-client"
	}));
};
