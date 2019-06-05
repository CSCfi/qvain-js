<template>
	<record-field v-if="visible" :required="isRequired" :wrapped="wrapped">
		<title-component slot="title" :title="uiLabel" />
		<div slot="header-right">
			<InfoIcon :description="uiDescription"/>
		</div>

		<div slot="input">
			<div class="wrap">
				<p>Select date:</p>
				<datepicker class="widget ml-2"
					placeholder="Click to select"
					v-model="date">
				</datepicker>
			</div>

			<delete-button v-if="date !== null" @click="clear()" />
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
				return null
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


<style lang="scss" scoped>
	.wrap {
		display: inline-flex;
		> p {
			line-height: 40px;
			vertical-align: middle;
		}
		margin-right: 6px;
	}
</style>

<style lang="scss">
	.widget.vdp-datepicker div input {
		border-radius: 5px;
		border: 1px solid #ced4da;
		padding: 0.375rem 0.75rem;
	}
</style>
