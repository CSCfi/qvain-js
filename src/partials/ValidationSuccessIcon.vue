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
		<font-awesome-icon
			icon="check"
			fixed-width
		/>
	</div>
</template>

<style lang="scss" scoped>
$iconColor: #16c516;
.icon {
    background-color: white;
    border-radius: 50%;
    width: 45px;
    height: 45px;
    border: solid $iconColor 4px;
	padding-top: 4px;

	svg {
		color: $iconColor;
		font-size: 30px;
	}
}
</style>
