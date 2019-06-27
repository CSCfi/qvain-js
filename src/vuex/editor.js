/*
This file is part of Qvain -project.

Author(s):
	Juhapekka Piiroinen <jp@1337.fi>
	Eemeli Kouhia <eemeli.kouhia@gofore.com>

License: GPLv3

See LICENSE file for more information.
Copyright (C) 2019 Ministry of Culture and Education, Finland.
All Rights Reserved.
*/
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)



export default new Vuex.Store({
	state: {
		record: null,
		schema: {}, //?
		validation: {},
	},
	getters: {

	},
	mutations: {

	},
	actions: {
		// validation
		validate() {
			// how to validate changed parts and propagate the validation upwards?
		},
		startValidation() {

		},
		stopValidation() {

		},

		// schema selection
		setDatasetType() {

		},
		// set and reset metadata???

		// open dataset
		openNewDataset() {
		},
		openSavedDataset(datasetId) {
		},
		cloneCurrentDatasetInEditor() { // NOT IMPLEMENTED

		},

		// empty dataset
		resetEditorRecord() {
		},

		// api calls
		saveDataset() {
		},
		deleteUnpublishedDataset() {
		},
		publishDataset() {
		}
	}
})
