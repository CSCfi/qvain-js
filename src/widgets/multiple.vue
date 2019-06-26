<template>
	<wrapper :wrapped="wrapped">
		<TabSelector
			:required="true"
			:schema="schema.oneOf[0]"
			:path="newPath('oneOf/' + 0)"
			:value="value[property]"
			:parent="value"
			:property="propName"
			:tab="myTab"
			:activeTab="activeTab"
			:depth="depth" />
		<!--
		<TabSelector
			:required="true"
			:schema="schema.oneOf[1]"
			:path="newPath('oneOf/' + 1)"
			:value="value[property]"
			:parent="value"
			:property="propName"
			:tab="myTab"
			:activeTab="activeTab"
			:depth="depth" />
		-->
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
}
</script>
