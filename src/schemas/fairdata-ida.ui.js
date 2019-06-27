/* ADD_LICENSE_HEADER */
export default {
	tabs: [
		{ label: 'Content Description', uri: 'description' },
		{ label: 'Actors', uri: 'actors' },
		{ label: 'Rights and Licenses', uri: 'rights' },
		{ label: 'Temporal and Spatial Coverage', uri: 'coverage' },
		{ label: 'Relations and History', uri: 'relations' },
		{ label: 'Files', uri: 'files' },
		{ label: 'Extra', uri: null },
	],
	//'': { 'tab': 'description' },
	'': { 'tab': 'extra', 'order': ["title", "description", "issued", "language"] },
	//'': { 'tab': 'extra' },
	'#/definitions/langString': {
		'widget': 'i18n-string',
		'placeholder': "text",
		//'label': "multilingual string",
		//'description': "multilingual string",
		'help': "An item possibly defined in multiple languages.",
	},
	'#/definitions/Person': {
		'order': ["name", "email", "telephone", "identifier"],
	},
	'#/definitions/Organization': {
		'title': "Organisational hierarchy",
		'description': "Hierarchical structure of organisation. Here you can provide an organisation or company's information. You need to provide at least one name, but if desired, you can provide multiple organisational divisions for faculty or department.",
		'widget': 'SelfReferentialObject',
		'props': {
			'refField': "is_part_of",
			'levels': ["organisation", "faculty or division", "department or unit"],
		},
		'order': ["name", "email", "telephone", "identifier"],
	},
	'#/definitions/Document': {
		'visible': false,
	},
	'/properties/title': {
		'tab': 'description',
		'label': "Title",
		'title': "Name of the dataset",
		'description': "Dataset must have a name, i.e. title. There can be only one name, but it can have translations. Please give the language of the name (and its translations).",
		'placeholder': "title",
		'widget': 'i18n-string',
		'props': {
			'isTitle': true,
		},
	},
	'/properties/keyword': {
		'tab': 'description',
		'title': "Keywords",
		'description': "Give free keywords that characterize the dataset. Below, there is an other field for controlled subject headings.",
		'placeholder': "keywords",
		'widget': "schema-array",
		'props': {
			'tabFormat': false,
		},
	},
	'/properties/issued': {
		'tab': 'description',
		'title': 'Issued',
		'label': 'Issued',
		'description': 'Date of formal issuance (e.g., publication) of the resource. This value does not affect or reflect the visibility of the dataset itself.',
		'widget': 'date',
		'props': {
			'wrapped': true,
		},
	},
	'/properties/language': {
		'tab': 'description',
		'title': "Language",
		'description': "Language or languages used in the data contents.",
		'widget': 'reference-data',
		'props': {
			'esIndex': "reference_data",
			'esDoctype': "language",
			'typeahead': true,
			'tags': false,
			'async': true,
			'count': 20,
			'wrapped': true,
			'labelNameInSchema': 'title',
		},
		'placeholder': "– choose language –",
	},
	'/properties/description': {
		'tab': 'description',
		'title': "Description",
		'placeholder': "description",
		'widget': 'i18n-textarea',
		'props': {
			'large': true,
		},
		'description': "A characterization of the dataset that lucidly describes the dataset. Add new field for each language version. Please define the language used in each case.",
	},
	'/properties/bibliographic_citation': {
		'tab': 'extra',
		'title': "Recommended Bibliographic Citation",
		'description': "Your preferred way to cite the dataset in publications, etc.",
	},
	'/properties/theme': {
		'tab': 'description',
		'title': "Subject heading",
		'description': "Choose subject headings from the KOKO Ontology. It also has English and Swedish translations of the terms.",
		'widget': 'reference-data',
		'props': {
			'esIndex': "reference_data",
			'esDoctype': "keyword",
			'optgroups': false,
			'typeahead': true,
			'tags': false,
			'async': true,
			'count': 100,
			'grouped': false,
			'showLang': true,
			'wrapped': true,
		},
	},
	'/properties/field_of_science': {
		'tab': 'description',
		'label': "Field of science",
		'title': "Field of Science",
		'description': "Field of science in the classification of the Ministry of Education and Culture.",
		'widget': 'reference-data',
		'props': {
			'esIndex': "reference_data",
			'esDoctype': "field_of_science",
			'optgroups': true,
			'typeahead': true,
			'tags': false,
			'async': false,
			'count': 100,
			'grouped': true,
			'wrapped': true,
		},
	},


	'/properties/temporal': {
		'tab': 'coverage',
		'title': "Temporal coverage",
		'description': "Time span that is covered by the dataset, e.g. period of observations.",
		'props': {
			'tabFormat': false,
		},
	},
	'/properties/temporal/*': {
		'widget': 'date-range',
	},
	'/properties/spatial': {
		'tab': 'coverage',
		'title': "Spatial coverage",
		'description': "Area covered by the dataset, e.g. places of observations.",
	},
	'/properties/spatial/*/properties/as_wkt': {
		'widget': 'schema-array',
		'props': {
			'tabFormat': false,
			'wrapped': false,
		},
	},
	'/properties/spatial/*/properties/place_uri': {
		'widget': 'reference-data',
		'props': {
			'esIndex': "reference_data",
			'esDoctype': "location",
			'typeahead': true,
			'tags': false,
			'async': true,
			'count': 100,
			'grouped': false,
		},
		'placeholder': "– choose location –",
		'label': "location",
		'description': "Location for the dataset (YSO places), e.g. location of observations.",
		'help': "Start typing the location in order to get the list to choose from.",
	},

	// "producer project"
	'/properties/is_output_of': {
		'tab': 'actors',
		'title': "Producer Project",
		'description': "Project in which the dataset was created",
	},
	'/properties/is_output_of/*/properties/funder_type': {
		'widget': 'reference-data',
		'props': {
			'esIndex': "reference_data",
			'esDoctype': "funder_type",
			'typeahead': false,
			'tags': false,
			'async': false,
			'count': 100,
			'grouped': false,
		},
		'placeholder': "– choose funder type –",
		'label': "funder type",
		'description': "Funding type.",
		'help': "Select the funding type.",
	},
	'/properties/is_output_of/*/properties/source_organization/*/properties/contributor_type': {
		'widget': 'reference-data',
		'props': {
			'esIndex': "reference_data",
			'esDoctype': "contributor_type",
			'typeahead': true,
			'tags': false,
			'async': false,
			'count': 100,
			'grouped': false,
		},
		'placeholder': "– choose contributor type –",
		'label': "contributor type",
		'description': "Type of contribution the given creator had on the dataset.",
		'help': "Select the type of contribution the creator had on the dataset.",
	},
	'/properties/creator': {
		'tab': 'actors',
		'title': "Creator of the dataset",
		'description': "The principal researcher or researchers involved in producing the data.",
	},
	'/properties/creator/*/oneOf/0/properties/name': {
		'description': 'Please write your name in first_name last_name fashion if possible',
	},
	'/properties/contributor/*/oneOf/0/properties/name': {
		'description': 'Please write your name in first_name last_name fashion if possible',
	},
	'/properties/rights_holder/*/oneOf/0/properties/name': {
		'description': 'Please write your name in first_name last_name fashion if possible',
	},
	'/properties/curator/*/oneOf/0/properties/name': {
		'description': 'Please write your name in first_name last_name fashion if possible',
	},
	'/properties/creator/*/oneOf/*/properties/contributor_type': {
		'widget': 'reference-data',
		'props': {
			'esIndex': "reference_data",
			'esDoctype': "contributor_type",
			'typeahead': true,
			'tags': false,
			'async': false,
			'count': 100,
			'grouped': false,
		},
		'placeholder': "– choose contributor type –",
		'label': "contributor type",
		'description': "Type of contribution the given creator had on the dataset.",
		'help': "Select the type of contribution the creator had on the dataset.",
	},
	'/properties/creator/*/oneOf/*/properties/member_of/properties/contributor_type': {
		'widget': 'reference-data',
		'props': {
			'esIndex': "reference_data",
			'esDoctype': "contributor_type",
			'typeahead': true,
			'tags': false,
			'async': false,
			'count': 100,
			'grouped': false,
		},
		'placeholder': "– choose contributor type –",
		'label': "contributor type",
		'description': "Type of contribution the creator had on the dataset.",
		'help': "Select the type of contribution the creator had on the dataset.",
	},
	'/properties/creator/*/oneOf/*/properties/contributor_role': {
		'widget': 'reference-data',
		'props': {
			'esIndex': "reference_data",
			'esDoctype': "contributor_role",
			'typeahead': true,
			'tags': false,
			'async': false,
			'count': 100,
			'grouped': false,
		},
		'placeholder': "– choose contributor role –",
		'label': "contributor role",
		'description': "Role of the creator regarding this dataset.",
		'help': "What was the role of the given creator on this dataset.",
	},
	'/properties/creator/*/oneOf/*/properties/telephone': {
		'props': {
			'tabFormat': false,
			'wrapped': false,
		},
	},
	'/properties/creator/*/oneOf/*/properties/member_of/properties/telephone': {
		'props': {
			'tabFormat': false,
			'wrapped': false,
		},
	},
	'/properties/contributor/*/oneOf/*/properties/telephone': {
		'props': {
			'tabFormat': false,
			'wrapped': false,
		},
	},
	'/properties/contributor/*/oneOf/*/properties/member_of/properties/telephone': {
		'props': {
			'tabFormat': false,
			'wrapped': false,
		},
	},
	'/properties/rights_holder/*/oneOf/*/properties/telephone': {
		'props': {
			'tabFormat': false,
			'wrapped': false,
		},
	},
	'/properties/rights_holder/*/oneOf/*/properties/member_of/properties/telephone': {
		'props': {
			'tabFormat': false,
			'wrapped': false,
		},
	},
	'/properties/curator/*/oneOf/*/properties/telephone': {
		'props': {
			'tabFormat': false,
			'wrapped': false,
		},
	},
	'/properties/curator/*/oneOf/*/properties/member_of/properties/telephone': {
		'props': {
			'tabFormat': false,
			'wrapped': false,
		},
	},
	// missing: distributor
	'/properties/contributor': {
		'tab': 'actors',
		'title': "Contributor",
		'description': "The organization or person that has participated in collecting, managing, or distributing of the dataset, or that has otherwise contributed to its development.",
	},
	'/properties/contributor/*/oneOf/*/properties/contributor_role': {
		'widget': 'reference-data',
		'props': {
			'esIndex': "reference_data",
			'esDoctype': "contributor_role",
			'typeahead': true,
			'tags': false,
			'async': false,
			'count': 100,
			'grouped': false,
		},
		'placeholder': "– choose contributor role –",
		'label': "contributor role",
		'description': "Role of the contributor regarding this dataset.",
		'help': "What was the role of the given contributor on this dataset.",
	},
	'/properties/contributor/*/oneOf/*/properties/contributor_type': {
		'widget': 'reference-data',
		'props': {
			'esIndex': "reference_data",
			'esDoctype': "contributor_type",
			'typeahead': true,
			'tags': false,
			'async': false,
			'count': 100,
			'grouped': false,
		},
		'placeholder': "– choose contributor type –",
		'label': "contributor type",
		'description': "Type of contribution the given actor had on the dataset.",
		'help': "Select the type of contribution the given actor had on the dataset.",
	},
	'/properties/contributor/*/oneOf/*/properties/member_of/properties/contributor_type': {
		'widget': 'reference-data',
		'props': {
			'esIndex': "reference_data",
			'esDoctype': "contributor_type",
			'typeahead': true,
			'tags': false,
			'async': false,
			'count': 100,
			'grouped': false,
		},
		'placeholder': "– choose contributor type –",
		'label': "contributor type",
		'description': "Type of contribution the given actor had on the dataset.",
		'help': "Select the type of contribution the given actor had on the dataset.",
	},
	'/properties/curator': {
		'tab': 'actors',
		'title': "Curator",
		'description': "Person tasked with reviewing, enhancing, cleaning, and standardizing metadata and the associated data.",
	},
	'/properties/curator/*/oneOf/*/properties/contributor_role': {
		'widget': 'reference-data',
		'props': {
			'esIndex': "reference_data",
			'esDoctype': "contributor_role",
			'typeahead': true,
			'tags': false,
			'async': false,
			'count': 100,
			'grouped': false,
		},
		'placeholder': "– choose contributor role –",
		'label': "contributor role",
		'description': "Role of the curator regarding this dataset.",
		'help': "What was the role of the given curator on this dataset.",
	},
	'/properties/curator/*/oneOf/*/properties/contributor_type': {
		'widget': 'reference-data',
		'props': {
			'esIndex': "reference_data",
			'esDoctype': "contributor_type",
			'typeahead': true,
			'tags': false,
			'async': false,
			'count': 100,
			'grouped': false,
		},
		'placeholder': "– choose contributor type –",
		'label': "contributor type",
		'description': "Type of contribution the given actor had on the dataset.",
		'help': "Select the type of contribution the given actor had on the dataset.",
	},
	'/properties/curator/*/oneOf/*/properties/member_of/properties/contributor_type': {
		'widget': 'reference-data',
		'props': {
			'esIndex': "reference_data",
			'esDoctype': "contributor_type",
			'typeahead': true,
			'tags': false,
			'async': false,
			'count': 100,
			'grouped': false,
		},
		'placeholder': "– choose contributor type –",
		'label': "contributor type",
		'description': "Type of contribution the given actor had on the dataset.",
		'help': "Select the type of contribution the given actor had on the dataset.",
	},
	// rights holder, also owner
	'/properties/rights_holder': {
		'tab': 'actors',
		'title': "Rights holder",
		'description': "A person or an organization that may edit, modify, share and restrict access to the dataset. The owner may also share or surrender these privileges to others.",
	},
	'/properties/rights_holder/*/oneOf/*/properties/contributor_role': {
		'widget': 'reference-data',
		'props': {
			'esIndex': "reference_data",
			'esDoctype': "contributor_role",
			'typeahead': true,
			'tags': false,
			'async': false,
			'count': 100,
			'grouped': false,
		},
		'placeholder': "– choose contributor role –",
		'label': "contributor role",
		'description': "Role of the rights holder regarding this dataset.",
		'help': "What was the role of the given rights holder on this dataset.",
	},
	'/properties/rights_holder/*/oneOf/*/properties/contributor_type': {
		'widget': 'reference-data',
		'props': {
			'esIndex': "reference_data",
			'esDoctype': "contributor_type",
			'typeahead': true,
			'tags': false,
			'async': false,
			'count': 100,
			'grouped': false,
		},
		'placeholder': "– choose contributor type –",
		'label': "contributor type",
		'description': "Type of contribution the given rights holder had on the dataset.",
		'help': "Select the type of contribution the given rights holder had on the dataset.",
	},
	'/properties/rights_holder/*/oneOf/*/properties/member_of/properties/contributor_type': {
		'widget': 'reference-data',
		'props': {
			'esIndex': "reference_data",
			'esDoctype': "contributor_type",
			'typeahead': true,
			'tags': false,
			'async': false,
			'count': 100,
			'grouped': false,
		},
		'placeholder': "– choose contributor type –",
		'label': "contributor type",
		'description': "Type of contribution the given rights holder had on the dataset.",
		'help': "Select the type of contribution the given rights holder had on the dataset.",
	},
	'/properties/relation': {
		'tab': 'relations',
		'title': "Reference to a related resource",
		'description': "Another dataset, publication, infrastructure and so on, related to this dataset.",
	},
	'/properties/relation/*/properties/relation_type': {
		'widget': 'reference-data',
		'props': {
			'esIndex': "reference_data",
			'esDoctype': "relation_type",
			'typeahead': true,
			'tags': false,
			'async': false,
			'count': 100,
			'grouped': false,
		},
		'placeholder': "– choose relation type –",
		'label': "relation type",
		'description': "Relation type; how is this resource related to the dataset.",
		'help': "What is the relation type of this resource towards the dataset?",
	},
	'/properties/relation/*/properties/entity/properties/type': {
		'widget': 'reference-data',
		'props': {
			'esIndex': "reference_data",
			'esDoctype': "resource_type",
			'typeahead': true,
			'tags': false,
			'async': false,
			'count': 100,
			'grouped': false,
		},
		'placeholder': "– choose entity relation type –",
		'label': "entity relation type",
		'description': "Type of this resource.",
		'help': "Select the type of this resource.",
	},
	//path:"/properties/relation/0/properties/entity/properties/type/properties/identifier"

	// was Life cycle event
	'/properties/provenance': {
		'tab': 'relations',
		'title': "Provenance",
		'description': "An action or event that the dataset was the subject of.",
	},
	'/properties/provenance/*/properties/spatial/properties/place_uri': {
		'widget': 'reference-data',
		'props': {
			'esIndex': "reference_data",
			'esDoctype': "location",
			'typeahead': true,
			'tags': false,
			'async': true,
			'count': 100,
			'grouped': false,
		},
		'placeholder': "– choose location –",
		'label': "location",
		'description': "Location for the dataset (YSO places), e.g. location of observations.",
		'help': "Start typing the location in order to get the list to choose from.",
	},
	'/properties/provenance/*/properties/lifecycle_event': {
		'widget': 'reference-data',
		'props': {
			'esIndex': "reference_data",
			'esDoctype': "lifecycle_event",
			'typeahead': false,
			'tags': false,
			'async': false,
			'count': 100,
			'grouped': false,
		},
		'placeholder': "– choose type –",
		'title': "lifecycle event type",
		'description': "Event type; what was done.",
		'help': "Select what was done.",
	},
	'/properties/provenance/*/properties/preservation_event': {
		'widget': 'reference-data',
		'props': {
			'esIndex': "reference_data",
			'esDoctype': "preservation_event",
			'typeahead': false,
			'tags': false,
			'async': false,
			'count': 100,
			'grouped': false,
		},
		'placeholder': "– choose type –",
		'title': "preservation event type",
		'description': "Event type; what happened.",
		'help': "Select what happened.",
	},
	'/properties/provenance/*/properties/event_outcome': {
		'widget': 'reference-data',
		'props': {
			'esIndex': "reference_data",
			'esDoctype': "event_outcome",
			'typeahead': false,
			'tags': false,
			'async': false,
			'count': 100,
			'grouped': false,
		},
		'placeholder': "– choose type –",
		'title': "Event outcome",
		'description': "Succeeded/Failed",
		'help': "Select whether the event succeeded or failed",
	},
	'/properties/provenance/*/properties/used_entity/*/properties/type': {
		'widget': 'reference-data',
		'props': {
			'esIndex': "reference_data",
			'esDoctype': "resource_type",
			'typeahead': false,
			'tags': false,
			'async': false,
			'count': 100,
			'grouped': false,
		},
		'placeholder': "– choose type –",
		'title': "Resource type",
		'description': "Resource type of the entity",
		'help': "Select the resource type for this entity.",
	},
	'/properties/provenance/*/properties/was_associated_with/*/oneOf/*/properties/member_of/properties/contributor_type': {
		'widget': 'reference-data',
		'props': {
			'esIndex': "reference_data",
			'esDoctype': "contributor_type",
			'typeahead': true,
			'tags': false,
			'async': false,
			'count': 100,
			'grouped': false,
		},
		'placeholder': "– choose contributor type –",
		'label': "contributor type",
		'description': "Type of contribution the given person or organization had on the entity used on the dataset.",
		'help': "Select the type of contribution the given person or organization had on the entity used on the dataset.",
	},
	'/properties/provenance/*/properties/temporal': {
		'widget': 'date-range',
	},
	'/properties/files': {
		'tab': 'files',
		'widget': 'filepicker',
	},
	'/properties/directories': {
		'tab': 'notab',
	},
	'/properties/remote_resources': {
		'tab': 'notab',
	},
	'/properties/access_rights': {
		'tab': 'rights',
		'title': "Access rights",
		'description': "*** description for access rights goes here ***",
		'ignored': [
			"description",
			"access_process",
			"access_url",
		],
		'order': ["license", "access_type", "restriction_grounds", "available"],
	},
	'/properties/access_rights/properties/access_type': {
		'widget': 'reference-data',
		'props': {
			'esIndex': "reference_data",
			'esDoctype': "access_type",
			'typeahead': false,
			'tags': false,
			'async': false,
			'count': 100,
			'grouped': false,
		},
		'placeholder': "– choose access type –",
		'title': "access type",
		'description': "Define whether the data in this dataset can be accessed freely (Open) or if it has restrictions.",
		'help': "Please provide also restriction grounds (own field) if there are restrsictions.",
	},
	'/properties/access_rights/properties/available': {
		'widget': 'date',
		'required': record => record.access_rights.access_type &&
			record.access_rights.access_type.identifier === 'http://uri.suomi.fi/codelist/fairdata/access_type/code/embargo',
		'visible': record => record.access_rights.access_type &&
			record.access_rights.access_type.identifier === 'http://uri.suomi.fi/codelist/fairdata/access_type/code/embargo',
		'description': "Date when the resource (the data in this dataset) became or will become available (embargo related field).",
	},
	'/properties/access_rights/properties/restriction_grounds': {
		'widget': 'reference-data',
		'props': {
			'esIndex': "reference_data",
			'esDoctype': "restriction_grounds",
			'typeahead': false,
			'tags': false,
			'async': false,
			'count': 100,
			'grouped': false,
		},
		'placeholder': "– choose restriction grounds –",
		'title': "restriction grounds",
		'required': record => record.access_rights.access_type &&
			record.access_rights.access_type.identifier &&
			record.access_rights.access_type.identifier !== 'http://uri.suomi.fi/codelist/fairdata/access_type/code/open',
		'visible': record => record.access_rights.access_type &&
			record.access_rights.access_type.identifier &&
			record.access_rights.access_type.identifier !== 'http://uri.suomi.fi/codelist/fairdata/access_type/code/open',
		'description': "Please select the grounds for restrictions.",
		'help': "Can be left empty if the Access Type is Open.",
	},
	'/properties/access_rights/properties/license': {
		'widget': 'reference-data',
		'props': {
			'esIndex': "reference_data",
			'esDoctype': "license",
			'typeahead': false,
			'tags': false,
			'async': false,
			'count': 100,
			'grouped': false,
			'labelNameInSchema': 'title',
			/*'defaultValue': [{
				"identifier":"http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-4.0",
				"label": {
					"sv": '',
					"en":"Creative Commons Attribution 4.0 International (CC BY 4.0)",
					"fi":"Creative Commons Nimeä 4.0 Kansainvälinen (CC BY 4.0)",
					"und":"Creative Commons Nimeä 4.0 Kansainvälinen (CC BY 4.0)"
				}
			}]*/
		},
		'placeholder': "– choose license –",
		'title': "license",
		'required': () => true,
		'description': "A license agreement signifies what a user is allowed to do with the data.",
		'help': "Select a license agreement for your dataset.",
	},
	'/properties/publisher': {
		'tab': 'extra',
		'title': "Publisher",
	},
	'/properties/modified': {
		'tab': 'extra',
		'title': "modified",
		'widget': 'date',
	},
	'/properties/infrastructure': {
		'tab': 'extra',
		'widget': 'reference-data',
		'props': {
			'esIndex': "reference_data",
			'esDoctype': "research_infra",
			'typeahead': true,
			'tags': false,
			'async': false,
			'count': 100,
			'grouped': false,
		},
		'placeholder': "– choose infrastructure –",
		'title': "infrastructure",
	},
	'/properties/metadata_version_identifier': {
		'tab': 'extra',
		'title': "Metadata version identifier",
	},
	'/properties/preferred_identifier': {
		'tab': 'extra',
		'title': "Preferred identifier",
	},
	'/properties/other_identifier': {
		'tab': 'extra',
		'title': "Other identifier",
	},
	'/properties/total_ida_byte_size': {
		'tab': 'extra',
		'title': "Total ida byte size",
	},
	'/properties/total_remote_resources_byte_size': {
		'tab': 'extra',
		'title': "Total remote resources byte size",
	},
	'/properties/value': {
		'tab': 'extra',
		'label': "Quality",
	},
	'/properties/version_info': {
		'tab': 'extra',
		'title': "Version info",
	},
	'/properties/version_notes': {
		'tab': 'extra',
		'title': "Version notes",
	},
}
