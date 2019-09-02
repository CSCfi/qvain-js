/*
This file is part of Qvain -project.

Author(s):
	Juhapekka Piiroinen <jp@1337.fi>
	Wouter Van Hemel <wouter.van.hemel@helsinki.fi>
	Jori Niemi <3295718+tahme@users.noreply.github.com>
	Kauhia <Kauhia@users.noreply.github.com>

License: GPLv3

See LICENSE file for more information.
Copyright (C) 2019 Ministry of Culture and Education, Finland.
All Rights Reserved.
*/
import FairdataIdaSchema from './fairdata-ida.schema.json'
import FairdataAttSchema from './fairdata-att.schema.json'
import FairdataIdaUi from './fairdata-ida.ui.js'
import fairdataAttUiDiff from './fairdata-att.ui.diff.js'
import jsonPointer from 'json-pointer'


const FairdataAttUi = fairdataAttUiDiff(FairdataIdaUi)


// Qvain backend knows these schemas as:
//
//   ida: {family: 2, schema: "metax-ida"}
//   att: {family: 2, schema: "metax-att"}
//

// These are the dataset-specific fields that should be removed when cloning.
// Note: json-pointer syntax, and the root for Fairdata datasets is "/research_dataset".
const IDENTIFYING_FIELDS = [
	"/modified",
	"/version_notes",
	"/identifier",
	"/preferred_identifier",
	"/metadata_version_identifier",
]

// Function clone takes a dataset and removes any identifying fields.
function clone(dataset) {
	IDENTIFYING_FIELDS.foreach(f => {
		try {
			jsonPointer.remove(dataset, f)
		} catch (e) {
			// hello, linter!
		}
	})
}

export default {
	ida: {
		schema: FairdataIdaSchema,
		ui: FairdataIdaUi,
		title: "IDA",
		name: "Select IDA files", // "Fairdata (IDA)",
		description: "You want to select files from IDA.",
		id: "metax-ida",
		family: 2,
		cloneFunc: clone,
	},
	/*'ida-old': {
		schema: FairdataIdaOldSchema,
		ui: FairdataIdaUi,
		name: "Fairdata (IDA/old)",
		id: "metax-ida",
		family: 2,
		cloneFunc: clone,
	},*/
	att: {
		schema: FairdataAttSchema,
		ui: FairdataAttUi,
		title: "Remote Resources",
		name: "Link Remote resources", // "Fairdata (ATT)",
		description: "You want to link files from remote location.",
		id: "metax-att",
		family: 2,
		cloneFunc: clone,
	},
}
