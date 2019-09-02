/*
This file is part of Qvain -project.

Author(s):
	Jori Niemi <3295718+tahme@users.noreply.github.com>
	Wouter Van Hemel <wouter.van.hemel@helsinki.fi>

License: GPLv3

See LICENSE file for more information.
Copyright (C) 2019 Ministry of Culture and Education, Finland.
All Rights Reserved.
*/
/* eslint-disable no-console */
"use strict"

function parsePath(path) {
	if (path === "") return []
	if (path[0] !== "/") throw new Error("invalid path:" + path);
	return path.substring(1).split(/\//).map(s => s.replace(/~1/g, '/').replace(/~0/g, '~'))
}

function getPath(obj, path) {
	const els = parsePath(path)

	for (let i = 0; i < els.length; ++i) {
		const el = els[i]
		if (!(typeof obj == 'object' && el in obj)) {
			throw new Error('Invalid reference token: ' + el)
		}
		obj = obj[el]
	}
	return obj
}

// Makes a deep copy from an object
// NOTE: uses Array.isArray()
// @param {Object} src - nested object
// @return {Object} - copied object without hard references
// @see {@link https://github.com/zxdong262/deep-copy}
// @see {@link http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript}
function deepCopy(src) {
	if (src === null || typeof(src) !== 'object') {
		return src
	}
	if (Array.isArray(src)) {
		let ret = src.slice()
		let i = ret.length
		while (i--) {
			ret[i] = deepCopy(ret[i])
		}
		return ret
	}
	let dest = {}
	for (let key in src) {
		dest[key] = deepCopy(src[key])
	}
	return dest
}


function SchemaDereferencer(schema, preserveTextsFor) {
	this.baseSchema = deepCopy(schema)
	this.resolvedSchema = deepCopy(schema)
	this.refCount = 0
	this.refTargets = {}
	this.derefDefs = false

	// Normally, title and description are copied from the referenced definition. Objects referencing
	// a definition listed in preserveTextsFor instead use the original title and description if available.
	this.preserveTextsFor = preserveTextsFor || []
}
SchemaDereferencer.prototype.constructor = SchemaDereferencer

SchemaDereferencer.prototype._copyRefs = function(schema, path) {
	if (typeof schema !== 'object') throw new Error("schema is not an object", path || "/")

	for (let key in schema) {
		if (typeof schema[key] === 'object' && schema[key] !== null) this._copyRefs(schema[key], path + "/" + key)
	}

	if ('$ref' in schema) {
		this.refCount++
		let ptr = schema['$ref'].substring(schema['$ref'].lastIndexOf("#") + 1)

		this.refTargets[ptr] = (this.refTargets[ptr] || 0) + 1

		schema['$deref'] = schema['$ref']
		delete schema['$ref']

		let ref = getPath(this.resolvedSchema, ptr)
		this._copyRefs(ref, ptr)

		let clone = deepCopy(ref)
		for (let key in clone) {
			if (
				this.preserveTextsFor.includes(ptr)
				&& key in schema && [ 'title', 'description', 'default' ].indexOf(key) >= 0) continue
			schema[key] = clone[key]
		}
		if ('$ref' in schema) {
			console.log("ERROR: still found a $ref in schema:", schema['$ref'], "schema:", path)
			delete schema['$ref']
		}
	}
}

SchemaDereferencer.prototype.deref = function() {
	this._copyRefs(this.resolvedSchema, "")
	if (!this.derefDefs && 'definitions' in this.baseSchema) {
		delete this.resolvedSchema['definitions']
		this.resolvedSchema.definitions = deepCopy(this.baseSchema.definitions)
	}
}

SchemaDereferencer.prototype.listTargets = function() {
	const targets = Object.keys(this.refTargets)
	if (targets.length < 1) return

	targets.sort()

	for (let i = 0; i < targets.length; i++) {
		let k = targets[i]
		console.log(k + ': ' + this.refTargets[k])
	}
}

SchemaDereferencer.prototype.addTargetCount = function() {
	for (let ptr in this.refTargets) {
		let obj = getPath(this.resolvedSchema, ptr)
		obj['$count'] = this.refTargets[ptr]
	}
}

module.exports = {
	SchemaDereferencer,
}
