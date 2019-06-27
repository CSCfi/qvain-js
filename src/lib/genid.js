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
import murmurhash from '../../vendor/murmurhash/murmurhash3.js'

const prefix = 'q'
const salt = prefix.charCodeAt()

// Create a hash of a given string that is suitable for use in DOM element ID parameters.
export default function genid(str) {
	return prefix + murmurhash(str, salt)
}
