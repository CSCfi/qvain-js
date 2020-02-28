/*
This file is part of Qvain -project.

Author(s):
	Jori Niemi <3295718+tahme@users.noreply.github.com>

License: GPLv3

See LICENSE file for more information.
Copyright (C) 2019 Ministry of Culture and Education, Finland.
All Rights Reserved.
*/
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
