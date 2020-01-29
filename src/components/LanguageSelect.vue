<!-- ADD_LICENSE_HEADER -->
<template>
	<b-input-group class="language_select">
		<b-input-group-text
			slot="prepend"
			class="height"
		>
			<font-awesome-icon
				icon="plus"
				fixed-width
				class="text-dark"
			/>
		</b-input-group-text>
		<b-form-select
			v-model="state"
			class="select"
			:options="languages"
			:disabled="disabled"
			v-bind="$attrs"
			:aria-labelledby="placeholderId"
			v-on="$listeners"
			@change="reset"
		>
			<template slot="first">
				<option
					:id="placeholderId"
					:value="undefined"
					disabled
					class="text-muted"
				>
					{{ placeholder }}
				</option>
			</template>
		</b-form-select>
	</b-input-group>
</template>

<style lang="scss" scoped>
.height {
	height: 38px;
}
</style>


<script>

import langCodes2 from '@/data/iso639-1.json'

export default {
	name: 'LanguageSelect',
	props: {
		value: String,
		placeholder: {
			type: String,
			default: "Add translation",
		},
		disabled: Boolean,
	},
	data() {
		return {
			languages: langCodes2,
			state: undefined,
		}
	},
	computed: {
		placeholderId() {
			return this.$attrs.id + '_placeholder'
		},
	},
	methods: {
		reset() {
			this.state = undefined
		},
	},
}
</script>
