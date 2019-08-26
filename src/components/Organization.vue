<!-- ADD_LICENSE_HEADER -->
<template>
	<wrapper :wrapped="false" :style="listItemStyle(depth)">
		<h3>{{ uiTitle }}
			<span v-if="schema.required" class="require-badge">
				<b-badge variant="danger">REQUIRED</b-badge>
			</span>
		</h3>
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
						{{ "&nbsp;".repeat(i*8) }}
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
							:disabled="i!==lastLevel"
							v-bind="ui.props.referenceData"
							:es-query-extra="getQueryExtraForLevel(i)"
							:placeholder="getPlaceholderForLevel(i)"
							:actions="actions"
							:disable-internal-search="true"
							:preserved-fields="hoistedFields"
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

					<div class="delete-button" :class="{invisible: i < lastLevel}">
						<delete-button @click="remove(i)" />
					</div>
				</div>

				<b-collapse
					v-if="!getIsReferenceData(i)"
					:id="domId + '-accordion-' + i"
					:accordion="domId + '-accordion'"
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
						:skipped="hoistedFields"
					/>
				</b-collapse>
			</div>
			<div class="add-level">
				<b-button
					variant="outline-dark"
					class="mb-2 w-100"
					:disabled="!canAddNew"
					@click="add()"
				>
					<font-awesome-icon icon="plus" fixed-width /> Add another level
				</b-button>
			</div>
			<div
				v-for="propName in hoistedFields"
				:key="getKey(lastLevel) + '-' + propName"
			>
				<TabSelector
					:key="propName"
					:schema="schema['properties'][propName]"
					:required="(schema.required || []).includes(propName)"
					:path="newPath('properties/' + propName)"
					:value="flattened[lastLevel][propName]"
					:parent="flattened[lastLevel]"
					:property="propName"
					:tab="myTab"
					:active-tab="activeTab"
					:depth="depth"
				/>
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

.require-badge {
	font-size: 12pt;
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
		'refField': {
			type: String,
			required: true,
		},
		'levels': {
			type: Array,
			required: false,
			default: () => [ "Organization", "Faculty or Division", "Department or Unit" ],
		},
		'hoistedFields': { // instead of showing these fields for each level, show only once per hierarchy
			type: Array,
			required: false,
			default: () => [],
		},
	},
	data: function() {
		return {
			opened: true,
			isReferenceData: [],
			keys: [],
			actions: [{ label:{ "en": "- Add Organization Manually -" }, action: "set_manual" }],
		}
	},
	created() {
		for (let i=0; i<this.flattened.length; i++) {
			this.initializeFields(this.flattened[i])
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
		hasReferenceIdentifier(org) {
			return !!(org.identifier && org.identifier.startsWith(referenceIdentifierPrefix))
		},
		getIsReferenceData(idx) {
			// Initialize organization as a ReferenceData organization if
			// - all the previous levels use ReferenceData and
			//   - identifier matches referenceIdentifierPrefix, or
			//   - all fields for the organization are empty and this is the last organization level
			if (this.isReferenceData[idx] === undefined) {
				const current = this.flattened[idx]
				const maybe = idx === 0 || this.getIsReferenceData(idx-1)
				const is = maybe
					&& (this.hasReferenceIdentifier(current)
					|| (!this.hasValues(current) && idx === this.lastLevel))
				this.$set(this.isReferenceData, idx, !!is)
			}
			return this.isReferenceData[idx]
		},
		hasValues(data) {
			function recurse(schema, data) {
				if (!data || data.length === 0) {
					return false
				}
				if (schema && schema.type === 'object') {
					const properties = schema.properties || {}
					for (const prop in data) {
						if (prop !== "@type") {
							if (recurse(properties[prop], data[prop])) {
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
				await this.$nextTick() // wait for the new dom elements to be created
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
			const isReference = this.lastReferenceData === this.lastLevel

			const arr = [...this.flattened]
			const created = this.initializeFields()

			// move hoistedFields value to the new level by swapping
			this.hoistedFields.forEach((field) => {
				[ created[field], arr[arr.length-1][field] ] = [ arr[arr.length-1][field], created[field] ]
			})
			arr.push(created)

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
				this.$root.$emit('bv::toggle::collapse', this.domId + '-accordion-' + this.lastLevel)
			}
		},
		remove(level) {
			const arr = [...this.flattened]

			if (level > 0) {
				// before removing, merge hoistedFields with the level below
				this.hoistedFields.forEach((field) => {
					arr[level-1][field] = Array.from(new Set([ ...(arr[level-1][field] || []), ...(arr[level][field] || []) ]))
				})
			}

			arr.splice(level, 1)
			this.isReferenceData.splice(level, 1)
			const oldKey = this.keys.splice(level, 1)[0]
			if (arr.length === 0) { // make sure there is at least one organization in the hierarchy
				this.$set(this.keys, 0, oldKey+1)
				arr.push(this.initializeFields())
			}

			const obj = this.nest(arr)
			this.$store.commit('replace', {
				p: this.value,
				val: obj,
			})
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
			return "Select " + this.getDescriptionForLevel(level)
		},
	},
	computed: {
		canAddNew() {
			if (this.lastReferenceData === this.lastLevel) {
				return this.lastReferenceData < 0 || this.flattened[this.lastReferenceData].identifier
			} else {
				return true
			}
		},
		lastReferenceData() {
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
		lastLevel() {
			return this.flattened.length - 1
		},
	},
}
</script>
