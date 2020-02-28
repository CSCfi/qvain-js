<!--
This file is part of Qvain -project.

Author(s):
	Jori Niemi <3295718+tahme@users.noreply.github.com>
	Wouter Van Hemel <wouter.van.hemel@helsinki.fi>

License: GPLv3

See LICENSE file for more information.
Copyright (C) 2019 Ministry of Culture and Education, Finland.
All Rights Reserved.
-->
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
