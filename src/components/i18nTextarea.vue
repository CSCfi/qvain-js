<!-- ADD_LICENSE_HEADER -->
<template>
	<record-field :required="required" :wrapped="true" :error="!isValid">
		<title-component slot="title" :title="uiLabel" />
		<small slot="help" class="text-muted">
			{{ uiDescription }}
		</small>
		
		<div slot="header-right" class="header__right">
			<ValidationStatus :status="validationStatus" />
		</div>

		<div slot="input">
			<b-tabs class="tabs-nav" v-model="tabIndex" vertical pills justified nav-wrapper-class="col-3">
				<b-tab v-for="key in languageKeys" :key="key">
					<template slot="title">
						<delete-button @click="deleteLang(key)" />
						{{ languages[key] }}
					</template>

					<b-form-textarea
						class="textarea"
						rows=6
						:placeholder="'Start typing in ' + languages[key]"
						:value="state[key]"
						:id="property + '_textarea-' + key"
						:ref="'textarea-tab-' + key"
						@input="v => changeText(key, v)">
					</b-form-textarea>
				</b-tab>

				<div slot="empty">
					<p class="intro-text">
						Start by selecting the language. You may add as many languages as you wish by clicking them from the dropdown below.
					</p>
				</div>
			</b-tabs>
			<div class="row">
				<language-select
					class="col lang-select-tab"
					ref="langSelect"
					:id="property + '_language-select'"
					@change="userRequestedNewLanguage">	
				</language-select>
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
import InfoIcon from '@/partials/InfoIcon.vue'
import DeleteButton from '@/partials/DeleteButton.vue'

import autosize from 'autosize'

export default {
	extends: vSchemaBase,
	name: 'i18n-textarea',
	description: 'a string with support for multiple languages',
	schematype: 'object',
	components: {
		LanguageSelect,
		ValidationStatus,
		RecordField,
		TitleComponent,
		InfoIcon,
		DeleteButton,
	},
	data() {
		return {
			languages: langCodes2,
			tabIndex: 0,
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
		async focusOnLastTab() {
			const last = Object.keys(this.value || {}).length - 1
			// bootstrap-vue takes a couple ticks to add a new tab to the DOM
			await this.$nextTick()
			await this.$nextTick()
			this.tabIndex = last
			this.focusOnTextarea()
		},
		async focusOnTabWithLanguage(lang) {
			const i = Object.keys(this.value || {}).indexOf(lang)
			if (i >= 0) {
				// bootstrap-vue takes a couple ticks to add a new tab to the DOM
				await this.$nextTick()
				await this.$nextTick()
				this.tabIndex = i
				return true
			}
			return false
		},
		focusOnTextarea() {
			// this gets called after switching tabs, so try to make sure the DOM updated
			this.$nextTick(() => {
				let ref = this.$refs['textarea-tab-' + this.tabIndex]
				if (Array.isArray(ref)) {
					ref = ref[0]
				}
				ref && ref.$el && ref.$el.focus()
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
	watch: {
		"$store.state.languages": function(languages) {
			this.populateLanguages(languages)
		},
	},
	created() {
		this.state = this.value || {}
		this.populateLanguages(this.$store.state.languages)
	},
}
</script>
