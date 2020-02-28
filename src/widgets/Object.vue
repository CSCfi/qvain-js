<!--
This file is part of Qvain -project.

Author(s):
	Juhapekka Piiroinen <jp@1337.fi>
	Wouter Van Hemel <wouter.van.hemel@helsinki.fi>
	Eemeli Kouhia <eemeli.kouhia@gofore.com>
	Jori Niemi <3295718+tahme@users.noreply.github.com>
	Kauhia <Kauhia@users.noreply.github.com>

License: GPLv3

See LICENSE file for more information.
Copyright (C) 2019 Ministry of Culture and Education, Finland.
All Rights Reserved.
-->
<template>
	<div
		:id="property + '_object'"
		:style="listItemStyle(depth)"
	>
		<header v-if="uiTitle">
			<h3
				class="title"
				:aria-controls="domId + '-props'"
			>
				{{ uiTitle }}
			</h3>
		</header>
		<section>
			<b-list-group flush>
				<b-list-group-item
					v-for="propName in sortedProps"
					v-show="!isPropHidden(propName)"
					:key="propName"
					class="border-0"
				>
					<TabSelector
						:key="propName"
						:required="isPropRequired(propName)"
						:schema="schema['properties'][propName]"
						:path="newPath('properties/' + propName)"
						:value="value[propName]"
						:parent="value"
						:property="propName"
						:tab="myTab"
						:active-tab="activeTab"
						:depth="depth"
						:read-only="readOnly"
					/>
				</b-list-group-item>
			</b-list-group>
		</section>
	</div>
</template>

<script>
import vSchemaBase from './base.vue'
import keysWithOrder from '@/lib/keysWithOrder.js'
import BorderColorMixin from '../mixins/border-color-mixin.js'

export default {
	name: 'SchemaObject',
	extends: vSchemaBase,
	mixins: [BorderColorMixin],
	description: "generic object",
	schematype: 'object',
	data() {
		return {
			q: "not set",
			visible: true,
		}
	},
	computed: {
		vState() {
			return this.$store.state.vState
		},
		myState: {
			cache: false,
			get: function() {
				return this.vState[this.path] || {}
			},
		},
		sortedProps() {
			let keys = []
			if (!this.schema['properties']) {
				keys = []
			}

			if (typeof this.ui['order'] === 'object') {
				keys = keysWithOrder(this.schema['properties'], this.ui['order'])
			} else {
				keys = Object.keys(this.schema['properties'])
			}
			return keys.filter(key => !this.isPostponedProp(key))
				.filter(key => !this.isIgnoredProp(key))
		},
		postponedProps() {
			return this.ui['postponed'] || []
		},
		ignoredProps() {
			return this.ui['ignored'] || []
		},
	},
	methods: {
		isPropRequired(prop) {
			const ui = this.propUi(prop)
			if (ui.required) {
				return ui.required(this.$store.state.record)
			} else {
				return (this.schema.required || []).includes(prop)
			}
		},
		isPropHidden(prop) {
			const ui = this.propUi(prop)
			return !this.shouldCreateProp(prop) || (ui.tab && ui.tab !== this.activeTab)
				|| (ui.visible && ui.visible(this.$store.state.record, prop) === false)
		},
		shouldCreateProp(prop) {
			if (prop === '@type') return false
			if (this.isPostponedProp(prop) || this.isIgnoredProp(prop)) return false
			if (prop in this.value) return true
			return false
		},
		isPostponedProp(prop) {
			return this.postponedProps.includes(prop)
		},
		isIgnoredProp(prop) {
			return this.ignoredProps.includes(prop)
		},
		addProp(prop) {
			this.$store.commit('addProp', {
				val: this.value,
				prop: prop,
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.title {
	margin-left: 20px;
}
</style>
