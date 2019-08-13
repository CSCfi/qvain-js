<!-- ADD_LICENSE_HEADER -->
<template>
	<wrapper :wrapped="false" :style="listItemStyle(depth)">
		<h3 @click="opened = !opened" class="margin-left" :aria-controls="domId + '-props'" :aria-expanded="opened ? 'true' : 'false'">
			<font-awesome-icon v-if="!opened" :icon="expandArrow" class="text-dark"/> {{ uiTitle }}
		</h3>
		<b-collapse :id="domId + '-props'" v-model="opened">
			<p class="ml-4 card-text text-muted" v-if="uiDescription">
				<sup><font-awesome-icon icon="quote-left" class="text-muted" /></sup>
				{{ uiDescription }}
			</p>
			<div
				v-for="(org, i) in flattened"
				:key="getKey(i)"
				class="mb-3"
			>
				<div class="header-row">
					<b-btn href="#" v-b-toggle="domId + '-accordion-' + i" style="text-align: left;">
						<font-awesome-icon class="when-opened" icon="angle-down" fixed-width />
						<font-awesome-icon class="when-closed" icon="angle-right" fixed-width />
						Level {{ i + 1 }}{{ getDescriptionForLevel(i) }}
						<DeleteButton v-if="i > 0" @click="remove(i)"/>
					</b-btn>
				</div>

				<b-collapse :id="domId + '-accordion-' + i" :visible="opened" :accordion="domId + '-accordion'" role="tabpanel">
					<FlatObject
						:key="getKey(org)"
						:schema="schema"
						:path="path"
						:parent="i < countLevels - 1 ? flattened[i + 1] : value"
						:value="org"
						:property="i ? refField : property"
						:tab="myTab"
						:activeTab="activeTab"
						:depth="depth"
					/>
				</b-collapse>
			</div>
			<div class="header-row">
				<b-button class="m-3" variant="outline-dark" @click="add()"><font-awesome-icon icon="plus" fixed-width /> Add another level</b-button>
			</div>
			</b-collapse>
		</wrapper>
</template>

<style lang="scss" scoped>
.margin-left {
	margin-left: 20px;
}
.collapsed > .when-opened,
:not(.collapsed) > .when-closed {
  display: none;
}

.header-row {
	margin-left: 1.5em;
	margin-right: 1.5em;
}
</style>

<script>
import SchemaBase from './base.vue'
import Wrapper from '@/components/Wrapper.vue'
import DeleteButton from '@/partials/DeleteButton.vue'
import BorderColorMixin from '../mixins/border-color-mixin.js'

export default {
	extends: SchemaBase,
	name: 'SelfReferentialObject',
	description: "self-referential object",
	schematype: 'object',
	mixins: [BorderColorMixin],
	components: {
		Wrapper,
		DeleteButton,
	},
	props: {
		'refField': String,
		'levels': Array,
	},
	data: function() {
		return {
			opened: true,
			keys: [],
		}
	},
	methods: {
		getKey(idx) {
			if (this.keys[idx] === undefined) {
				// assuming array order doesn't change, the last item will have the largest key
				this.keys[idx] = (this.keys[this.keys.length-1] || 0) + 1
			}
			return "org-" + this.keys[idx]
		},
		flatten(nested) {
			// Turns a nested structure where each object can have a refField child into
			// an array with the deepest nested object as the first element.
			let obj = nested
			let arr = []

			if (!obj || typeof obj !== 'object') return arr

			arr.push(obj)
			while (this.refField in obj) {
				obj = obj[this.refField]
				if (!obj || typeof obj !== 'object') return arr
				arr.push(obj)
			}

			arr.reverse()
			return arr
		},
		nest(flat) {
			// Inverse of flatten. Turns an array into a nested stucture where each object is a refField child of the next one.
			// The objects are shallow copied so the original objects stay unchanged.
			flat = [...flat].reverse()
			const root = { ...flat[0] }
			let obj = root
			for (let i=1; i<flat.length; i++) {
				obj[this.refField] = { ...flat[i] }
				obj = obj[this.refField]
			}
			this.$delete(obj, this.refField) // remove child from the deepest object
			return root
		},
		add() {
			const arr = [...this.flattened]
			arr.push({})
			const obj = this.nest(arr)
			this.$store.commit('replace', {
				p: this.value,
				val: obj,
			})
		},
		remove(level) {
			if (this.countLevels <= 1) {
				return
			}
			const arr = [...this.flattened]
			arr.splice(level, 1)
			const obj = this.nest(arr)
			this.$store.commit('replace', {
				p: this.value,
				val: obj,
			})
			this.keys.splice(level, 1)
		},
		getDescriptionForLevel(level) {
			return this.levels && this.levels[level] ? ': ' + this.levels[level] : ""
		},
	},
	computed: {
		countLevels() {
			if (!this.value) { return -1 }
			let recurse = this.value
			let depth = 0
			while (this.refField in recurse) {
				depth++
				recurse = recurse[this.refField]
			}
			return depth + 1
		},
		flattened() {
			return this.flatten(this.value)
		},
	},
}
</script>
