<!--
This file is part of Qvain -project.

Author(s):
	Juhapekka Piiroinen <jp@1337.fi>
	Wouter Van Hemel <wouter.van.hemel@helsinki.fi>

License: GPLv3

See LICENSE file for more information.
Copyright (C) 2019 Ministry of Culture and Education, Finland.
All Rights Reserved.
-->
<template>
	<b-popover class="validation-popover" target="popovertarget">
		<template slot="title">
			<b-btn @click="onClose" class="close" aria-label="Close">
				<span class="d-inline-block" aria-hidden="true">&times;</span>
			</b-btn>
			validation
		</template>
		<div>
		{{ message || "hello there!" }}
		</div>
	</b-popover>
</template>

<script>
export default {
	name: 'validation-popover',
	props: ['message', 'path'],
	data: function() {
		return {
			error: null,
		}
	},
	methods: {
	},
	computed: {
	},
	created() {
	},
}
</script>
