<!--
This file is part of Qvain -project.

Author(s):
	Juhapekka Piiroinen <jp@1337.fi>
	Wouter Van Hemel <wouter.van.hemel@helsinki.fi>
	Aaron Hakala <aaron.hakala@metropolia.fi>

License: GPLv3

See LICENSE file for more information.
Copyright (C) 2019 Ministry of Culture and Education, Finland.
All Rights Reserved.
-->
<template>
	<div id="app">
		<navigation />
		<b-container fluid id="app-body">
			<router-view></router-view>
		</b-container>
	</div>
</template>

<script>
import Navigation from './navigation.vue'

export default {
	name: 'App',
	components: {
		Navigation,
	},
}
</script>
