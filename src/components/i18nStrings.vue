<!--
This file is part of Qvain -project.

Author(s):
	Juhapekka Piiroinen <jp@1337.fi>
	Eemeli Kouhia <eemeli.kouhia@gofore.com>
	Wouter Van Hemel <wouter.van.hemel@helsinki.fi>
	Jori Niemi <3295718+tahme@users.noreply.github.com>
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
		<div slot="header-right">
			<ValidationStatus :status="validationStatus" />
		</div>
		<div slot="errors">
			<b-badge
				v-for="error in errors"
				:key="error"
				variant="danger"
			>
				{{ error }}
			</b-badge>
		</div>
		<div slot="input">
			<div class="record-field">
				<b-form-group
					v-for="(val, lang) in state"
					:key="lang"
					label-cols="3"
					:label-for="property + '_' + lang + '_input'"
				>
					<span slot="label">
						<DeleteButton
							slot="label"
							:disabled="readOnly"
							@click="deleteLanguage(lang)"
						/>
						{{ languages[lang] }}
					</span>

					<b-input-group>
						<b-form-input
							:id="property + '_' + lang + '_input'"
							:ref="lang"
							v-model="state[lang]"
							type="text"
							required
							:placeholder="'Start typing in ' + languages[lang]"
							:disabled="readOnly"
							:lang="lang"
							@input="updateValue"
						/>
					</b-input-group>
				</b-form-group>

				<p
					v-if="Object.keys(state).length === 0"
					class="intro-text"
				>
					Start by selecting the language. You may add as many languages as you wish by clicking them from the dropdown below.
				</p>
				<div
					v-if="!readOnly"
					class="row language-row"
				>
					<language-select
						:id="property + '_language-select'"
						class="col"
						@change="userRequestedNewLanguage"
					/>
				</div>
			</div>
		</div>
	</record-field>
</template>


<style lang="scss" scoped>
.error-message {
	display: inline-block;
}

.intro-text {
	text-align: center;
	margin: 0;
}

.record-field > * {
	margin-top: 0.5em;
	margin-bottom: 0.5em;
}

.language-row {
	margin-top: 1em;
}
</style>

<script>

import languages from '../data/iso639-1.json'
import vSchemaBase from '@/widgets/base.vue'
import LanguageSelect from '@/components/LanguageSelect.vue'
import DeleteButton from '@/partials/DeleteButton.vue'
import ValidationStatus from '@/partials/ValidationStatus.vue'
import RecordField from '@/composites/RecordField.vue'
import TitleComponent from '@/partials/Title.vue'

export default {
	name: 'I18nString',
	components: {
		LanguageSelect,
		DeleteButton,
		ValidationStatus,
		RecordField,
		TitleComponent,
	},
	extends: vSchemaBase,
	description: 'a string with support for multiple languages',
	schematype: 'object',
	data() {
		return {
			state: {},
			languages: languages,
		}
	},
	computed: {
		hasEmptyValues() {
			return Object.values(this.state).some(v => v !== undefined && v.length == 0)
		},
		validationStatus() {
			if (this.isValid && this.hasEmptyValues) return 'uncertain'
			if (this.isValid) return 'valid'
			return 'invalid'
		},
	},
	watch: {
		state: {
			handler(newState, oldState) {
				const shouldClearValidation = Object.keys(newState).length < Object.keys(oldState).length
				if (shouldClearValidation) {
					this.$store.commit('cleanStateFor', this.path)
				}
			},
			deep: true,
		},
		"$store.state.languages": function(languages) {
			this.populateLanguages(languages)
		},
	},
	created() {
		this.state = this.value
		this.populateLanguages(this.$store.state.languages)
	},
	methods: {
		userRequestedNewLanguage(lang) {
			this.addLanguage(lang)
			// wait for rendering so that the ref is present in dom before focus
			this.$nextTick(() => this.$refs[lang][0].$el.focus())
		},
		addLanguage(lang) {
			if (!lang || lang in this.state) return
			this.$set(this.state, lang, '')
			this.$store.commit('setLanguages', { [lang]:true })
		},
		deleteLanguage(lang) {
			this.$delete(this.state, lang)
		},
		updateValue() {
			this.$store.commit('updateValue', {
				p: this.parent,
				prop: this.property,
				val: this.state,
			})
		},
		populateLanguages(languages) {
			for (const lang in languages) {
				if (languages[lang]) {
					this.addLanguage(lang)
				}
			}
		},
	},
}
</script>
