<!-- ADD_LICENSE_HEADER -->
<template>
	<wrapper
		:wrapped="wrapped"
		:error="error"
	>
		<div
			v-if="header"
			class="header"
		>
			<b-container fluid>
				<b-row class="row">
					<b-col>
						<slot name="title" />
						<b-badge
							v-if="required"
							variant="danger"
						>
							REQUIRED
						</b-badge>
					</b-col>
				</b-row>
				<b-row>
					<b-col>
						<slot name="help" />
					</b-col>
				</b-row>
			</b-container>
			<div class="header__right">
				<slot name="header-right" />
			</div>
		</div>

		<b-container
			v-if="hasErrorsSlot"
			class="error-container"
		>
			<slot name="errors" />
		</b-container>

		<b-container><slot name="input" /></b-container>
	</wrapper>
</template>


<style lang="scss" scoped>

.header {
	width: 100%;
	display: inline-flex;
	margin-bottom: 0.1em;

	&__label {
		display: inline-flex;
	}

	&__right {
		margin-left: auto;
		//display: inline-flex; // inline things in component using this
	}

	&__required {
		color: red;
	}
	* .badge {
		vertical-align: middle;
		margin-top: -0.5em;
		font-size: 0.8em;
	}
}
.error-container {
	margin-bottom: 1em;
}

</style>

<script>
import Wrapper from '@/components/Wrapper.vue'
export default {
	name: 'RecordField',
	components: {
		Wrapper,
	},
	props: {
		wrapped: {
			type: Boolean,
			default: false,
		},
		required: {
			type: Boolean,
			default: false,
		},
		header: {
			type: Boolean,
			default: true,
		},
		error: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		hasErrorsSlot() {
			return !!this.$slots['errors']
		},
	},
}
</script>
