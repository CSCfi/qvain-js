import vSchemaBase from '../v-schema-base.vue'
import { esApiSearchClient } from './es.js'
//var debounce = require('lodash.debounce');
import debounce from 'lodash.debounce'

export default {
	extends: vSchemaBase,
	name: 'autocomplete',
	description: "autocomplete keywords from Elastic Search",
	schematype: 'object',
	props: {
		esIndex: {
			default: "reference_data",
			type: String
		},
		esDoctype: {
			default: "keyword",
			type: String
		},
		typeahead: {
			default: true,
			type: Boolean,
		},
		languages: {
			default: () => ["en", "fi", "sv"],
			type: Array,
		},
	},
	data: function() {
		return {
			items: ["apple", "tasty apple", "rotten apple", "pear", "banana", "carrot", "tomato", "spinach", "lettuce", "cabbage", "broccoli", "orange", "kiwi", "beans", "cherry", "onion", "garlic", "peas", "pumpkin"],
			values: [],
			input: "",
			selected: null,
			isOpen: false,
			apiBusy: false,
			apiError: null,
			apiResults: [],
			apiState: null,
			searchLanguage: null,
		}
	},
	methods: {
		onSelected: function() {
			console.log("onSelected triggered", this.selected)
			if (this.selected) {
				//this.isOpen = false
				//this.selected = null
				this.addValue()
			}
		},
		onInput: function(e) {
			// this *might* run also when this.input is set
			console.log("onInput triggered", e, this.isOpen, this.searchLanguage, this.suggestions.length)
			if (this.input.length > 2) {
				this.debouncedGetList(this.input)
				console.log("onInput, musthide?", this.isOpen, this.searchLanguage, this.suggestions.length)
				this.isOpen = this.suggestions.length > 0
			} else {
				this.isOpen = false
				this.apiState = null
			}
			//this.isOpen = this.input.length > 0 && this.suggestions.length > 0
			//if (this.selected) this.selected = null
		},
		onChange: function(e) {
			//console.log("onChange triggered")
			//this.selected = null
		},
		addValue: function() {
			//this.values.push(this.input)
			this.values.push(this.selected)
			this.debouncedGetList.cancel()
			this.isOpen = false
			this.apiState = null
			this.selected = null
			this.input = ""
		},
		hover: function(e) {
			e.target.classList.add('bg-danger')
		},
		unhover: function(e) {
			e.target.classList.remove('bg-danger')
		},
		getList: function(term) {
			// note: in the created hook, we wrap this function with lodash's debounce
			this.apiBusy = true
			this.apiState = null
			var vm = this
			console.log("calling api for", term, "in language", this.searchLanguage)
			esApiSearchClient(this.esIndex, this.esDoctype, `label.${this.searchLanguage}:${term}*`)
			.then(response => {
				vm.error = null
				if (response.data && response.data.hits && response.data.hits.hits) {
					// success
					vm.apiResults = response.data.hits.hits.map(item => item['_source'])
					vm.apiState = true
				} else {
					// no data
					vm.apiResults = []
					vm.apiState = false
				}
			})
			.catch(error => {
				console.log(error)
				vm.apiError = "error calling ElasticSearch API"
				vm.apiState = false
				vm.apiResults = []
				if (error.response && error.response.status) {
					this.apiError += ": " + error.response.status + (error.response.statusText ? "(" + error.response.statusText + ")" : "")
				}
			})
			// "finally() is not a function"
			//.finally(() => {
				vm.apiBusy = false
			//})
		},
	},
	filters: {
		uppercase: function(value) {
			if (!value) return ''
			return value.toString().toUpperCase()
		},
	},
	computed: {
		suggestions: function() {
			if (!this.apiResults) return []

			//return this.items.filter(item => { return item.toLowerCase().indexOf(this.input.toLowerCase()) > -1 })
			return this.apiResults.map(x => ({ text: x.label[this.searchLanguage], value: x }))
		},
		selectSize: function() {
			// there's a bug in the bootstrap-vue select component: if the size is 1, the component changes type; so don't set `select-size` to 1.
			return this.apiResults.length > 8 ? 8 : this.apiResults.length < 2 ? 2 : this.apiResults.length
		},
	},
	watch: {
		apiResults: function(results) {
			this.isOpen = results.length > 0
		},
	},
	created() {
		this.searchLanguage = this.languages.length ? this.languages[0] : "en"
		this.debouncedGetList = debounce(this.getList, 300)
	}
}