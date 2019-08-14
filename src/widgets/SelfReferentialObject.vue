<!-- ADD_LICENSE_HEADER -->
<template>
	<wrapper :wrapped="false" :style="listItemStyle(depth)">
		<h3>{{ uiTitle }}</h3>
		<div>
			<p class="ml-4 card-text text-muted" v-if="uiDescription">
				<sup><font-awesome-icon icon="quote-left" class="text-muted" /></sup>
				{{ uiDescription }}
			</p>

			<div
				v-for="(org, i) in flattened"
				:key="getKey(i)"
				class="mb-2"
			>
				<div class="refrow">
					<div class="org-title">
						<ReferenceData
							v-if="getIsReferenceData(i)"
							:schema="schema"
							:path="path"
							:value="org"
							:parent="flattened"
							:property="i"
							:tab="myTab"
							:active-tab="activeTab"
							:depth="depth"
							:typeahead="i===lastReferenceData"
							:hide-results="i!==lastReferenceData"
							v-bind="ui.props.referenceData"
							:es-query-extra="getQueryExtraForLevel(i)"
							:actions="actions"
							:async="i===0"
							@changed="()=>handleChanged(i)"
							@action="(action)=>handleAction(i, action)"
						/>
						<b-container v-else v-b-toggle="domId + '-accordion-' + i">
							<div class="multiselect__tags">
								<span class="multiselect__input">{{ org.name && (org.name.fi || org.name.en) }}

									<font-awesome-icon icon="edit" fixed-width />
								</span>
							</div>
						</b-container>
					</div>
					<div class="delete-button" :class="{invisible: i < flattened.length-1}">
						<delete-button @click="remove(i)" :disabled="false" />
					</div>
					{{ getKey(i) }}
					{{ getIsReferenceData(i) }}

					<div class="edit-button">
						<span
							v-b-toggle="domId + '-accordion-' + i"
							class="px-2 pointer"
						>
							DEBUG
						</span>
					</div>
				</div>

				<b-collapse :id="domId + '-accordion-' + i" accordion="domId + '-accordion'" role="tabpanel">
					<FlatObject
						:schema="schema"
						:path="path"
						:parent="getParentForLevel(i)"
						:value="org"
						:property="i ? refField : property"
						:tab="myTab"
						:activeTab="activeTab"
						:depth="depth"
					/>
				</b-collapse>
			</div>
			<div class="add-level">
				<b-button variant="outline-dark" class="w-100" :disabled="!canAddNew" @click="add()">
					<font-awesome-icon icon="plus" fixed-width /> Add another level
				</b-button>
			</div>
		</div>
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

.add-level {
	margin-left: 15px;
}

.invisible {
	visibility: hidden;
}

.refrow {
	display: flex;
	align-items: center;
	.org-title {
		flex-grow: 1;
		min-height: 40px;
	}
	.edit-button {
		display: flex;
		flex-wrap: nowrap;
		* {
			border-radius: 4px;
		}
	}
}
</style>

<script>
import SchemaBase from './base.vue'
import Wrapper from '@/components/Wrapper.vue'
import DeleteButton from '@/partials/DeleteButton.vue'
import BorderColorMixin from '../mixins/border-color-mixin.js'
import ReferenceData from '../components/ReferenceData.vue'

export default {
	extends: SchemaBase,
	name: 'SelfReferentialObject',
	description: "self-referential object",
	schematype: 'object',
	mixins: [BorderColorMixin],
	components: {
		Wrapper,
		DeleteButton,
		ReferenceData,
	},
	props: {
		'refField': String,
		'levels': Array,
	},
	data: function() {
		return {
			opened: true,
			isReferenceData: [],
			maxKey: 0,
			keys: [],
			actions: [{ label:{ "en": "- Add Organization Manually -" }, action: "add_new" }],
			//flattened: [],
		//	updatingValue: false,
		}
	},
	methods: {
		updateMaxKey() {
			for (let i=0; i<this.keys.length; i++) {
				if (this.maxKey < this.keys[i]) {
					this.maxKey = this.keys[i]
				}
			}
		},
		createNewKey(idx) {
			this.updateMaxKey()
			this.maxKey++
			this.keys[idx] = this.maxKey
		},
		getKey(idx) {
			if (this.keys[idx] === undefined) {
				this.createNewKey(idx)
			}
			return "org-" + this.keys[idx]
		},
		getIsReferenceData(idx) {
			if (this.isReferenceData[idx] === undefined) {
				this.isReferenceData[idx] = idx === 0 || this.isReferenceData[idx-1]
			}
			return this.isReferenceData[idx]
		},
		handleAction(idx, action) {
			if (action.action === "add_new") {
				this.isReferenceData[idx] = false
				//console.log(this.flattened[idx])
				console.log("lastSearch:" + action.lastSearch)
				this.flattened[idx].name.en = action.lastSearch
			}
		},
		async handleChanged(idx) {
			console.log(this.keys)
			this.createNewKey(idx)
			this.updateValue()
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
			this.isReferenceData.push(true)
		},
		remove(level) {
			const arr = [...this.flattened]
			arr.splice(level, 1)
			const obj = this.nest(arr)
			this.$store.commit('replace', {
				p: this.value,
				val: obj,
			})
			this.keys.splice(level, 1)
			this.isReferenceData.splice(level, 1)
		},
		updateValue() {
			this.flattened.x = 0
			const obj = this.nest(this.flattened)
			this.$store.commit('replace', {
				p: this.value,
				val: obj,
			})
		},
		getParentForLevel(level) {
			return level < this.countLevels - 1 ? this.flattened[level + 1] : this.value
		},
		getQueryExtraForLevel(level) {
			const codeUrl = "http://uri.suomi.fi/codelist/fairdata/organization/code/"
			if (level === 0) {
				return ` AND parent_id:""`
			} else if (this.flattened[level-1].identifier && this.flattened[level-1].identifier.startsWith(codeUrl)) {
				const code = this.flattened[level-1].identifier.slice(codeUrl.length)
				return ` AND parent_id:"organization_${code}"`
			} else {
				return ""
			}
		},
		getDescriptionForLevel(level) {
			return this.levels && this.levels[level] ? ': ' + this.levels[level] : ""
		},
	},
	created() {
		this.updateMaxKey()
	},
	computed: {
		canAddNew() {
			const idx = this.lastReferenceData
			return idx <= 0 || this.flattened[idx].identifier
		},
		lastReferenceData() {
			window.k = this
			let last = -1
			for (let i=0; i<this.flattened.length; i++) {
				if (this.getIsReferenceData(i)) {
					last = i
				}
			}
			return last
		},
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
