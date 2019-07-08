<!-- ADD_LICENSE_HEADER -->
<template>
	<div id="app">
		<navigation />
		<b-container fluid id="app-body">
			<router-view></router-view>
		</b-container>
		<footer class="footer">
			<div class="container">
				<span class="text-muted">
					Fairdata services are offered by the Ministry of Education and Culture and produced by CSC - IT Center for Science
				</span>
			</div>
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
	}

	.footer {
		padding: 16px;
		text-align: center;
	}
</style>
<script>
import Navigation from './navigation.vue'

export default {
	name: 'App',
	components: {
		Navigation,
	},
}
</script>
