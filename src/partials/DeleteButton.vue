<!--
This file is part of Qvain -project.

Author(s):
	Juhapekka Piiroinen <jp@1337.fi>
	Eemeli Kouhia <eemeli.kouhia@gofore.com>
	Jori Niemi <3295718+tahme@users.noreply.github.com>
	Wouter Van Hemel <wouter.van.hemel@helsinki.fi>

License: GPLv3

See LICENSE file for more information.
Copyright (C) 2019 Ministry of Culture and Education, Finland.
All Rights Reserved.
-->
<template functional>
	<span
		class="delete-button"
		:class="{pointer: !props.disabled, disabled: props.disabled}"
		variant="link"
		@click="(e)=>props.disabled ? null : listeners.click(e)"
	>
		<font-awesome-icon
			icon="trash"
			fixed-width
			class="icon"
		/>
	</span>
</template>

<style lang="scss" scoped>
.delete-button:not(.disabled) {
	padding: 4px 4px;
	border-radius: 4px;

	color: black;
	&:hover .icon {
		color: red;
	}

	&:hover {
		background: rgba(0,0,0,0.1);
	}
}

.disabled {
	color: #ccc;
}
</style>

<script>
export default {
	name: 'DeleteButton',
	props: {
		disabled: {
			type: Boolean,
		},
	},
}
</script>
