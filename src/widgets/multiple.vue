<template>
	<wrapper :wrapped="wrapped">
		<TabSelector
			:required="true"
			:schema="schema.oneOf[0]"
			:path="newPath('oneOf/' + 0)"
			:value="parent[property]"
			:parent="parent"
			:property="property"
			:tab="myTab"
			:activeTab="activeTab"
			:depth="depth" />
		<TabSelector
			:required="true"
			:schema="schema.oneOf[1]"
			:path="newPath('oneOf/' + 1)"
			:value="parent[property]"
			:parent="parent"
			:property="property"
			:tab="myTab"
			:activeTab="activeTab"
			:depth="depth" />
	</wrapper>
</template>

<script>
import Wrapper from '@/components/Wrapper.vue'
import vSchemaBase from '@/widgets/base.vue'

// TODO: find a more generic way to detect relevant oneOf schema
const IDENTIFYING_FIELD = '@type'

export default {
	extends: vSchemaBase,
	name: 'multiple',
	description: "generic oneof",
	schematype: 'any',
	components: {
		Wrapper,
	},
	props: {
		wrapped: {
			type: Boolean,
			required: false
		}
	},
	created() {
		console.log('created value', this.value)
		console.log('created parent', this.parent)
	}
}
</script>
