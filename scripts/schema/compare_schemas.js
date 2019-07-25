/* ADD_LICENSE_HEADER */
/* eslint-disable no-console */
"use strict"

const { resolve } = require("path")

// Compare trees recursively and print differences.
const difftree = (a, b, deep) => {
	const diffs = []
	if (deep === undefined) {
		deep = false
	}

	const remtree = (v, path) => {
		if (v === undefined) {
			return
		}
		if (!deep) {
			diffs.push({ path: path, change: "-", val: v })
		} else {
			const sep = path === "" ? "" : "."
			if (typeof v === "object") {
				for (const key in v) {
					remtree(v[key], path + sep + key)
				}
			} else {
				diffs.push({ path: path, change: "-", val: v })
			}
		}
	}

	const addtree = (v, path) => {
		if (v === undefined) {
			return
		}
		if (!deep) {
			diffs.push({ path: path, change: "+", val: v })
		} else {
			const sep = path === "" ? "" : "."
			if (typeof v === "object") {
				for (const key in v) {
					addtree(v[key], path + sep + key)
				}
			} else if (v !== undefined) {
				diffs.push({ path: path, change: "+", val: a })
			}
		}
	}

	const diff = (a, b, path) => {
		let sep = "."
		if (!path) {
			path = ""
			sep = ""
		}

		const combined = Object.assign({}, a, b)
		for (const key in combined) {
			if (a[key] === b[key]) {
				continue
			} else if (typeof a[key] === "object" && typeof b[key] === "object") {
				diff(a[key], b[key], path + sep + key)
			} else if (typeof a[key] === "object" || typeof b[key] === "object" || a[key] === undefined || b[key] === undefined) {
				remtree(a[key], path + sep + key)
				addtree(b[key], path + sep + key)
			} else {
				diffs.push({
					path: path + sep + key,
					change: "=",
					val: b[key],
					oldVal: a[key],
				})
			}
		}
	}

	diff(a, b)
	return diffs
}

function test() {
	let fail = 0
	let succ = 0
	function check(d, success) {
		succ += success
		fail += !success
		if (fail) {
			console.log("#" + (succ+fail) + " failed")
		}
	}

	const primitive = "primitive"
	const changed = "changed"
	const object = { "hello": "world" }
	let d

	function dt(a,b) {
		try {
			const d =  difftree(a,b)
			console.log(d)
			return d
		} catch (e) {
			console.log(e)
			return [e]
		}
	}

	// a missing,   b missing
	d = dt({}, {})
	check(d, d.length === 0)

	// a missing,   b primitive
	d = dt({}, { 'key': primitive })
	check(d, d.length === 1 && d[0].change === "+" && d[0].val === primitive)

	// a missing,   b object
	d = dt({}, { 'key': object })
	check(d, d.length === 1 && d[0].change === "+" && d[0].val === object)

	// a primitive, b missing
	d = dt({ 'key': primitive }, {})
	check(d, d.length === 1 && d[0].change === "-" && d[0].val === primitive)

	// a primitive, b primitive, a == b
	d = dt({ 'key': primitive }, { 'key': primitive })
	check(d, d.length === 0)

	// a primitive, b primitive, a != b
	d = dt({ 'key': primitive }, { 'key': changed })
	check(d, d.length === 1 && d[0].change === "=" && d[0].oldVal === primitive && d[0].val === changed)

	// a primitive, b object
	d = dt({ 'key': primitive }, { 'key': object })
	check(d, d.length === 2 &&
		d[0].change === "-" && d[0].val === primitive &&
		d[1].change === "+" && d[1].val === object)

	// a object,    b missing
	d = dt({ 'key': object }, {})
	check(d, d.length === 1 && d[0].change === "-" && d[0].val === object)

	// a object,    b primitive
	d = dt({ 'key': object }, { 'key': primitive })
	check(d, d.length === 2 &&
		d[0].change === "-" && d[0].val === object &&
		d[1].change === "+" && d[1].val === primitive)

	// a object,    b object
	d = dt({ 'key': object }, { 'key': object })
	check(d, d.length === 0)

	console.log(`successful: ${succ}, failed: ${fail}`)
}


// Use -d parameter to show entire content of removed/added branches.
let deep = false
const args = process.argv.slice(2)

const dIndex = args.indexOf("-d")
if (dIndex >= 0) {
	args.splice(dIndex, 1)
	deep = true
}

if (args.length === 1 && args[0] === "-t") {
	test()
	return
}

if (args.length !== 2) {
	console.log("node compare_schemas.js [-d] schema_from schema_to")
	console.log("  or to run tests")
	console.log("node compare_schemas.js -t")
} else {
	const schemaFrom = require(resolve(args[0]))
	const schemaTo = require(resolve(args[1]))

	const diffs = difftree(schemaFrom, schemaTo, deep)
	diffs.sort((a,b)=>a.path.localeCompare(b.path))
	diffs.forEach((line)=> {
		if (line.oldVal !== undefined) {
			console.log(line.change + " " + line.path + ": " + line.oldVal + " -> "+ line.val)
		} else {
			console.log(line.change + " " + line.path + ": " + line.val)
		}
	})
}
