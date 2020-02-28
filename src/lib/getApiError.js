/*
This file is part of Qvain -project.

Author(s):
	Shreyas Deshpande <31839853+ShreyasDeshpande@users.noreply.github.com>
	Jori Niemi <3295718+tahme@users.noreply.github.com>

License: GPLv3

See LICENSE file for more information.
Copyright (C) 2019 Ministry of Culture and Education, Finland.
All Rights Reserved.
*/
/*
This function returns well texted error message
*/

export default function getApiError(error, apiCall, datasetId) {
	let errorText = [ "Error", apiCall, datasetId ]
	if (error.response) {
		errorText.push("[", error.response.status, "]")
		if (error.response.data && error.response.data.msg) {
			errorText.push(":", error.response.data.msg, ",")
		}
		if (error.response.data && error.response.data.error_id) {
			errorText.push("Error ID =", error.response.data.error_id + ".",
				"Please contact servicedesk(at)csc.fi with this error ID.")
		}
	} else if (error.code && error.code === 'ECONNABORTED') {
		errorText.push(":", "Request is taking too long")
	} else if (error.message) {
		errorText.push(":", error.message.toLowerCase())
	}
	return errorText.join(" ")
}
