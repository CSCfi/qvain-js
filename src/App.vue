<!-- ADD_LICENSE_HEADER -->
<template>
	<div id="app">
		<b-alert
			id="root_alert"
			:show="$root.dismissCountDown"
			class="alert"
			dismissible
			:variant="$root.alertVariant"
			@dismissed="$root.dismissAlert"
			@dismiss-count-down="$root.countDownChanged"
		>
			<p>{{ $root.alertText }}</p>
		</b-alert>
		<navigation />
		<navigation-sub />

		<b-container
			v-if="$auth.loading.state"
			fluid
			class="loading-session"
		>
			<b-row>
				<b-col>
					<font-awesome-icon
						icon="spinner"
						spin
					/>
				</b-col>
			</b-row>
		</b-container>

		<b-container
			id="app-body"
			fluid
		>
			<router-view />
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

	.loading-session {
		padding-top: 2em;
		padding-left: 2em;
	}

	.alert {
		z-index: 2000;
		position: fixed;
		top: 1rem;
		left: 0;
		right: 0;
		width: 90%;
		margin: 0 auto;
		opacity: 0.95;
		white-space: pre-line;
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
}
</script>
