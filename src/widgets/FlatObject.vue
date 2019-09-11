<!-- ADD_LICENSE_HEADER -->
<template>
	<b-card
		no-body
		class="my-3 p-0 m-0 border-0"
	>
		<b-list-group flush>
			<b-list-group-item
				v-for="propName in sortedProps"
				v-show="!isPropHidden(propName)"
				:key="propName"
				class="border-0"
			>
				<TabSelector
					v-if="shouldCreateProp(propName)"
					:key="propName"
					:schema="schema['properties'][propName]"
					:required="(schema.required || []).includes(propName)"
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
	</b-card>
</template>

<script>
import vSchemaBase from './base.vue'
import keysWithOrder from '@/lib/keysWithOrder.js'

export default {
	name: 'FlatObject',
	extends: vSchemaBase,
	description: "object without title",
	schematype: 'object',
	props: {
		skipped: {
			type: Array,
			default: () => [],
		},
	},
	data: function() {
		return {
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
		countLevels() {
			let recurse = this.value
			let depth = 0
			while (this.refField in recurse) {
				depth++
				recurse = recurse[this.refField]
			}
			return depth
		},
		sortedProps() {
			if (!this.schema['properties']) {
				return []
			}

			if (typeof this.ui['order'] === 'object') {
				return keysWithOrder(this.schema['properties'], this.ui['order'])
			} else {
				return Object.keys(this.schema['properties'])
			}
		},
		postponedProps() {
			return this.ui['postponed'] || []
		},
	},
	methods: {
		isPropHidden(prop) {
			const ui = this.propUi(prop)
			return prop === '@type' || !this.shouldCreateProp(prop) || (ui.tab && ui.tab !== this.activeTab) || ui.visible === false || this.skipped.includes(prop)
		},
		shouldCreateProp(prop) {
			if (prop === 'is_part_of') {
				return false
			}
			if (!this.isPostponedProp(prop)) return true
			if (prop in this.value) return true
			return false
		},
		isPostponedProp(prop) {
			return this.postponedProps.includes(prop)
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
