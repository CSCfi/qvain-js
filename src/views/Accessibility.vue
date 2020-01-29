<!-- ADD_LICENSE_HEADER -->
<template>
	<b-container>
		<h1 class="component-title">
			Accessibility Statement
		</h1>
		<p>
			The Accessibility Statement is available from the following links:
			<ul>
				<li>
					<a
						class="link"
						target="_blank"
						href="/static/accessibility/accessibility_statement.html"
					>Qvain Accessibility Statement (HTML)</a>
				</li>
				<li>
					<a
						class="link"
						target="_blank"
						href="/static/accessibility/accessibility_statement.pdf"
					>Qvain Accessibility Statement (PDF)</a>
				</li>
			</ul>
		</p>
	</b-container>
</template>

<style lang="scss" scoped>
.link {
	text-decoration: underline;
	font-weight: 400;
	color: $gray-700;
}
</style>

<script>
export default {
	name: "Accessibility",
}
</script>
