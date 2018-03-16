import * as config from './config.js'


function createValid(schema) {
	schema[config.sentinel] = {
		v: false,
		e: [],
	}
}

/*
* function setErrors(schema, errors) {
*	schema[config.sentinel] = {
*		v: !(errors && errors.length),
*		e: errors || [],
*	}
* }
*/


function addError(schema, error) {
	if (!(config.sentinel in schema)) createValid(schema)
	schema[config.sentinel].v = false
	schema[config.sentinel].e.push(error)
}


function setValid(schema, valid) {
	if (!(config.sentinel in schema)) createValid(schema)
	schema[config.sentinel].v = valid
}


function getValid(schema) {
	return config.sentinel in schema ? schema[config.sentinel].v : false
}


function checkValid(schema) {
	if (!(config.sentinel in schema)) return false
	schema[config.sentinel].v = !schema[config.sentinel].e.length
	return schema[config.sentinel].v
}


export { checkValid, addError, setValid }
