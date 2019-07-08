/* ADD_LICENSE_HEADER */
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
