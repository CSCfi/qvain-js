/*
This file is part of Qvain -project.

Author(s):
	Juhapekka Piiroinen <jp@1337.fi>
	Wouter Van Hemel <wouter.van.hemel@helsinki.fi>
	Kauhia <Kauhia@users.noreply.github.com>
	Jori Niemi <3295718+tahme@users.noreply.github.com>
	Shreyas Deshpande <31839853+ShreyasDeshpande@users.noreply.github.com>
	Aaron Hakala <aaron.hakala@metropolia.fi>
	Eemeli Kouhia <eemeli.kouhia@gofore.com>

License: GPLv3

See LICENSE file for more information.
Copyright (C) 2019 Ministry of Culture and Education, Finland.
All Rights Reserved.
*/
import Vue from 'vue'
import Vuex from 'vuex'
import cloneWithPrune from './lib/cloneWithPrune.js'
import getDotted from 'lodash.get'
import hasDotted from 'lodash.has'
import vuePointer from '../vendor/json-pointer/index.js'
import axios from 'axios'

Vue.use(Vuex)

const metaxAPI = axios.create({
	baseURL: process.env.VUE_APP_METAX_API_URL,
	timeout: 10000,
	responseType: 'json',
})

export default new Vuex.Store({
	state: {
		record: undefined,
		metaxRecord: null, // the published version of the current record
		metaxRecordError: null,
		schema: {},
		hints: {},
		metadata: {},
		deletedItems: { 'files': {}, 'directories': {}}, // files or directories that no longer exist
		languages: { 'fi':true, 'en':true, 'sv':true },
		languagePriority: [ 'en', 'fi', 'sv' ], // order in which multilanguage elements are searched when single value is needed
		UI_VALID_KEYWORDS: [
			'widget',
			'option',
			'label',
			'help',
			'placeholder',
			'tab',
		],
		vState: {},
		datasetsView: {
			currentPage: 1,
			perPage: 20,
			datasetList: null,
			showState: 'all',
			filterString: '',
			filteredCount: null,
			sortBy: null,
			sortDesc: false,
		},
		stats: {
			total: 0,
			pass: 0,
			fail: 0,
			q: 0,
		},
	},
	mutations: {
		setMetadata(state, payload) {
			state.metadata = Object.assign({}, state.metadata, payload)
		},
		resetMetadata(state) {
			// reset to default values
			state.metadata = {
				cumulativeState: 0,
			}
		},
		loadData(state, record) {
			Vue.set(state, 'record', record)
		},
		mergeData(state, payload) {
			for (let key in payload) {
				Vue.set(state.record, key, payload[key])
			}
		},
		loadSchema(state, schema) {
			Vue.set(state, 'schema', schema)
		},
		changeSchema(state) {
			Vue.delete(state.schema.properties, 'creator')
		},
		loadHints(state, hints) {
			Vue.set(state, 'hints', hints)
		},
		setHints(state, payload) {
			Object.keys(payload.hints).forEach((key) => (payload.hints[key] == null || payload.hints[key] == undefined) && delete payload.hints[key])
			Vue.set(state.hints, payload.path, payload.hints)
		},
		setHint(state, payload) {
			Vue.set(state.hints, payload.path, payload.hint)
		},
		delHints(state, payload) {
			Vue.delete(state.hints[payload.path])
		},
		initValue(state, payload, defaultValue) {
			// set default value for license if ida schema
			const isNewDataset = typeof state.metadata.id === 'undefined'
			const isIDA = state.metadata.schemaId === 'metax-ida'
			//const shouldAddDefault = 'access_type' in payload.p
			//const isLicenseField = payload.prop === 'license'
			// move this to tabselector

			if (isNewDataset && isIDA && defaultValue) {
				Vue.set(payload.p, payload.prop, defaultValue)
			} else {
				Vue.set(payload.p, payload.prop, payload.val)
			}
		},
		updateValue(state, payload) {
			Vue.set(payload.p, payload.prop, payload.val)
			Vue.nextTick(() => {
				if (payload.val === '' && Array.isArray(payload.p)) { // don't remove key for objects
					Vue.delete(payload.p, payload.prop)
				}
			})
		},
		updateArrayValue(state, payload) {
			const index = payload.p[payload.prop].findIndex(x => x[payload.search.field] === payload.search.value)
			Vue.set(payload.p[payload.prop], index, payload.val)
		},
		replace(state, payload) {
			// clear payload.p, assign values from payload.val
			for (let key in payload.p) {
				Vue.delete(payload.p, key)
			}
			for (let key in payload.val) {
				Vue.set(payload.p, key, payload.val[key])
			}
		},
		pushValue(state, payload) {
			payload.p[payload.prop].push(payload.val)
		},
		pushMultiple(state, payload) {
			payload.p[payload.prop].push(...payload.val)
		},
		popValue(state, payload) {
			payload.p[payload.prop].pop()
		},
		removeValue(state, payload) {
			const index = payload.p[payload.prop].findIndex(single => single.identifier === payload.val)
			payload.p[payload.prop].splice(index, 1)
		},
		deleteArrayValue(state, { parent, property, index }) {
			Vue.delete(parent[property], index)
		},
		deleteValue(state, payload) {
			Vue.delete(payload.p, payload.prop)
		},
		addProp(state, payload) {
			Vue.set(payload.val, payload.prop, undefined)
		},
		setState(state, payload) {
			Vue.set(state.vState, payload.path, {
				v: payload.v,
				e: payload.e,
			})
		},
		resetState(state) {
			Vue.set(state, 'vState', {})
		},
		updateStats(state, payload) {
			state.stats = payload
		},
		initStateFor(state, path) {
			if (!state.vState[path]) {
				Vue.set(state.vState, path, { e: [], v: null })
			}
		},
		cleanStateFor(state, path) {
			Vue.delete(state.vState, path)
		},
		setLanguages(state, payload) {
			state.languages = Object.assign({}, state.languages, payload)
		},
		updateDatasetsView(state, payload) {
			for (const key in payload) {
				Vue.set(state.datasetsView, key, payload[key])
			}
		},
		setDeletedItem(state, payload) {
			Vue.set(state.deletedItems[payload.category], payload.identifier, payload.val)
		},
		clearMetaxRecord(state) {
			Vue.set(state, 'metaxRecord', null)
			Vue.set(state, 'metaxRecordError', null)
		},
		setMetaxRecord(state, payload) {
			Vue.set(state, 'metaxRecord', payload)
		},
		setMetaxRecordError(state, payload) {
			Vue.set(state, 'metaxRecordError', payload)
		},
	},
	getters: {
		// prunedDataset returns a deep-clone of the dataset discarding empty leaves
		prunedDataset: (state) => {
			return cloneWithPrune(state.record, [], [ "", undefined ])
		},
		// getState returns the validation state for a given path
		getState: (state) => (path) => {
			return state.vState[path]
		},
		// uiForPath returns the UI overrides for the given path (if any)
		uiForPath: (state) => (path) => {
			const split = path.split('/')
			const searchPathOneOfSensitive = split
				.filter(key => key !== '')
				.map((key, index, array) => {
					if (isNaN(key)) {
						return key
					} else if (array[index - 1] === 'oneOf' || array[index - 1] === 'anyOf') {
						return key
					} else {
						return '*'
					}
				}).join('/')

			const searchPathNoNumber = split
				.filter(key => key !== '')
				.map((key, index, array) => {
					if (isNaN(key)) {
						return key
					} else {
						return '*'
					}
				}).join('/')

			const hints = state.hints['/' + searchPathOneOfSensitive] ||
				state.hints['/' + searchPathNoNumber] ||
				state.hints['**/' + split[split.length-1]] || {}
			return hints
		},
		// uiValidKeywordsList returns a static array of valid keywords
		uiValidKeywordsList: (state) => {
			//Object.keys(state.UI_VALID_KEYWORDS)
			return state.UI_VALID_KEYWORDS
		},
		// uiValidKeywordsSet returns a static set of valid keywords
		uiValidKeywordsSet: (state) => {
			return new Set(state.UI_VALID_KEYWORDS)
		},
		// hasPath checks if the given json-pointer path exists
		hasPath: (state) => (path) => {
			return vuePointer.has(state.record, path)
		},
		// getPath gets the value for the given json-pointer path
		getPath: (state) => (path) => {
			return vuePointer.get(state.record, path)
		},
		// hasDataPath checks if the given dotted path exists (see: lodash.has)
		hasDataPath: (state) => (path) => {
			// _.has(object, path)
			return hasDotted(state.record, path)
		},
		// getDataPath gets the value for the given dotted path (see: lodash.get)
		getDataPath: (state) => (path) => {
			// _.get(object, path, [defaultValue])
			return getDotted(state.record, path)
		},
		// getTitle returns the title
		getTitle: (state, getters) => {
			if (!state.record) {
				return ""
			}
			return getters.getStringFromMultiLanguage(state.record.title)
		},
		// getStringFromMultiLanguage returns a single string from multilang object based on languagePriority
		getStringFromMultiLanguage: (state) => (multi) => {
			if (!multi) {
				return null
			}
			for (let i=0; i<state.languagePriority.length; i++) {
				const lang = state.languagePriority[i]
				if (multi[lang]) {
					return multi[lang]
				}
			}
			return Object.values(multi)[0] || null
		},
		getFileAndDirectoryChanges: (state) => (selected) => {
			let files = []
			let directories = []

			if (state.metaxRecord && state.metaxRecord.research_dataset) {
				files = state.metaxRecord.research_dataset.files || []
				directories = state.metaxRecord.research_dataset.directories || []
			}

			// apply a function to values in array, returns an object with key-value pairs
			const toMap = function(items, func) {
				return items.reduce((map, item)=>{
					map[item.identifier] = func(item)
					return map
				}, {})
			}

			const metaxFiles = toMap(files, v => v)
			const metaxDirs = toMap(directories, v => v)
			const qvainFiles = toMap(selected.files, v => v)
			const qvainDirs = toMap(selected.directories, v => v)

			const addedFiles = Object.values(qvainFiles).filter(v => !(v.identifier in metaxFiles))
			const addedDirs = Object.values(qvainDirs).filter(v => !(v.identifier in metaxDirs))
			const removedFiles = Object.values(metaxFiles).filter(v => !(v.identifier in qvainFiles))
			const removedDirs = Object.values(metaxDirs).filter(v => !(v.identifier in qvainDirs))
			const existingFiles = Object.values(qvainFiles).filter(v => v.identifier in metaxFiles)
			const existingDirs = Object.values(qvainDirs).filter(v => v.identifier in metaxDirs)

			const isAddedFiles = toMap(addedFiles, () => true)
			const isAddedDirs = toMap(addedDirs, () => true)
			const isEditedFiles = toMap(existingFiles, (v) => JSON.stringify(v) !== JSON.stringify(metaxFiles[v.identifier]))
			const isEditedDirs = toMap(existingDirs, (v) => JSON.stringify(v) !== JSON.stringify(metaxDirs[v.identifier]))

			const items = {}
			if (addedFiles.length || addedDirs.length) {
				items.added = {
					directories: addedDirs,
					files: addedFiles,
				}
			}

			if (existingFiles.length || existingDirs.length) {
				items.existing = {
					directories: existingDirs,
					files: existingFiles,
				}
			}

			if (removedFiles.length || removedDirs.length) {
				items.removed = {
					directories: removedDirs,
					files: removedFiles,
				}
			}

			return {
				items,
				isEdited: {
					directories: isEditedDirs,
					files: isEditedFiles,
				},
				isAdded: {
					directories: isAddedDirs,
					files: isAddedFiles,
				},
			}
		},
	},
	actions: {
		async	fetchMetaxRecord({ state, commit }) {
			if (state.metadata.metaxIdentifier) {
				try {
					// keep cached version if identifier has not changed
					const recordIdentifier = (state.metaxRecord && state.metaxRecord.identifier) || null
					if (state.metadata.metaxIdentifier !== recordIdentifier) {
						const { data } = await metaxAPI.get('/datasets/'+state.metadata.metaxIdentifier)
						commit('setMetaxRecordError', null)
						commit('setMetaxRecord', data)
					}
				} catch (error) {
					const msg = error.response && (error.response.data && error.response.data.detail || error.response.data) || error.message
					commit('setMetaxRecordError',
						`Error retrieving information from Metax for dataset with identifier ${ state.metadata.metaxIdentifier }: ${ msg }`)
					commit('setMetaxRecord', null)
				}
			} else {
				if (state.metaxRecord || state.metaxRecordError) {
					commit('clearMetaxRecord')
				}
			}
		},
	},
})
