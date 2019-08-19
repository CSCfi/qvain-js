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
					<div class="org-label">
						{{ new Array(i*4+1).join("&nbsp;&nbsp;") }}
					</div>

					<div
						v-if="getIsReferenceData(i)"
						class="org-title"
					>
						<ReferenceData
							:schema="schema"
							:path="path"
							:value="org"
							:parent="flattened"
							:property="i"
							:tab="myTab"
							:active-tab="activeTab"
							:depth="depth"
							:disabled="i!==flattened.length-1"
							v-bind="ui.props.referenceData"
							:es-query-extra="getQueryExtraForLevel(i)"
							:placeholder="getPlaceholderForLevel(i)"
							:actions="actions"
							:disable-internal-search="true"
							@changed="()=>handleChanged(i)"
							@action="(action)=>handleAction(i, action)"
						/>
					</div>

					<div
						v-else
						class="org-title pointer"
					>
						<b-container class="toggle-org" v-b-toggle="domId + '-accordion-' + i">
							<div class="multiselect__tags">
								<span class="multiselect__input">

									<font-awesome-icon class="edit-icon" icon="edit" fixed-width />&nbsp;
									<span v-if="getOrgName(org)">{{ getOrgName(org) }}</span>
									<span v-else class="placeholder">{{ getDescriptionForLevel(i) }}</span>
								</span>
							</div>
						</b-container>
					</div>

					<div class="delete-button" :class="{invisible: i < flattened.length-1}">
						<delete-button @click="remove(i)" :disabled="false" />
					</div>
				</div>

				<b-collapse
					v-if="!getIsReferenceData(i)"
					:id="domId + '-accordion-' + i"
					accordion="domId + '-accordion'"
					role="tabpanel"
				>
					<FlatObject
						:schema="schema"
						:path="path"
						:parent="getParentForLevel(i)"
						:value="org"
						:property="i ? refField : property"
						:tab="myTab"
						:active-tab="activeTab"
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
.toggle-org:not(.collapsed) {
	.multiselect__tags, .multiselect__input {
		background-color: #6c757d;
		color: #ffffff;
	}
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
	.placeholder {
		color: #aaa;
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

<style lang="scss">
.org-title .multiselect--disabled {
	opacity: 1;
}
</style>


<script>
import SchemaBase from '@/widgets/base.vue'
import Wrapper from '@/components/Wrapper.vue'
import DeleteButton from '@/partials/DeleteButton.vue'
import BorderColorMixin from '../mixins/border-color-mixin.js'
import ReferenceData from '../components/ReferenceData.vue'

const referenceIdentifierPrefix = "http://uri.suomi.fi/codelist/fairdata/organization/code/"

export default {
	name: 'Organization',
	components: {
		Wrapper,
		DeleteButton,
		ReferenceData,
	},
	extends: SchemaBase,
	description: "organization",
	schematype: 'object',
	mixins: [BorderColorMixin],
	props: {
		'refField': String,
		'levels': Array,
	},
	data: function() {
		return {
			opened: true,
			isReferenceData: [],
			keys: [],
			actions: [{ label:{ "en": "- Add Organization Manually -" }, action: "set_manual" }],
		}
	},
	methods: {
		getOrgName(org) {
			return this.$store.getters.getStringFromMultiLanguage(org.name)
		},
		getKey(idx, min) {
			if (this.keys[idx] === undefined) {
				this.$set(this.keys, idx, Math.max(min || 0, ...this.keys) + 1)
			}
			return "org-" + this.keys[idx]
		},
		getIsReferenceData(idx) {
			// Initialize organization as a ReferenceData organization if
			// - all the previous levels use ReferenceData and
			//   - identifier matches referenceIdentifierPrefix, or
			//   - all fields for the organization are empty
			if (this.isReferenceData[idx] === undefined) {
				const previousIsReferenceData = idx === 0 || this.getIsReferenceData(idx-1)
				this.$set(this.isReferenceData, idx, !!(previousIsReferenceData
					&& ((this.flattened[idx].identifier && this.flattened[idx].identifier.startsWith(referenceIdentifierPrefix))
					|| !this.hasValues(this.flattened[idx]))))
			}
			return this.isReferenceData[idx]
		},
		hasValues(data) {
			function recurse(schema, data) {
				if (!data) {
					return false
				}
				if (schema.type === 'object') {
					for (const prop in schema.properties) {
						if (prop != "@type") {
							if (recurse(schema.properties[prop], data[prop])) {
								return true
							}
						}
					}
					return false
				}

				return true
			}
			return recurse(this.schema, data)
		},
		initializeFields(data) {
			// Ensures the organization has all the fields from the schema so
			// - FlatObject doesn't fail because of missing fields
			// - Objects from ReferenceData get the correct @type
			// If data is set, it is modified in-place and existing values are kept.
			if (data === undefined) data = {}

			const recurse = (schema, data) => {
				let val

				// read const from schema
				if (data === undefined && schema.enum && schema.enum.length === 1) {
					return schema.enum[0]
				}

				switch (schema['type']) {
				case 'object':
					if (!data) {
						val = {}
					} else {
						val = data
					}
					for (const prop in schema.properties) {
						if (prop === "is_part_of") {
							continue
						}
						this.$set(val, prop, recurse(schema.properties[prop], val[prop]))
					}
					break
				case 'array':
					val = data || []
					break
				case 'null':
					val = data || null
					break
				default:
					val = data || undefined
				}
				return val
			}
			return recurse(this.schema, data)
		},

		async handleAction(idx, action) {
			if (action.action === "set_manual") {
				this.$set(this.isReferenceData, idx, false)
				this.initializeFields(this.flattened[idx])
				this.$set(this.flattened[idx].name, this.$store.state.languagePriority[0], action.lastSearch)
				await this.$nextTick() // wait for the new manual org to be created
				this.$root.$emit('bv::toggle::collapse', this.domId + '-accordion-' + idx)
			}
		},
		async handleChanged(idx) {
			this.initializeFields(this.flattened[idx])
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
		async add() {
			const isReference = this.lastReferenceData === this.flattened.length-1

			const arr = [...this.flattened]
			arr.push(this.initializeFields())
			const obj = this.nest(arr)
			this.$store.commit('replace', {
				p: this.value,
				val: obj,
			})
			if (isReference) {
				this.isReferenceData.push(true)
			} else {
				this.isReferenceData.push(false)
				await this.$nextTick()
				this.$root.$emit('bv::toggle::collapse', this.domId + '-accordion-' + (this.flattened.length-1))
			}
		},
		remove(level) {
			const arr = [...this.flattened]
			arr.splice(level, 1)
			const obj = this.nest(arr)
			this.$store.commit('replace', {
				p: this.value,
				val: obj,
			})
			this.isReferenceData.splice(level, 1)
			const oldKey = this.keys.splice(level, 1)[0]
			if (arr.length === 0) {
				this.$set(this.keys, 0, oldKey+1)
			}
		},
		updateValue() {
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
			const last = this.flattened[level-1]
			if (level === 0) {
				return ` AND parent_id:""`
			} else if (last.identifier && last.identifier.startsWith(referenceIdentifierPrefix)) {
				const code = last.identifier.slice(referenceIdentifierPrefix.length)
				return ` AND parent_id:"organization_${code}"`
			} else {
				return ""
			}
		},
		getDescriptionForLevel(level) {
			return this.levels && this.levels[level] ? this.levels[level] : ""
		},
		getPlaceholderForLevel(level) {
			return "Type to search for " + this.getDescriptionForLevel(level)
		},
	},
	computed: {
		canAddNew() {
			if (this.lastReferenceData === this.flattened.length - 1) {
				return this.lastReferenceData < 0 || this.flattened[this.lastReferenceData].identifier
			} else {
				return true
			}
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
