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
	<span :class="variant">
		{{ long }}
	</span>
</template>

<script>
import StateDefs from '@/data/preservation_state.json'

export default {
	name: "archive-state",
	props: ['state'],
	computed: {
		description: function() {
			if (!this.state) {
				return StateDefs['0']
			}
			return StateDefs[this.state] || {}
		},
		long: function() {
			return (this.description['name'] || "unknown state").toLowerCase()
		},
		short: function() {
			return (this.description['short']['en'] || this.long).toLowerCase()
		},
		numState: function() {
			return Number(this.state)
		},
		variant: function() {
			switch (this.description.type) {
			case "wait":
				return "text-secondary"
			case "fail":
				return "text-error"
			case "success":
				return "text-success"
			default:
				return "text-secondary"
			}
		},
	},
}
</script>

