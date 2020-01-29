/*
This file is part of Qvain -project.

Author(s):
	Juhapekka Piiroinen <jp@1337.fi>
	Jori Niemi <3295718+tahme@users.noreply.github.com>
	Kauhia <Kauhia@users.noreply.github.com>

License: GPLv3

See LICENSE file for more information.
Copyright (C) 2019 Ministry of Culture and Education, Finland.
All Rights Reserved.
*/
// Copy IDA UI and edit only changed fields
export default (idaUi) => {
	return {
		...idaUi,
		'/properties/files': {
			'tab': 'notab',
		},
		'/properties/directories': {
			'tab': 'notab',
		},
		'/properties/remote_resources': {
			'tab': 'files',
			'widget': 'schema-array',
		},
		'/properties/remote_resources/*/properties/access_url/properties/identifier': {
			'description': "URL that gives access to a distribution of the dataset. E.g. landing page download. Use when your catalog does not have information on which it is or when it is definitely not a download.",
			'required': ()=>false,
		},
		'/properties/remote_resources/*/properties/access_url/properties/title': {
			'tab': 'notab',
		},
		'/properties/remote_resources/*/properties/access_url/properties/description': {
			'tab': 'notab',
		},
		'/properties/remote_resources/*/properties/download_url/properties/identifier': {
			'description': "A direct link to a downloadable file in a given format. E.g. CSV file or RDF file.",
			'required': ()=>false,
		},
		'/properties/remote_resources/*/properties/download_url/properties/title': {
			'tab': 'notab',
		},
		'/properties/remote_resources/*/properties/download_url/properties/description': {
			'tab': 'notab',
		},
		'/properties/remote_resources/*/properties/license': {
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
			},
			'placeholder': "– choose license –",
			'title': "license",
		},
		'/properties/remote_resources/*/properties/modified': {
			'widget': 'date',
		},
		'/properties/remote_resources/*/properties/file_type': {
			'widget': 'reference-data',
			'props': {
				'esIndex': "reference_data",
				'esDoctype': "file_type",
				'typeahead': false,
				'tags': false,
				'async': false,
				'count': 100,
				'grouped': false,
			},
			'placeholder': "– choose file type –",
			'title': "file type",
		},
		'/properties/remote_resources/*/properties/resource_type': {
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
			'placeholder': "– choose resource type –",
			'title': "resource type",
		},
		'/properties/remote_resources/*/properties/use_category': {
			'widget': 'reference-data',
			'props': {
				'esIndex': "reference_data",
				'esDoctype': "use_category",
				'typeahead': false,
				'tags': false,
				'async': false,
				'count': 100,
				'grouped': false,
			},
			'placeholder': "– choose use category –",
			'title': "use category",
		},
		'/properties/remote_resources/*': {
			"ignored": ['license'],
		},
	}
}
