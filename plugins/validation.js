import Vue from "vue";
import validator from "validator";

const PHONE_REGEX = /^[0-9-_() +.# ]*$/;
const INTEGER_REGEX = /^(0|[1-9]\d*)$/;

export default ({ app }, inject) => {
	inject("validation", Vue.observable({
		required (value) {
			return value === 0 ? !value : !!value || app.i18n.t("validation.required");
		},
		validPhoneNumber (value) {
			return (value && validator.isMobilePhone(value, ["en-US"])) || app.i18n.t("validation.validPhoneNumber");
		},
		phone: (value) => {
			return !value || (PHONE_REGEX.test(value) && (value.length >= 10 && value.length <= 15)) || app.i18n.t("validation.phone");
		},
		intNumber: (value) => {
			return !value || INTEGER_REGEX.test(value) || app.i18n.t("validation.intNumber");
		}
	}));
};
