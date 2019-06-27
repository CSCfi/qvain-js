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
import refdataList from './refdata/list.vue'

// vue plugin
const refdataWidgets = {
	install(Vue, options) {
		if (!options) {
			options = {}
		}
	
		Vue.component(refdataList.name, refdataList)
	},
}

export default refdataWidgets
