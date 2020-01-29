<!-- ADD_LICENSE_HEADER -->
<template>
	<font-awesome-icon
		v-if="description"
		v-b-tooltip.hover.left
		class="info-icon"
		:icon="icons.faQuestionCircle"
		:title="description"
	/>
</template>

<style lang="scss" scoped>
.info-icon {
	font-size: 20px;
}
</style>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
	faQuestionCircle,
	faSquare,
} from '@fortawesome/free-regular-svg-icons'
import {
	faInfo,
} from '@fortawesome/free-solid-svg-icons'

export default {
	name: 'InfoIcon',
	components: {
		FontAwesomeIcon,
	},
	props: {
		description: {
			type: String,
		},
	},
	computed: {
		icons() {
			return {
				faQuestionCircle,
				faSquare,
				faInfo,
			}
		},
	},
}
</script>
