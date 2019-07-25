
const difftree = (a, b) => {
	const diffs = []

	const remtree = (a, path) => {
		diffs.push({path: path, change: "-", val: a})
		return

		const sep = path === "" ? "" : "."
		if (typeof a == "object") {
			for (const key in a) {
				remtree(a[key], path + sep + key)
			}
		} else {
			diffs.push({path: path, change: "-", val: a})
		}
	}

	const addtree = (a, path) => {
		diffs.push({path: path, change: "+", val: a})
		return


		const sep = path === "" ? "" : "."
		if (typeof a == "object") {
			for (const key in a) {
				addtree(a[key], path + sep + key)
			}
		} else {
			diffs.push({path: path, change: "+", val: a})
		}
	}

	const diff = (a, b, path) => {
		let sep = "."
		if (!path) {
			path = ""
			sep = ""
		}

		for (const key in a) {
			if (typeof a[key] == "object") {
				if (typeof b[key] == "object") {
					diff(a[key], b[key], path + sep + key)
				} else if (b[key] === undefined) {
					remtree(a[key], path + sep + key)
				} else {
					remtree(a[key], path + sep + key)
					addtree(b, path)
				}
			} else {
				if (typeof b[key] == "object") {
					remtree(a[key], path + key)
				} else {
					if (b[key] === undefined) {
						diffs.push({path: path + sep + key, change: "-", val: a[key]})
					} else if (a[key] !== b[key]) {
						diffs.push({path: path + sep + key, change: "=", val: b[key], oldVal: a[key]})
					}
				}
			}
		}
		for (const key in b) {
			if (Object.keys(a).includes(key)) continue
			if (a[key] === undefined) {
				addtree(b[key], path + sep + key)
			}
		}
	}

	diff(a, b)
	return diffs
}

export default difftree