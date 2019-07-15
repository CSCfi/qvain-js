<!-- ADD_LICENSE_HEADER -->
<template>
	<div id="app">
		<b-alert id="root_alert" :show="$root.dismissCountDown" style="z-index: 1000; position: fixed; top: 1rem; left: 0; right: 0; width: 90%; margin: 0 auto; opacity: 0.90;" dismissible :variant="$root.alertVariant" @dismissed="$root.dismissAlert" @dismiss-count-down="$root.countDownChanged">
			<p>{{ $root.alertText }}</p>
		</b-alert>
		<navigation />
		<navigation-sub />

		<b-container fluid id="app-body">
			<router-view></router-view>
		</b-container>
		<service-footer />
	</div>
</template>
<style scoped>
	#app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	#app-body {
		flex-grow: 1;
		padding-left: 0;
		padding-right: 0;
	}
</style>
<script>
import Navigation from './navigation.vue'
import NavigationSub from './navigation-sub.vue'
import ServiceFooter from './service-footer.vue'

export default {
	name: 'App',
	components: {
		Navigation,
		NavigationSub,
		ServiceFooter,
	},
	computed: {
	}
}
</script>
