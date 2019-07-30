/* ADD_LICENSE_HEADER */
/* eslint-disable no-console */
"use strict"

const { SchemaDereferencer } = require('./deref.js')
const { promisify } = require('util')
const writeFile = promisify(require('fs').writeFile)

async function saveSchema(schema, filename) {
	await writeFile(filename, JSON.stringify(schema, null, "\t") + "\n")
	console.log("schema successfully saved to", filename)
}

function addRequired(obj, value) {
	if (obj.required === undefined) {
		obj.required = []
	}
	if (obj.required.indexOf(value) < 0) {
		obj.required.push(value)
	}
}

function makeLicenseOneOf(schema) {
	const license = { ...schema.definitions.RightsStatement.properties.license.items }
	license.title = "License dropdown"
	license.required = []
	const freeLicense = {
		"type": "object",
		"title": "Free form License URL",
		"properties": {
			"license": {
				"@id": "http://schema.org/license",
				"title": "Licence URL",
				"description": "A referenced license document that applies to this content",
				"@type": "http://www.w3.org/2001/XMLSchema#anyURI",
				"minLength": 1,
				"type": "string",
			},
		},
		"required": [],
		"additionalProperties": false,
	}
	schema.definitions.RightsStatement.properties.license.items = {
		"oneOf": [ license,	freeLicense ],
	}
}

function dereference(schema) {
	const preserveTextsFor = [
		"/definitions/langString",
		"/definitions/Concept",
		"/definitions/Document",
		"/definitions/ResearchDataLicenseDocument",
	]
	const dereferencer = new SchemaDereferencer(schema, preserveTextsFor)
	dereferencer.deref()
	dereferencer.addTargetCount()
	return dereferencer.resolvedSchema
}

async function processSchema(schema, filename) {
	addRequired(schema.definitions.Organization, "name")
	addRequired(schema.definitions.RelatedEntity, "identifier")
	addRequired(schema.definitions.RelatedEntity, "title")
	addRequired(schema.definitions.Activity, "title")
	addRequired(schema.definitions.RightsStatement, "license")
	addRequired(schema.definitions.RightsStatement, "restriction_grounds")
	addRequired(schema.definitions.RightsStatement, "available")
	makeLicenseOneOf(schema)

	schema = dereference(schema)
	schema = schema.allOf[0]
	await saveSchema(schema, filename)
}

const args = process.argv.slice(2)
if (args.length > 1) {
	console.log("node process_schemas.js [output_path]")
}

let path = args[0] || ""
if (path && !path.endsWith("/")) {
	path += "/"
}

const idaSchema = require("./data/ida.json")
const attSchema = require("./data/att.json")

const run = async () => {
	await processSchema(idaSchema, path + "fairdata-ida.schema.json")
	await processSchema(attSchema, path + "fairdata-att.schema.json")
}
run()
