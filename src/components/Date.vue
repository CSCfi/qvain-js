<!-- ADD_LICENSE_HEADER -->
<template>
	<record-field v-if="isVisible" :required="isRequired" :wrapped="wrapped">
		<title-component slot="title" :title="uiLabel" />
		<small slot="help" class="text-muted">
			{{ uiDescription }}
		</small>

		<div slot="input" class="container">
			<div class="row">
				<datepicker
					:inline="false"
					placeholder="Select Date"
					monday-first
					bootstrapStyling
					typeable
					format="dd.MM.yyyy"
					:id="property + '_date'"
					v-model="date">
				</datepicker>
				<b-button
					:id="property + '_date_clear-button'"
					@click="clear()"
					variant="outline-secondary"
					class="vdp-datepicker_clear-button">
					<font-awesome-icon icon="times" fixed-width class="icon" />
				</b-button>
			</div>
		</div>
	</record-field>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
import SchemaBase from '@/widgets/base.vue'
import DeleteButton from '@/partials/DeleteButton.vue'
import InfoIcon from '@/partials/InfoIcon.vue'
import RecordField from '@/composites/RecordField.vue'
import TitleComponent from '@/partials/Title.vue'

export default {
	name: 'date',
	extends: SchemaBase,
	components: {
		Datepicker,
		DeleteButton,
		InfoIcon,
		RecordField,
		TitleComponent,
	},
	props: {
		wrapped: { type: Boolean, default: false },
	},
	data() {
		return {
			date: null,
		}
	},
	methods: {
		clear() {
			this.date = null
		},
	},
	computed: {
		dateString() {
			if (!this.date) {
				return '';
				// CSCQVAIN-129:
				// Set update payload to '' so that store empties the value.
				// This is a hack but proper implementation would require more sophisticated logic.
			}

			if (this.schema.format === 'date') {
				return this.date.toISOString().split('T')[0]
			}

			// if format is date-time
			return this.date.toISOString()
		},
	},
	created() {
		this.date = this.value ? new Date(this.value) : null
	},
	watch: {
		date() {
			this.$store.commit('updateValue', { p: this.parent, prop: this.property, val: this.dateString })
		},
	},
}
</script>

<style lang="scss">
	.widget.vdp-datepicker div input {
		border-radius: 5px;
		border: 1px solid #ced4da;
		padding: 0.375rem 0.75rem;
	}

	.vdp-datepicker_clear-button {
		border-color: #ccc;
		border-left: 0;
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
	}
</style>
