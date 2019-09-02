/*
This file is part of Qvain -project.

Author(s):
	Juhapekka Piiroinen <jp@1337.fi>
	Wouter Van Hemel <wouter.van.hemel@helsinki.fi>

License: GPLv3

See LICENSE file for more information.
Copyright (C) 2019 Ministry of Culture and Education, Finland.
All Rights Reserved.
*/
import keysWithOrder from '@/lib/keysWithOrder.js'

export default {
	name: "skip",
	functional: true,
	render: function (createElement, context) {
		if (!('properties' in context.props.schema)) {
			return undefined
		}

		let keys = context.parent.$store.state.hints[context.props.path] && typeof context.parent.$store.state.hints[context.props.path]['order'] === 'object' ? keysWithOrder(context.props.schema['properties'], context.parent.$store.state.hints[context.props.path]['order']) : Object.keys(context.props.schema.properties)

		return createElement(
			'div',
			{ class: "q-skipped" },
			keys.map(function(key) {
				let myPath = context.props.path + '/properties/' + key
				let uiTab = context.parent.$store.state.hints[myPath] && context.parent.$store.state.hints[myPath]['tab']
				let myTab = uiTab != null ? uiTab : context.props.tab
				let inSameTab = context.props.tab == myTab

				let child = createElement('TabSelector', {
					props: {
						schema: context.props.schema.properties[key],
						path: myPath,
						value: typeof context.props.value === 'object' ? context.props.value[key] : undefined,
						parent: context.props.value,
						property: key,
						tab: myTab,
						activeTab: context.props.activeTab,
						required: (context.props.schema.required || []).includes(key),
					},
					// don't reuse VNode
					key: key,
				})

				if (myTab === context.props.activeTab) {
					return createElement('b-card',
						{
							props: { 'no-body': true },
							class: "border-0 my-3 q-skipped-added-card " + (inSameTab ? "q-insametab" : ("q-notinsametab-" + myTab + "-" + uiTab + "-" + context.props.tab)),
						},
						[ child ],
					)
				}
				return child

			})
		)
	},
	props: ['schema', 'path', 'value', 'parent', 'property', 'tab', 'activeTab', 'required'],
	components: {
		'TabSelector': require('./TabSelector.vue'),
	},
}
