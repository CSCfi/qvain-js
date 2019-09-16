/* ADD_LICENSE_HEADER */
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
			errorText.push("Error id =", error.response.data.error_id, "Please contact servicedesk(at)csc.fi with this error Id")
		}
	} else if (error.code && error.code === 'ECONNABORTED') {
		errorText.push(":", "Request is taking too long")
	} else if (error.message) {
		errorText.push(":", error.message.toLowerCase())
	}
	return errorText.join(" ")
}
