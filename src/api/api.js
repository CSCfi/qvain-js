/*
This file is part of Qvain -project.

Author(s):
	Juhapekka Piiroinen <jp@1337.fi>
	Wouter Van Hemel <wouter.van.hemel@helsinki.fi>
	Eemeli Kouhia <eemeli.kouhia@gofore.com>

License: GPLv3

See LICENSE file for more information.
Copyright (C) 2019 Ministry of Culture and Education, Finland.
All Rights Reserved.
*/
import apiClient from '@/api/client.js'

export default {
	async getDataset(id) {
		const res = await apiClient.get(`/datasets/${id}`)
		return res.data
	},
}
