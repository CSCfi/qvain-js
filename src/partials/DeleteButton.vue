<!-- ADD_LICENSE_HEADER -->
<template functional>
	<span
		class="delete-button"
		:class="{pointer: !props.disabled, disabled: props.disabled}"
		variant="link"
		@click="(e)=>props.disabled ? null : listeners.click(e)"
	>
		<font-awesome-icon
			icon="trash"
			fixed-width
			class="icon"
		/>
	</span>
</template>

<style lang="scss" scoped>
.delete-button:not(.disabled) {
	padding: 4px 4px;
	border-radius: 4px;

	color: black;
	&:hover .icon {
		color: red;
	}

	&:hover {
		background: rgba(0,0,0,0.1);
	}
}

.disabled {
	color: #ccc;
}
</style>

<script>
export default {
	name: 'delete-button',
	props: {
		disabled: {
			type: Boolean,
		},
	},
}
</script>
