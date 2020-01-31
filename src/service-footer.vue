<!--
This file is part of Qvain -project.

Author(s):
	Juhapekka Piiroinen <juhapekka.piiroinen@csc.fi>
	Jori Niemi <3295718+tahme@users.noreply.github.com>

License: GPLv3

See LICENSE file for more information.
Copyright (C) 2019 Ministry of Culture and Education, Finland.
All Rights Reserved.
-->
<template>
	<footer class="footer">
		<b-container>
			<b-row>
				<b-col>
					Fairdata services are offered by the Ministry of Education and Culture.
					Produced by CSC - IT Center for Science Ltd.
					Developed by National Library 2016-2019, CSC 2019-&gt;
					<br>{{ commitHash }} - {{ version }}<br>
					<a
						target="_blank"
						href="http://digitalpreservation.fi/tietosuojaseloste"
					>Privacy Policy</a> - <a
						target="_blank"
						href="https://www.fairdata.fi/hyodyntaminen/kayttopolitiikat-ja-ehdot/"
					>Terms of Usage</a>
				</b-col>
				<b-col>
					<b-img
						src="/static/imgs/CSC.png"
						width="50"
						alt=""
						fluid
						center
					/>
				</b-col>
				<b-col>
					CSC customer support<br>
					servicedesk (at) csc.fi<br>
					+358 9 457 2821<br>
					Weekdays from 8:30 AM to 4 PM<br>
				</b-col>
			</b-row>
		</b-container>
	</footer>
</template>

<style scoped>
	.footer {
		padding: 16px;
		text-align: center;
	}
</style>

<script>
export default {
	name: 'ServiceFooter',
	components: {

	},
	computed: {
		commitHash() {
			return process.env["VUE_APP_COMMIT_HASH"]
		},
		version() {
			return process.env["VUE_APP_VERSION"]
		},
	},
}
</script>
