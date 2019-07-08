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
			<div class="mb-3" v-for="(org, i) in flattened" :key="'level-' + i">
				<div class="header-row">
					<b-btn href="#" v-b-toggle="domId + '-accordion-' + i" style="text-align: left;">
						<font-awesome-icon class="when-opened" icon="angle-down" fixed-width />
						<font-awesome-icon class="when-closed" icon="angle-right" fixed-width />
						Level {{ i + 1 }}{{ getDescriptionForLevel(i) }}
						<DeleteButton v-if="i > 0" @click="remove(i)"/>
					</b-btn>

				</div>

				<b-collapse :id="domId + '-accordion-' + i" :visible="opened" :accordion="domId + '-accordion'" role="tabpanel">
					<FlatObject :schema="schema"
						:path="path"
						:value="org"
						:parent="i ? flattened[i - 1] : value"
						:property="i ? refField : property"
						:tab="myTab"
						:activeTab="activeTab"
						:depth="depth"
						:key="'level-' + i">
					</FlatObject>
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
		}
	},
	methods: {
		add() {
			let obj = this.value
			while (this.refField in obj) {
				obj = obj[this.refField]
			}
			this.$store.commit('updateValue', {
				p: obj,
				prop: this.refField,
				val: {},
			})
			//obj[this.refField] = undefined
			//return obj[this.refField]
		},
		remove(level) {
			// don't allow deleting top level for now
			if (!level) return

			let obj = this.value
			let i = 0
			let parent = this.parent
			while (i !== level && this.refField in obj) {
				parent = obj
				obj = obj[this.refField]
				i++
			}
			if (level === i) {
				this.$store.commit('deleteValue', {
					p: parent,
					// property name of top-level in parent might be different, e.g. memberOf/partOf/partOf/partOf/...
					prop: i == 0 ? this.property : this.refField,
				})
				return
			}
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
			let obj = this.value
			let arr = []

			if (!obj || typeof obj !== 'object') return arr

			arr.push(obj)

			while (this.refField in obj) {
				obj = obj[this.refField]
				if (!obj || typeof obj !== 'object') return arr
				arr.push(obj)
			}

			return arr
		},
	},
}
</script>
