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
	<div>
		<h1 class="my-3">
			Configuration
		</h1>

		<b-card
			title="environment"
			class="mb-1"
		>
			<dl class="row card-text">
				<template v-for="(val, key) in getVueKeys()">
					<dt
						:key="key"
						class="col-sm-2 text-monospace"
					>
						<code>{{ key }}</code>
					</dt>
					<dd
						:key="val"
						class="col-sm-10 text-monospace"
					>
						<code>{{ val || "–" }}</code>
					</dd>
				</template>
				<dt class="col-sm-2 text-monospace">
					<code>NODE_ENV</code>
				</dt>
				<dd class="col-sm-10 text-monospace">
					<code>{{ getEnvKey("NODE_ENV") || "–" }}</code>
				</dd>
				<dt class="col-sm-2 text-monospace">
					<code>DEV_TOKEN</code>
				</dt>
				<dd class="col-sm-10 text-monospace">
					<code>{{ getEnvKey("VUE_APP_DEV_TOKEN") ? "set" : "unset" }}</code>
				</dd>
			</dl>
		</b-card>
	</div>
</template>

<script>
export default {
	name: "Config",
	data: function() {
		return {
			vueKeys: [ "METAX_API_URL", "ES_API_URL", "ETSIN_API_URL", "VERSION", "COMMIT_HASH", "ENVIRONMENT" ],
		}
	},
	methods: {
		getVueKeys() {
			return this.vueKeys.reduce((obj, val) => { obj[val] = process.env["VUE_APP_" + val]; return obj }, {})
		},
		getEnvKey(key) {
			return process.env[key]
		},
	},
}
</script>
