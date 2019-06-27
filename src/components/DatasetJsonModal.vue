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
	<b-modal size="lg" lazy ok-only title="Dataset JSON representation" v-bind="$attrs" v-on="$listeners">
		<b-form-textarea id="dataset-json-modal-json" class="p-0 text-monospace small" plaintext readonly :value="JSON.stringify($store.getters.prunedDataset, null, 2)" placeholder="no json" :rows="12"></b-form-textarea>
	</b-modal>
</template>
