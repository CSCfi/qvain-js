<!--
This file is part of Qvain -project.

Author(s):
	Juhapekka Piiroinen <jp@1337.fi>
	Jori Niemi <3295718+tahme@users.noreply.github.com>
	Eemeli Kouhia <eemeli.kouhia@gofore.com>
	Wouter Van Hemel <wouter.van.hemel@helsinki.fi>

License: GPLv3

See LICENSE file for more information.
Copyright (C) 2019 Ministry of Culture and Education, Finland.
All Rights Reserved.
-->
<template functional>
	<div
		:class="{ wrapper: props.wrapped, error: props.error, [data.staticClass || '']: true }"
		:style="data.style || ''"
	>
		<slot />
	</div>
</template>
<script>

export default {
	name: 'Wrapper',
	props: {
		wrapped: { type: Boolean, default: false },
		error: { type: Boolean, default: false },
	},
}
</script>

<style lang="scss" scoped>
.wrapper {
	padding: 1em;
	border: 1px solid #e9e9e9;
}

.error {
	border-right: solid 5px red;
}
</style>
