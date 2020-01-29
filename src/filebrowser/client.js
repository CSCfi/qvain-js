/* ADD_LICENSE_HEADER */
import axios from 'axios'
import { cacheAdapterEnhancer, throttleAdapterEnhancer } from 'axios-extensions'

const fileAPI = axios.create({
	adapter: throttleAdapterEnhancer(cacheAdapterEnhancer(axios.defaults.adapter)),
	baseURL: process.env.VUE_APP_METAX_FILEAPI_URL || '/api/proxy',
	timeout: 10000,
	responseType: 'json',
})

export default fileAPI
