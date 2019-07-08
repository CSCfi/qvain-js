/* ADD_LICENSE_HEADER */
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
