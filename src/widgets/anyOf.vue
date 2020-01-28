<!-- ADD_LICENSE_HEADER -->
<script>
export default {
	name: 'SchemaAnyof',
	description: "generic anyof",
	schematype: 'any',
	functional: true,
	render(createElement, { props, children }) {
		const attrs = {
			...props,
			choiceProp: "anyOf",
		}
		return createElement('schema-choice', { attrs }, children)
	},
}
</script>
