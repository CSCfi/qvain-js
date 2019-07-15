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
import { foreachSchema } from './lib/foreach_schema.js'
//import jsonpointer from 'json-pointer'

function schemaToTabs(schema, ui, tabs) {
	let curTab = "0"
	foreachSchema(schema, function(path) {
		console.log("path:", path, "tab:", curTab)
		let newTab = path in ui && 'tab' in ui[path] ? ui[path].tab : undefined
		if (newTab !== undefined && newTab !== curTab) {
			console.log("new tab:", newTab)
			tabs.push(newTab)
		}
	})
}

function schemaToTabs2(schema, ui, tabs) {
	for (let path in ui) {
		let newTab = ui[path]['tab']
		if (newTab !== undefined && newTab !== "0") {
			console.log("new tab:", newTab)
			tabs.push(newTab)
		}
	}
}

export { schemaToTabs, schemaToTabs2 }
