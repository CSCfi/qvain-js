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
	<p class="font-italic text-muted text-centered" style="margin: 0.5rem 0; padding: 0;"><font-awesome-icon icon="pen" fixed-width class="mr-1" /> <slot>nothing here yet</slot></p>
</template>

export default {
	name: 'empty-note',
	props: {
		inArray: {
			type: Boolean,
			default: false,
		},
	},
}
