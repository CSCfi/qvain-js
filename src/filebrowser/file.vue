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
	<li>
		<a v-b-popover.hover="data.id" title="file information" @click.stop="modalOpen(id, data.file_path, data.project_identifier)">{{ fileName }}</a> (<b>id:</b> {{ id }}, <b>identifier:</b> {{ identifier }} test: {{ data.id }})
	</li>
</template>

<script>
export default {
	name: "file",
	props: ['id', 'fileName', 'identifier', 'data', 'modalOpen'],
	methods: {},
}
</script>
