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
	<div class="error">
		<font-awesome-icon icon="exclamation" fixed-width />
	</div>
</template>

<style lang="scss" scoped>
.error {
    background-color: white;
    border-radius: 50%;
    width: 45px;
    height: 45px;
    border: solid red 4px;
	padding-top: 4px;

	svg {
		color: red;
		font-size: 30px;
	}
}
</style>
