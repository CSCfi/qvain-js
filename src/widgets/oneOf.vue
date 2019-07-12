<!-- ADD_LICENSE_HEADER -->
<template>
	<wrapper v-if="!single" :id="property + '_oneOf'" :wrapped="typeof wrapped === 'undefined' ? !inArray : wrapped">
		<div v-if="chosen === null" class="conditional-wrapper">
			<b-button-group>
				<b-button
					v-for="(sub, i) in schema['oneOf']"
					variant="primary"
					:key="'oneOfSel' + i"
					@click="setChosen(i)">
					{{ sub['title'] || '#'+i }}
				</b-button>
			</b-button-group>
		</div>
		<TabSelector
			v-if="chosen !== null"
			:schema="schemaForChosen"
			:path="newPath('oneOf/' + chosen)"
			:value="value"
			:parent="parent"
			:property="property"
			:tab="myTab"
			:activeTab="activeTab"
			:depth="depth"
			:key="'oneOf-'+chosen" />
	</wrapper>

	<record-field v-else :required="isRequired" :wrapped="wrapped">
		<title-component slot="title" :title="uiLabel" />
		<small slot="help" class="text-muted">
			{{ uiDescription }}
		</small>
		<div slot="input">
			<div class="conditional-wrapper single">
				<b-button-group>
					<b-button
						v-for="(sub, i) in schema['oneOf']"
						:key="'oneOfSel' + i"
						:class="{active: chosen === i}"
						variant="primary"
						@click="setChosen(i)">
						{{ sub['title'] || '#'+i }}
					</b-button>
				</b-button-group>
			</div>
			<TabSelector
				v-if="chosen !== null"
				:schema="schemaForChosen"
				:path="newPath('oneOf/' + chosen)"
				:value="value"
				:parent="parent"
				:property="property"
				:tab="myTab"
				:activeTab="activeTab"
				:depth="depth"
				:key="'oneOf-'+chosen" />
		</div>
	</record-field>
</template>

<style lang="scss" scoped>
.conditional-wrapper {
	width: 100%;
	display: inline-flex;
	justify-content: left;
	
	&.single {
		margin-top: 0.5rem;
		margin-bottom: 0.5rem;
	}
}
</style>

<script>
import Wrapper from '@/components/Wrapper.vue'
import RecordField from '@/composites/RecordField.vue'
import TitleComponent from '@/partials/Title.vue'
import vSchemaBase from '@/widgets/base.vue'

// TODO: find a more generic way to detect relevant oneOf schema
const IDENTIFYING_FIELD = '@type'

export default {
	name: 'SchemaOneof',
	extends: vSchemaBase,
	description: "generic oneof",
	schematype: 'any',
	components: {
		Wrapper,
		RecordField,
		TitleComponent,
	},
	props: {
		wrapped: {
			type: Boolean,
			required: false,
		},
		oneOfFunc: {
			type: Function,
			required: false,
			default: null,
		},
		single: {
			type: Boolean,
			required: false,
			default: false,
		},
	},
	data() {
		return {
			chosen: null,
		}
	},
	methods: {
		setChosen(i) {
			// don't reset the data if the same option is selected again as the watcher won't trigger
			if (this.chosen === i) return

			// throw away data on type switch to avoid collisions and irrelevant stray fields
			this.$store.commit('updateValue', {
				p: this.parent,
				prop: this.property,
				val: undefined,
			})
			this.chosen = i
		},
	},
	computed: {
		schemaForChosen() {
			return this.chosen !== null ? this.schema['oneOf'][this.chosen] : {}
		},
		possibleTypes() {
			return this.schema['oneOf'].map(sub => sub['title'])
		},
		currentType() {
			const valueType = this.value && this.value[IDENTIFYING_FIELD]
			const uiSchemaType = this.oneOfFunc && this.value && this.oneOfFunc(this.value)
			if (!(valueType === null || typeof valueType === 'undefined')) {
				return valueType
			} else if (!(uiSchemaType === null || typeof uiSchemaType === 'undefined')) {
				return uiSchemaType
			}

			return null
		},
	},
	watch: {
		currentType: {
			immediate: true,
			handler() {
				if (typeof this.currentType === 'undefined' || this.currentType === null) return;
				let index = isNaN(this.currentType) ? this.possibleTypes.indexOf(this.currentType) : this.currentType
				this.chosen = index >= 0 ? index : null;
			},
		},
	},
}
</script>
