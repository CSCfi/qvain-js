<!--
This file is part of Qvain -project.

Author(s):
	Juhapekka Piiroinen <jp@1337.fi>
	Eemeli Kouhia <eemeli.kouhia@gofore.com>
	Wouter Van Hemel <wouter.van.hemel@helsinki.fi>

License: GPLv3

See LICENSE file for more information.
Copyright (C) 2019 Ministry of Culture and Education, Finland.
All Rights Reserved.
-->
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
