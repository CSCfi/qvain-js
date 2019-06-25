<!-- ADD_LICENSE_HEADER -->
<template>
	<div :style="listItemStyle(depth)">
		<header>
			<h3 class="title" :aria-controls="domId + '-props'">
				{{ uiTitle }}
			</h3>
		</header>
		<section>
			<b-list-group flush>
				<b-list-group-item v-show="propName !== '@type'" v-for="propName in sortedProps" :key="propName" class="border-0">
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
						:key="propName" />
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
}
</script>

<style lang="scss" scoped>
.title {
	margin-left: 20px;
}
</style>
