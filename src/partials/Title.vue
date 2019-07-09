<!-- ADD_LICENSE_HEADER -->
<template functional>
	<span class="title">
		{{ props.title }}
	</span>
</template>

<style lang="scss" scoped>

.title {
	margin: 0;
	font-size: 16px;
	font-weight: 700;
	color:black;
	font-family: -apple-system, system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}
</style>

<script>
export default {
	name: "title-component",
}
</script>
