<!-- ADD_LICENSE_HEADER -->
<template>
	<record-field :required="required" :wrapped="true" :error="!isValid">
		<title-component slot="title" :title="uiLabel" />
		<small slot="help" class="text-muted">
			{{ uiDescription }}
		</small>
		<div slot="header-right">
			<ValidationStatus :status="validationStatus" />
		</div>
		<div slot="errors">
			<b-badge variant="danger" :key="error" v-for="error in errors">{{ error }}</b-badge>
		</div>
		<div slot="input">
			<b-form class="record-field">

				<b-form-group
						:key="lang"
						v-for="(val, lang) in state"
						label-cols=3
						:label-for="property + '_' + lang + '_input'">
					
					<span slot="label">
						{{ languages[lang] }}
						<DeleteButton slot="label" @click="deleteLanguage(lang)"/>
					</span>

					<b-input-group>
						<b-form-input
							:id="property + '_' + lang + '_input'" 
							type="text"
							:ref="lang"
							required
							:placeholder="'Start typing in ' + languages[lang]"
							v-model="state[lang]"
							@change="updateValue">
						</b-form-input>
					</b-input-group>
				</b-form-group>

				<p class="intro-text" v-if="Object.keys(state).length === 0">
					Start by selecting the language. You may add as many languages as you wish by clicking them from the dropdown below.
				</p>
				<div class="row language-row">
					<language-select
						:id="property + '_language-select'"
						class="col-md-4 col-sm-8 offset-3"
						@change="addPair" />
				</div>
			</b-form>
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
import InfoIcon from '@/partials/InfoIcon.vue'

export default {
	extends: vSchemaBase,
	name: 'i18n-string',
	description: 'a string with support for multiple languages',
	schematype: 'object',
	components: {
		LanguageSelect,
		DeleteButton,
		ValidationStatus,
		RecordField,
		TitleComponent,
		InfoIcon,
	},
	data() {
		return {
			state: {},
			languages: languages,
		}
	},
	methods: {
		addPair(lang) {
			if (!lang || lang in this.state) return
			this.$set(this.state, lang, '')
			this.$store.commit('setLanguages', {[lang]:true})
			// wait for rendering so that the ref is present in dom before focus
			this.$nextTick(() => this.$refs[lang][0].$el.focus())
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
					this.addPair(lang)
				}
			}
		},
	},
	computed: {
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
		state: {
			handler(newState, oldState) {
				const shouldClearValidation = Object.keys(newState).length < Object.keys(oldState).length
				this.updateValue()
				if (shouldClearValidation) {
					this.$store.commit('cleanStateFor', this.path)
				}
			},
			deep: true,

			"$store.state.languages": function(languages) {
				this.populateLanguages(languages)
			},
		},
	},
	created() {
		this.state = this.value
		this.populateLanguages(this.$store.state.languages)
	},
}
</script>
