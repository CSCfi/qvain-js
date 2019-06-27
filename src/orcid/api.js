/*
This file is part of Qvain -project.

Author(s):
	Juhapekka Piiroinen <jp@1337.fi>
	Wouter Van Hemel <wouter.van.hemel@helsinki.fi>

License: GPLv3

See LICENSE file for more information.
Copyright (C) 2019 Ministry of Culture and Education, Finland.
All Rights Reserved.
*/
import axios from 'axios'

const apiUrl = "https://pub.orcid.org/v2.1"
const apiResource = "record" // eslint-disable-line no-unused-vars

export default function orcidApiClient(orcid, apiResource) {
	return axios.get(
		`${apiUrl}/${orcid}/${apiResource}`, {
			timeout: 5000,
			responseType: 'json',
			// force application/json only, otherwise the orcid API returns an XML blob with mime type "application/vnd.orcid+xml"
			headers: {
				'Accept': 'application/json',
			},
		})
}
