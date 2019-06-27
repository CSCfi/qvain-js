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
	<wrapper :wrapped="wrapped" :error="error">
		<div v-if="header" class="header">
			<div class="header__label">
				<slot name="title"/><span v-if="required" class="header__required">*</span>
			</div>
			<div class="header__right">
				<slot name="header-right"/>
			</div>
		</div>

		<slot name="input"/>
	</wrapper>
</template>


<style lang="scss" scoped>

.header {
	width: 100%;
	display: inline-flex;
	margin-bottom: 5px;

	&__label {
		display: inline-flex;
	}

	&__right {
		margin-left: auto;
		//display: inline-flex; // inline things in component using this
	}

	&__required {
		color: red;
	}
}


</style>

<script>
import Wrapper from '@/components/Wrapper.vue'
export default {
	name: 'record-field',
	components: {
		Wrapper,
	},
	props: {
		wrapped: {
			type: Boolean,
			default: false,
		},
		required: {
			type: Boolean,
			default: false,
		},
		header: {
			type: Boolean,
			default: true,
		},
		error: {
			type: Boolean,
			default: false,
		},
	},
}
</script>
