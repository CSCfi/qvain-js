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
import widgetGoogleMaps from './extra/widget-googlemaps.vue'

// vue plugin
const extraWidgets = {
	install(Vue, options) {
		if (!options) {
			options = {}
		}
	
		Vue.component(widgetGoogleMaps.name, widgetGoogleMaps)
	},
}

export default extraWidgets
