/* ADD_LICENSE_HEADER */
import FairdataIdaSchema from './fairdata-ida.schema.json'
import FairdataAttSchema from './fairdata-att.schema.json'
import FairdataIdaUi from './fairdata-ida.ui.js'
import fairdataAttUiDiff from './fairdata-att.ui.diff.js'
import fairdataPasUiDiff from './fairdata-pas.ui.diff.js'
import jsonPointer from 'json-pointer'


const FairdataAttUi = fairdataAttUiDiff(FairdataIdaUi)
const FairdataPasUi = fairdataPasUiDiff(FairdataIdaUi)


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


const ida = {
	schema: FairdataIdaSchema,
	ui: FairdataIdaUi,
	title: "IDA",
	name: "Select IDA files", // "Fairdata (IDA)",
	description: "You want to select files from IDA.",
	schemaId: "metax-ida",
	id: "urn:nbn:fi:att:data-catalog-ida",
	family: 2,
	cloneFunc: clone,
}

const att = {
	schema: FairdataAttSchema,
	ui: FairdataAttUi,
	title: "Remote Resources",
	name: "Link Remote resources", // "Fairdata (ATT)",
	description: "You want to link files from remote location.",
	schemaId: "metax-att",
	id: "urn:nbn:fi:att:data-catalog-att",
	family: 2,
	cloneFunc: clone,
}

// A dataset is considered a PAS dataset if it has preservation_state > 0 or is in the PAS catalog.
// If a dataset in some other catalog (e.g. IDA) has preservation_state > 0, it will use the PAS catalog
// internally in the Editor, but will be saved with the original catalog.
const pas = {
	schema: FairdataIdaSchema,
	ui: FairdataPasUi,
	title: "PAS",
	name: "PAS dataset",
	description: "PAS dataset.",
	schemaId: "metax-ida",
	id: "urn:nbn:fi:att:data-catalog-pas",
	family: 2,
	cloneFunc: clone,
	hidden: true, // PAS datasets cannot be created in Qvain
}

export default {
	ida, att, pas,
}
