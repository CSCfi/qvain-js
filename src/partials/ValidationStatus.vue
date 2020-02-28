<!--
This file is part of Qvain -project.

Author(s):
	Juhapekka Piiroinen <jp@1337.fi>
	Eemeli Kouhia <eemeli.kouhia@gofore.com>
	Wouter Van Hemel <wouter.van.hemel@helsinki.fi>
	Shreyas Deshpande <31839853+ShreyasDeshpande@users.noreply.github.com>

License: GPLv3

See LICENSE file for more information.
Copyright (C) 2019 Ministry of Culture and Education, Finland.
All Rights Reserved.
-->
<template>
	<font-awesome-icon
		v-if="status === 'uncertain'"
		v-b-tooltip.hover.left
		icon="exclamation-triangle"
		class="icon icon__uncertain"
		fixed-width
		:title="reason || uncertainDefault"
	/>

	<font-awesome-icon
		v-else-if="status === 'invalid'"
		v-b-tooltip.hover.left
		icon="exclamation"
		class="icon icon__invalid"
		fixed-width
		:title="reason || invalidDefault"
	/>
</template>

<style lang="scss" scoped>
.icon {
	font-size: 20px;

	&__invalid {
		color: red;
	}
	&__uncertain {
		color: #d28c13;
	}
}

</style>

<script>

export default {
	name: 'ValidationStatus',
	components: {
	},
	props: {
		status: {
			type: String,
			validator: (val) => [ 'valid', 'uncertain', 'invalid', null ].includes(val),
		},
		reason: {
			type: String,
			required: false,
		},
	},
	data() {
		return {
			validDefault: 'This field is valid',
			invalidDefault: 'This field is invalid',
			uncertainDefault: 'Enter a value in at least one language, other languages can then be left empty',
		}
	},
}
</script>
