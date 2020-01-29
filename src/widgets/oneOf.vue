<!-- ADD_LICENSE_HEADER -->
<script>
export default {
	name: 'SchemaOneof',
	description: "generic oneof",
	schematype: 'any',
	functional: true,
	render(createElement, { props, children }) {
		const attrs = {
			...props,
			choiceProp: "oneOf",
		}
		return createElement('schema-choice', { attrs }, children)
	},
}
</script>
