import VuexPersist from "vuex-persist";

export default ({ store }) => {
	new VuexPersist({
		key: "vuex",
		storage: window.localStorage,
		reducer: state => ({
			app: state.app
		})
	}).plugin(store);
};
