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
		<footer class="footer">
			<b-container>
				<b-row>
					<b-col>
						Fairdata services are offered by the Ministry of Education and Culture.
						Produced by CSC - IT Center for Science Ltd.
						Developed by National Library 2016-2019, CSC 2019-&gt;
						<br />{{ commitHash }} - {{ version }}
					</b-col>
					<b-col>
						<b-img src="/static/imgs/CSC.png" width="50" fluid center></b-img>
					</b-col>
					<b-col>
						CSC customer support<br />
						servicedesk (at) csc.fi<br />
						+358 9 457 2821<br />
						Weekdays from 8:30 AM to 4 PM<br />
					</b-col>
				</b-row>
			</b-container>
		</footer>
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

	.footer {
		padding: 16px;
		text-align: center;
	}
</style>
<script>
import Navigation from './navigation.vue'
import NavigationSub from './navigation-sub.vue'
export default {
	name: 'App',
	components: {
		Navigation,
		NavigationSub,
	},
	computed: {
		commitHash() {
			return process.env["VUE_APP_COMMIT_HASH"]
		},
		version() {
			return process.env["VUE_APP_VERSION"]
		}
	}
}
</script>
