<!--
This file is part of Qvain -project.

Author(s):
	Juhapekka Piiroinen <jp@1337.fi>
	Eemeli Kouhia <eemeli.kouhia@gofore.com>
	Kauhia <Kauhia@users.noreply.github.com>
	Jori Niemi <3295718+tahme@users.noreply.github.com>
	Wouter Van Hemel <wouter.van.hemel@helsinki.fi>

License: GPLv3

See LICENSE file for more information.
Copyright (C) 2019 Ministry of Culture and Education, Finland.
All Rights Reserved.
-->
<template>
	<record-field
		v-if="isVisible"
		:required="isRequired"
		:wrapped="wrapped"
	>
		<title-component
			slot="title"
			:title="uiLabel"
		/>
		<small
			slot="help"
			class="text-muted"
		>
			{{ uiDescription }}
		</small>

		<b-row slot="input">
			<b-col>
				<datepicker
					v-model="date"
					:format="schema.format"
					:disabled="readOnly"
				/>
			</b-col>
		</b-row>
	</record-field>
</template>

<script>
import Datepicker from '@/components/DateTimePicker.vue'
import SchemaBase from '@/widgets/base.vue'
import RecordField from '@/composites/RecordField.vue'
import TitleComponent from '@/partials/Title.vue'

export default {
	name: 'Date',
	components: {
		Datepicker,
		RecordField,
		TitleComponent,
	},
	extends: SchemaBase,
	props: {
		wrapped: { type: Boolean, default: false },
	},
	data() {
		return {
			date: null,
			initializing: true,
		}
	},
	watch: {
		date() {
			if(this.initializing) return
			this.$store.commit('updateValue', { p: this.parent, prop: this.property, val: this.date })
		},
	},
	async created() {
		this.initializing = true
		this.date = this.value ? this.value : null
		await this.$nextTick()
		this.initializing = false
	},
	methods: {
		clear() {
			this.date = null
		},
	},
}
</script>
