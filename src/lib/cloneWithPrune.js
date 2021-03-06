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
/*
	Make a deep clone of an object, removing specified keys and values and pruning empty branches and leaves.
	Only supports JSON primitive types.

	Loosely based on deepCopy:

	https://www.npmjs.com/package/json-deep-copy
	https://github.com/zxdong262/deep-copy
	https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript
*/
export default function cloneWithPrune(src, keys, values) {
	if (src == null || typeof src !== 'object') return src

	if (Array.isArray(src)) {
		// remove values with a match in the values array
		let ret = src.filter(value => values.indexOf(value) < 0)
		let i = ret.length
		while (i--) {
			ret[i] = cloneWithPrune(ret[i], keys, values)
		}
		return ret
	}

	let dest = {}
	for (let key in src) {
		if (keys.indexOf(key) >= 0) continue
		if (values.indexOf(src[key]) >= 0) continue
		if (src[key] && typeof src[key] === 'object') {
			let maybe = cloneWithPrune(src[key], keys, values)
			if (Array.isArray(maybe) && maybe.length === 0) continue
			else if (Object.keys(maybe).length === 0) continue

			dest[key] = maybe
		} else {
			dest[key] = src[key]
		}
	}

	if ('@type' in dest && Object.keys(dest).length === 1) {
		dest = {}
	}
	return dest
}
