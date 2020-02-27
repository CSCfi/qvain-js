/*
This file is part of Qvain -project.

Author(s):
	Juhapekka Piiroinen <jp@1337.fi>
	Wouter Van Hemel <wouter.van.hemel@helsinki.fi>
	Jori Niemi <3295718+tahme@users.noreply.github.com>

License: GPLv3

See LICENSE file for more information.
Copyright (C) 2019 Ministry of Culture and Education, Finland.
All Rights Reserved.
*/
import axios from 'axios'

const apiBaseUrl = "/api"

const apiUrl = function(str) {
	if (!str) {
		return apiBaseUrl
	}

	if (str.substr(-1) === '/') {
		return str.substr(0, str.length - 1)
	}
	return str
}(process.env.VUE_APP_QVAIN_API_URL)

/*
export default function qvainApiClient(dataset) {
	return axios.get(
		`${apiUrl}/${doctype}/_search?size=10000&pretty=1&filter_path=hits.hits._source`, {
			timeout: 5000,
			responseType: 'json',
	})
}
*/

/*
 * API errors look like this:
 *
 * {
 *   "msg": "some horrible error occured and a kitten has died",
 *   "code": "400"
 * }
 *
 * Fields:
 *
 * `msg`: error text
 * `code`: HTTP status code, 4xx or 5xx
 *
 * Some errors might have these extra fields:
 *
 * `help`: longer description, specifically meant for end users
 * `url`: link to a location that provides more information
 *
 * If you can connect to the API server at all, the most likely error is database related;
 * the UI is unlikely to show anything that doesn't exist or the user doesn't have permission for.
 */

const apiClient = axios.create({
	baseURL: apiUrl,
	timeout: 10000,
	responseType: "json",
})

export default apiClient
