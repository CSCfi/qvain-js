/* ADD_LICENSE_HEADER */
// Copy IDA UI and edit only changed fields
export default (idaUi) => {
	return {
		...idaUi,
		'/properties/issued': {
			...idaUi['/properties/issued'],
			required: () => true,
		},
		'/properties/publisher': {
			...idaUi['/properties/publisher'],
			required: () => true,
		},
	}
}
