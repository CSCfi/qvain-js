<!-- ADD_LICENSE_HEADER -->
<template>
	<div>
		<!-- (allof component) -->
		<h2 :class="{ 'metainfo': !schema.title, 'missing': !schema.title }">
			{{ schema.title || "missing title" }}
		</h2>
		
		<p v-if="schema.description">
			{{ schema.description }}
		</p>
		allOf: {{ schemaState }}

		<div
			v-for="(sub, i) in schema['allOf']"
			:key="sub"
		>
			{{ sub['type'] }} {{ i }}

			<TabSelector
				:schema="sub"
				:path="newPath('allOf/' + i)"
				:value="value"
				:parent="parent"
				:property="property"
				:tab="myTab"
				:active-tab="activeTab"
			/>
		</div>

		<TabSelector
			:schema="merged"
			:path="newPath('allOf')"
			:value="value"
			:parent="parent"
			:property="property"
			:tab="myTab"
			:active-tab="activeTab"
		/>
	</div>
</template>

<script>
import vSchemaBase from './base.vue'

export default {
	name: 'SchemaAllof',
	extends: vSchemaBase,
	description: "generic allof",
	schematype: '',
	computed: {
		merged: function() {
			if (typeof this.schema.allOf !== 'object') return {}
			return Object.assign({}, ...this.schema.allOf)
		},
	},
	created() {
	},
	methods: {
	},
}
</script>
