
function getLanguagesFromDataset(dataset, schema) {
	const languages = {}
	let Ajv = require('ajv')
	const ajv = new Ajv({ allErrors: true })
	ajv.addKeyword('$deref', {
		type: 'object',
		compile: function (sch, parentSchema) {
			return function (data) {
				if (sch === "#/definitions/langString") {
					for (const lang in data) {
						languages[lang] = true
					}
				}
			}
		},
		valid: true,
		modifying: true,
		errors: false,
	})
	const validate = ajv.compile(schema)
	validate(dataset)
	return languages
}

export default getLanguagesFromDataset
