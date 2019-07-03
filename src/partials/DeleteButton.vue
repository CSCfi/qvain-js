<!-- ADD_LICENSE_HEADER -->
<template functional>
	<span class="pointer delete-button" variant="link" v-on:click="listeners.click">
		<font-awesome-icon icon="trash" fixed-width class="icon" />
	</span>
</template>

<style lang="scss" scoped>
.delete-button {
	padding: 4px 4px;
	border-radius: 4px;
	margin-left: 1em;
	float: right;

	align-self: stretch;
	display: inline-flex;
	align-items: center;
	justify-content: center;

	color: black;
	&:hover .icon {
		color: red;
	}

	&:hover {
		background: rgba(0,0,0,0.1);
	}
}
</style>

<script>
export default {
	name: 'delete-button',
}
</script>
