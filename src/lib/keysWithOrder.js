/*
This file is part of Qvain -project.

Author(s):
	Juhapekka Piiroinen <jp@1337.fi>
	Wouter Van Hemel <wouter.van.hemel@helsinki.fi>

License: GPLv3

See LICENSE file for more information.
Copyright (C) 2019 Ministry of Culture and Education, Finland.
All Rights Reserved.
*/
// keysWithOrder takes an object and array and returns the keys of that object with those in the array sorted first (and then the rest).
export default function keysWithOrder(obj, order) {
	// NOTE: IE11 doesn't support Set(iterator)
	let keySet = new Set(order.filter(x => x in obj))
	Object.keys(obj).forEach(k => keySet.add(k))
	return Array.from(keySet)
}
