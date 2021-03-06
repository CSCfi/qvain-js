<!--
This file is part of Qvain -project.

Author(s):
	Juhapekka Piiroinen <jp@1337.fi>
	Wouter Van Hemel <wouter.van.hemel@helsinki.fi>
	Jori Niemi <3295718+tahme@users.noreply.github.com>
	Eemeli Kouhia <eemeli.kouhia@gofore.com>
	Shreyas Deshpande <31839853+ShreyasDeshpande@users.noreply.github.com>

License: GPLv3

See LICENSE file for more information.
Copyright (C) 2019 Ministry of Culture and Education, Finland.
All Rights Reserved.
-->
<template>
	<record-field
		:required="required"
		:wrapped="true"
		:error="!isValid"
	>
		<title-component
			slot="title"
			:title="uiLabel"
		/>
		<small
			slot="help"
			class="text-muted"
		>
			{{ uiDescription }}
		</small>

		<div
			slot="header-right"
			class="header__right"
		>
			<ValidationStatus :status="validationStatus" />
		</div>

		<div slot="input">
			<b-tabs
				v-model="tabIndex"
				class="tabs-nav"
				vertical
				pills
				justified
				no-fade
				nav-wrapper-class="col-3"
				@input="tabShown"
				@changed="tabsChanged"
			>
				<b-tab
					v-for="(key, index) in languageKeys"
					:key="key"
					@click="setTab(index)"
				>
					<template slot="title">
						<delete-button
							:disabled="readOnly"
							@click="deleteLang(key)"
						/>
						{{ languages[key] }}
					</template>

					<b-form-textarea
						:id="property + '_textarea-' + key"
						:ref="'textarea-tab-' + key"
						class="textarea"
						rows="6"
						:placeholder="'Start typing in ' + languages[key]"
						:value="state[key]"
						:disabled="readOnly"
						:lang="key"
						:aria-label="uiLabel + ' in ' + languages[key]"
						@input="v => changeText(key, v)"
					/>
				</b-tab>

				<div slot="empty">
					<p class="intro-text">
						Start by selecting the language. You may add as many languages as you wish by clicking them from the dropdown below.
					</p>
				</div>
			</b-tabs>
			<div
				v-if="!readOnly"
				class="row"
			>
				<language-select
					:id="property + '_language-select'"
					ref="langSelect"
					class="col lang-select-tab"
					@change="userRequestedNewLanguage"
				/>
			</div>
		</div>
	</record-field>
</template>

<style lang="scss" scoped>
.lang-select-tab {
	margin-top: 1em;
	margin-bottom: 0;
}

.intro-text {
	text-align: center;
}

.card-body {
	padding: 0 !important;
	height: auto;
	textarea {
		height: auto;
	}
}


</style>


<script>
import vSchemaBase from '@/widgets/base.vue'
import langCodes2 from '@/data/iso639-1.json'
import LanguageSelect from '@/components/LanguageSelect.vue'
import ValidationStatus from '@/partials/ValidationStatus.vue'
import RecordField from '@/composites/RecordField.vue'
import TitleComponent from '@/partials/Title.vue'
import DeleteButton from '@/partials/DeleteButton.vue'

import autosize from 'autosize'

export default {
	name: 'I18nTextarea',
	components: {
		LanguageSelect,
		ValidationStatus,
		RecordField,
		TitleComponent,
		DeleteButton,
	},
	extends: vSchemaBase,
	description: 'a string with support for multiple languages',
	schematype: 'object',
	data() {
		return {
			languages: langCodes2,
			tabIndex: 0,
			targetTabIndex: null,
			state: {},
		}
	},
	computed: {
		languageKeys() {
			return Object.keys(this.value)
		},
		hasEmptyValues() {
			return Object.values(this.state).some(v => v.length == 0)
		},
		validationStatus() {
			if (this.isValid && this.hasEmptyValues) return 'uncertain'
			if (this.isValid) return 'valid'
			return 'invalid'
		},
	},
	watch: {
		"$store.state.languages": function(languages) {
			this.populateLanguages(languages)
		},
	},
	created() {
		this.state = this.value || {}
		this.populateLanguages(this.$store.state.languages)
	},
	methods: {
		userRequestedNewLanguage: function(lang) {
			this.addLanguage(lang)
			this.focusOnLastTab()
		},
		changeText(key, value) {
			const el = this.$refs['textarea-tab-' + key][0].$el
			autosize(el)

			this.$set(this.state, key, value)
			this.updateValue()
		},
		addLanguage(lang) {
			if (lang in this.state) {
				return
			}
			this.$set(this.state, lang, '')
			this.$store.commit('setLanguages', { [lang]:true })
		},
		deleteLang(lang) {
			this.$delete(this.state, lang)
		},
		updateValue() {
			this.$store.commit('updateValue', {
				p: this.parent,
				prop: this.property,
				val: this.state,
			})
		},
		focusOnLastTab() {
			const lastIndex = Object.keys(this.value || {}).length - 1
			this.setTab(lastIndex, true)
		},
		focusOnTabWithLanguage(lang) {
			const i = Object.keys(this.value || {}).indexOf(lang)
			if (i >= 0) {
				this.setTab(i)
				return true
			}
			return false
		},
		focusOnTextarea() {
			let ref = this.$refs['textarea-tab-' + Object.keys(this.value || {})[this.tabIndex]]
			if (Array.isArray(ref)) {
				ref = ref[0]
			}
			ref && ref.$el && ref.$el.focus()
		},
		populateLanguages(languages) {
			for (const lang in languages) {
				if (languages[lang]) {
					this.addLanguage(lang)
				}
			}
		},
		setTab(index) {
			this.tabIndex = index
			this.targetTabIndex = index
		},
		async tabShown(index) {
			if (index === this.targetTabIndex) {
				this.targetTabIndex = null
				await this.$nextTick() // wait for the textarea to become visible
				this.focusOnTextarea()
			}
		},
		tabsChanged() {
			if (this.targetTabIndex !== null) {
				this.tabIndex = this.targetTabIndex
			}
		},
	},
}
</script>
