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
	<div class="icon">
		<font-awesome-icon icon="exclamation-triangle" fixed-width />
	</div>
</template>

<style lang="scss" scoped>
$iconColor: #d28c13;
.icon {
    background-color: white;
    border-radius: 50%;
    width: 45px;
    height: 45px;
    border: solid $iconColor 4px;
	padding: 3px;

	svg {
		color: $iconColor;
		font-size: 25px;
	}
}
</style>
