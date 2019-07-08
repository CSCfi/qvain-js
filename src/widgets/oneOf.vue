<!-- ADD_LICENSE_HEADER -->
<template>
	<wrapper :id="property + '_oneOf'" :wrapped="!inArray">
		<template v-if="!both">
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
			<b-textarea v-if="false" :rows="15" :value="JSON.stringify(schemaForChosen, null, 2)"></b-textarea>
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
		</template>
		<template v-else>
			<div v-for="propName in schema.oneOf.map(obj => obj.title)" :key="propName" style="padding-top: 12px; padding-bottom: 12px;">
				<TabSelector
					:required="(schema.required || []).includes(propName)"
					:schema="schema.oneOf.find(item => item.title === propName)"
					:path="newPath('oneOf/' + propName)"
					:value="value[propName]"
					:parent="value"
					:property="propName"
					:tab="myTab"
					:activeTab="activeTab"
					:depth="depth"
					:key="propName" />
			</div>
		</template>
	</wrapper>
</template>

<style lang="scss" scoped>
.conditional-wrapper {
	width: 100%;
	display: inline-flex;
	justify-content: left;
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
		both: {
			type: Boolean,
			default: false
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
			return this.value && this.value[IDENTIFYING_FIELD] || null
		},
	},
	watch: {
		currentType: {
			immediate: true,
			handler(val) {
				if (!val) return;
				let index = this.possibleTypes.indexOf(this.currentType);
				this.chosen = index >= 0 ? index : null;
			},
		},
	},
	created() {
	},
}
</script>
