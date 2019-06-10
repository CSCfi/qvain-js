<template>
	<div :style="listItemStyle(depth)">
		<header>
			<h3 class="title" @click="visible = !visible" :aria-controls="domId + '-props'" :aria-expanded="visible ? 'true' : 'false'">
				{{ uiTitle }}
			</h3>
		</header>
		<section>
			<b-list-group flush>
				<b-list-group-item class="border-0" v-for="propName in sortedProps" :key="propName">
					<TabSelector
						:required="(schema.required || []).includes(propName)"
						:schema="schema['properties'][propName]"
						:path="newPath('properties/' + propName)"
						:value="value[propName]"
						:parent="value"
						:property="propName"
						:tab="myTab"
						:activeTab="activeTab"
						:depth="depth"
						:key="propName"
						v-if="shouldCreateProp(propName)" />
						<b-btn @click="addProp(propName)" v-else-if="isPostponedProp(propName)">add {{ propName }}</b-btn>
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
	extends: vSchemaBase,
	mixins: [BorderColorMixin],
	name: 'SchemaObject',
	description: "generic object",
	schematype: 'object',
	data() {
		return {
			q: "not set",
			visible: true,
		}
	},
	methods: {
		shouldCreateProp(prop) {
			if (prop === '@type') return false
			if (!this.isPostponedProp(prop) && !this.isIgnoredProp(prop)) return true
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
		ignoredProps() {
			return this.ui['ignored'] || []
		},
		expandArrow() {
			return this.visible ? "ellipsis-v" : "angle-right"
		},
	},
	created() {
		if ('visible' in this.ui) this.visible = this.ui['visible']
	},
}
</script>

<style lang="scss" scoped>
.title {
	margin-left: 20px;
}
</style>
