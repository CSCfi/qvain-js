<template>
	<wrapper :wrapped="typeof wrapped === 'undefined' ? !inArray : wrapped">
		<div v-if="chosen === null" class="conditional-wrapper">
			<b-dropdown class="m-2" text="Choose type" variant="primary">
				<b-dropdown-item v-for="(sub, i) in schema['oneOf']"
					:key="'oneOfSel' + i"
					@click="setChosen(i)">
					{{ sub['title'] || '#'+i }}
				</b-dropdown-item>
			</b-dropdown>
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
</template>

<style lang="scss" scoped>
.conditional-wrapper {
	width: 100%;
	display: inline-flex;
	justify-content: center;
}
</style>


<script>
import Wrapper from '@/components/Wrapper.vue'
import vSchemaBase from '@/widgets/base.vue'

// TODO: find a more generic way to detect relevant oneOf schema
const IDENTIFYING_FIELD = '@type'

export default {
	extends: vSchemaBase,
	name: 'schema-oneof',
	description: "generic oneof",
	schematype: 'any',
	components: {
		Wrapper,
	},
	props: {
		wrapped: {
			type: Boolean,
			required: false
		},
		oneOfFunc: {
			type: Function,
			required: false
		}
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
			const uiSchemaType = (this.oneOfFunc && this.value && this.oneOfFunc(this.value))
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
	created() {
	},
}
</script>
