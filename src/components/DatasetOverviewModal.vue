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
	<b-modal size="sm" lazy ok-only title="Dataset overview" v-bind="$attrs" v-on="$listeners">
		<Overview></Overview>
	</b-modal>
</template>

<script>
import Overview from '@/components/Overview.vue'

export default {
	name: 'DatasetOverviewModal',
	components: {
		Overview,
	},
}

</script>
