<!-- ADD_LICENSE_HEADER -->
<template>
	<ol class="breadcrumb m-0 bg-white">
		<b-btn
			v-if="homePath"
			class="m-0 py-0 px-2"
			variant="link"
			@click.stop="click(homePath)"
		>
			<font-awesome-icon :icon="icon.faHome" />
		</b-btn>
		<li
			v-for="(crumb, i) in breadcrumbs"
			:key="i"
			class="breadcrumb-item"
		>
			<b-btn
				v-if="crumb.label"
				class="m-0 py-0 px-2"
				variant="link"
				:disabled="i === breadcrumbs.length -1"
				@click.stop="click(crumb.to ? crumb.to : '/')"
			>
				{{ crumb.label }}
			</b-btn>
		</li>
	</ol>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'

export default {
	name: 'Breadcrumbs',
	components: {
		FontAwesomeIcon,
	},
	props: [ 'breadcrumbs', 'click', 'homePath' ],
	data: function() {
		return {
			icon: { faHome },
		}
	},
	updated: function() {
	},
}
</script>

<style>
</style>
