<template>
	<rely-layout-box>
		<v-card-title class="headline">
			{{ $t("app.error") }}
		</v-card-title>

		<v-divider />

		<v-card-text>
			{{ error }}
		</v-card-text>
	</rely-layout-box>
</template>

<script>
export default {
	name: "ErrorLayout",
	layout: "empty",
	props: {
		error: {
			type: Object,
			default: undefined
		}
	}
};
</script>
