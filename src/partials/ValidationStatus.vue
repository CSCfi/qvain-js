<!-- ADD_LICENSE_HEADER -->
<template>
	<font-awesome-icon v-if="status === 'uncertain'"
		icon="exclamation-triangle"
		class="icon icon__uncertain"
		fixed-width
		v-b-tooltip.hover.left
		:title="reason || uncertainDefault" />

	<font-awesome-icon v-else-if="status === 'invalid'"
		icon="exclamation"
		class="icon icon__invalid"
		fixed-width
		v-b-tooltip.hover.left
		:title="reason || invalidDefault"/>
</template>

<style lang="scss" scoped>
.icon {
	font-size: 20px;

	&__invalid {
		color: red;
	}
	&__uncertain {
		color: #d28c13;
	}
}

</style>

<script>

export default {
	name: 'validation-status',
	props: {
		status: {
			type: String,
			validator: (val) => ['valid', 'uncertain', 'invalid', null].includes(val),
		},
		reason: {
			type: String,
			required: false,
		},
	},
	data() {
		return {
			validDefault: 'This field is valid',
			invalidDefault: 'This field is invalid',
			uncertainDefault: 'Enter a value in at least one language, Other languages can then be left empty',
		}
	},
	components: {
	},
}
</script>
