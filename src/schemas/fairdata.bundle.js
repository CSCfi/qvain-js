/* ADD_LICENSE_HEADER */
import FairdataIdaSchema from './fairdata-ida.schema.json'
import FairdataAttSchema from './fairdata-att.schema.json'
import FairdataIdaUi from './fairdata-ida.ui.js'
import fairdataAttUiDiff from './fairdata-att.ui.diff.js'
import jsonPointer from 'json-pointer'


// Homepage objects cause too much clutter with the current UI
function removeObjects(obj, key) {
	if (typeof(obj) !== "object") {
		return
	}
	if (key in obj) {
		delete obj[key]
	}
	for (let item in obj) {
		removeObjects(obj[item], key)
	}
}
removeObjects(FairdataIdaSchema, 'homepage')
removeObjects(FairdataAttSchema, 'homepage')

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
