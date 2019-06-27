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
	<transition-group name="tags" tag="div" class="my-2">
		<b-badge :ref="`badge-${index}`" variant="secondary" class="p-1 mr-2 animated-tag" v-for="(value, index) in items" :key="value.toString()" @mouseenter="hover" @mouseleave="unhover" @click="$emit('remove', index)">
			<h6>{{ value }}
				<sup><font-awesome-icon icon="times" class="text-danger" /></sup>
			</h6>
		</b-badge>
	</transition-group>
</template>

<script>
export default {
	name: 'tag-list',
	props: ['items'],
	methods: {
		hover(e) {
			e.target.classList.add('bg-danger')
		},
		unhover(e) {
			e.target.classList.remove('bg-danger')
		},
	},
}
</script>
