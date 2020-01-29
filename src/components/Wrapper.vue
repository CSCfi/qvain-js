<!-- ADD_LICENSE_HEADER -->
<template functional>
	<div
		:class="{ wrapper: props.wrapped, error: props.error, [data.staticClass || '']: true }"
		:style="data.style || ''"
	>
		<slot />
	</div>
</template>
<script>

export default {
	name: 'Wrapper',
	props: {
		wrapped: { type: Boolean, default: false },
		error: { type: Boolean, default: false },
	},
}
</script>

<style lang="scss" scoped>
.wrapper {
	padding: 1em;
	border: 1px solid #e9e9e9;
}

.error {
	border-right: solid 5px red;
}
</style>
