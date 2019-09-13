<!-- ADD_LICENSE_HEADER -->
<template>
	<b-card
		:id="testing_id + '_card'"
		class="cursor-reset bg-light"
	>
		<h4>File metadata for PAS</h4>
		<p>Here you can edit file metadata to make your files viable for PAS. Note that these changes do not affect your dataset directly.</p>

		<table
			class="file-table"
			style="width: 100%;"
		>
			<thead>
				<th>Title</th>
				<th>Format</th>
				<th>Description</th>
			</thead>
			<tbody>
				<td>{{ dataFromServer.file_characteristics['title'] || '-' }}</td>
				<td>{{ dataFromServer.file_format || '-' }}</td>
				<td style="width: 50%;">
					{{ dataFromServer.file_characteristics['description'] || '-' }}
				</td>
			</tbody>
		</table>

		<b-alert
			variant="danger"
			:show="error"
		>
			{{ error }}
		</b-alert>

		<b-form-row class="file-metadata">
			<b-col lg="4">
				<b-form-group label="File format:">
					<b-form-select
						v-model="dataFromServer.file_characteristics.file_format"
						:options="formatOptions"
						:disabled="fieldsDisabled"
					>
						<template slot="first">
							<option
								:value="undefined"
							>
								-- Select a file format --
							</option>
						</template>
					</b-form-select>
				</b-form-group>
			</b-col>

			<b-col lg="4">
				<b-form-group label="File format version:">
					<b-form-select
						v-model="dataFromServer.file_characteristics.format_version"
						:options="versionOptions"
						:disabled="fieldsDisabled || versionOptions.length === 0"
					>
						<template slot="first">
							<option
								:value="undefined"
							>
								<span v-if="versionOptions.length > 0">
									-- Select a version --
								</span>
								<span v-else>
									-- No options available --
								</span>
							</option>
						</template>
					</b-form-select>
				</b-form-group>
			</b-col>

			<b-col lg="4">
				<b-form-group label="Encoding:">
					<b-form-select
						v-model="dataFromServer.file_characteristics.encoding"
						:options="encodingOptions"
						:disabled="fieldsDisabled"
					>
						<template slot="first">
							<option
								:value="undefined"
							>
								-- Select an encoding --
							</option>
						</template>
					</b-form-select>
				</b-form-group>
			</b-col>
		</b-form-row>

		<b-row>
			<b-col>
				<b-form-group
					label="CSV options"
					label-size="lg"
					label-class="font-weight-normal"
					class="mt-2 mb-0"
				>
					<b-form-row>
						<b-col lg="6">
							<b-form-group label="Delimiter:">
								<b-form-select
									v-model="dataFromServer.file_characteristics.csv_delimiter"
									:options="delimiterOptions"
									:disabled="fieldsDisabled"
								>
									<template slot="first">
										<option
											:value="undefined"
										>
											-- Select a delimiter --
										</option>
									</template>
								</b-form-select>
							</b-form-group>
						</b-col>
						<b-col lg="6">
							<b-form-group label="Quoting character (defaults: \ ):">
								<b-form-input
									v-model="dataFromServer.file_characteristics.csv_quoting_char"
									placeholder="Enter quoting character"
									:disabled="fieldsDisabled"
								/>
							</b-form-group>
						</b-col>
						<b-col lg="6">
							<b-form-group label="Record separator:">
								<b-form-select
									v-model="dataFromServer.file_characteristics.csv_record_separator"
									:options="separatorOptions"
									:disabled="fieldsDisabled"
								>
									<template slot="first">
										<option
											:value="undefined"
										>
											-- Select a record separator --
										</option>
									</template>
								</b-form-select>
							</b-form-group>
						</b-col>
						<b-col lg="6">
							<b-form-group label="Header:">
								<b-form-checkbox
									v-model="dataFromServer.file_characteristics.csv_has_header"
									name="check-button"
									switch
									:disabled="fieldsDisabled"
								>
									Header in file?
								</b-form-checkbox>
							</b-form-group>
						</b-col>
					</b-form-row>
				</b-form-group>
			</b-col>
		</b-row>

		<p
			v-if="file"
			class="info-text"
		>
			Note! By saving the data you are changing the file metadata regardless whether you select the file into your dataset or not. Dataset is not saved / published!
		</p>
		<p
			v-else
			class="info-text"
		>
			Note! By saving the data you are changing the file metadata FOR ALL THE FILES IN THE FOLDER regardless whether you select the files / folder into your dataset or not. Dataset is not saved / published!
		</p>
		<b-alert
			:show="saveResult === 'failed'"
			variant="danger"
			dismissible
		>
			Something went wrong. Your changes are not saved. Please try again.
		</b-alert>
		<b-alert
			:show="saveResult === 'success'"
			variant="success"
			dismissible
		>
			The file metadata was successfully saved.
		</b-alert>
		<b-button
			:disabled="fieldsDisabled"
			variant="primary"
			class="w-100"
			@click="save"
		>
			Save PAS Metadata
		</b-button>
	</b-card>
</template>

<style lang="scss" scoped>

.first-row {
	padding: 5px;
	> * {
		display: inline-block;
		width: 30%;
	}
	> *:not(:first-child) {
		margin-left: 5px;
	}
}
.info-text {
	padding-bottom: 20px;
	padding-top: 20px;
	padding-left: 60px;
	padding-right: 60px;
}
</style>

<style lang="scss">
table.file-table thead th {
    border-top: 0px;
}

.file-metadata > * {
	margin-bottom: 0.5rem;
}
</style>

<script>
import axios from 'axios'
import esApiClient from '@/widgets/refdata/es.js'

export default {
	name: 'PASMetadata',
	props: {
		identifier: {
			type: String,
			required: true,
		},
		file: {
			type: Object,
			default: null,
		},
		folder: {
			type: Object,
			default: null,
		},
		readOnly: {
			type: Boolean,
		},
	},
	data() {
		return {
			dataFromServer: null,
			saveResult: null,
			separatorOptions: [
				{ value: 'LF', text: 'LF (default)' },
				{ value: 'CRLF', text: 'CRLF' },
				{ value: 'CR', text: 'CR' },
				/* CR LF (Windows), LF (Unix) and CR (Macintosh) line break types.
					The Carriage Return (CR) character (0x0D, \r) moves the cursor to the beginning of the line without advancing to the next line.
					This character is used as a new line character in Commodore and Early Macintosh operating systems (OS-9 and earlier).

					The Line Feed (LF) character (0x0A, \n) moves the cursor down to the next line without returning to the beginning of the line.
					This character is used as a new line character in UNIX based systems (Linux, Mac OSX, etc)

					The End of Line (EOL) sequence (0x0D 0x0A, \r\n) is actually two ASCII characters, a combination of the CR and LF characters.
					It moves the cursor both down to the next line and to the beginning of that line.
					This character is used as a new line character in most other non-Unix operating systems including Microsoft Windows, Symbian OS and others.

					Source: https://stackoverflow.com/questions/1552749/difference-between-cr-lf-lf-and-cr-line-break-types
				*/
			],
			delimiterOptions: [
				{ value: '\t', text: 'Tab' },
				{ value: ' ', text: 'Space' },
				{ value: ';', text: 'Semicolon' },
				{ value: ',', text: 'Comma (default)' },
				{ value: ':', text: 'Colon' },
				{ value: '.', text: 'Dot' },
				{ value: '|', text: 'Pipe' },
			],
			encodingOptions: [
				{ value: 'UTF-8', text: 'UTF-8 (default)' },
				{ value: 'UTF-16', text: 'UTF-16' },
				{ value: 'UTF-32', text: 'UTF-32' },
				{ value: 'ISO-8859-15', text: 'ISO-8859-15' },
			],
			formatOptions: [],
			formatVersionsMap: {},
			error: null,
		}
	},
	computed: {
		fieldsDisabled() {
			return !!(this.readOnly || this.error)
		},
		versionOptions() {
			return this.formatVersionsMap[this.dataFromServer.file_characteristics.file_format] || []
		},
		testing_id() {
			return `${this.identifier}_PAS_METADATA`
		},
		payload() {
			// TODO: extend here to support folders
			return Object.assign(
				{ identifier: this.identifier },
				this.createPayload(this.dataFromServer)
			)
		},
	},
	watch: {
		"dataFromServer.file_characteristics.file_format"(newFormat, oldFormat) {
			if (oldFormat && oldFormat !== newFormat) {
				this.dataFromServer.file_characteristics.format_version = undefined
			}
		},
	},

	created() {
		this.loadOptions()
		this.dataFromServer = JSON.parse(JSON.stringify(this.file)) // copy data for editing
	},
	methods: {
		async loadOptions() {
			this.formatOptions = []
			this.formatVersionsMap = {}
			try {
				const resp = await esApiClient('reference_data','file_format_version')
				const options = resp.data.hits.hits.map(v => v._source)

				// get array of available versions for each file format
				const formatVersionsMap = {}
				options.forEach(option => {
					if (formatVersionsMap[option.input_file_format] === undefined) {
						formatVersionsMap[option.input_file_format] = []
					}
					if (option.output_format_version !== "") {
						formatVersionsMap[option.input_file_format].push(option.output_format_version)
					}
				})

				// use natural sort order for version numbers
				const sortArray = (arr => arr.sort(
					(a,b) =>a.localeCompare(b, undefined, { numeric: true })
				))
				Object.values(formatVersionsMap).forEach(versions => sortArray(versions))
				const formatOptions = Object.keys(formatVersionsMap)
				sortArray(formatOptions)

				this.formatOptions = formatOptions
				this.formatVersionsMap = formatVersionsMap
			} catch (e) {
				// show the currently selected file_format/file_version option
				const format = this.dataFromServer.file_characteristics.file_format
				const version = this.dataFromServer.file_characteristics.format_version
				if (format) {
					this.formatOptions = [format]
					if (version) {
						this.formatVersionsMap = { [format]: [version] }
					}
				}

				this.error = "Error retrieving file format information."
			}
		},
		createPayload(state) {
			const payload = {
				// take copy for later delete calls
				file_characteristics: Object.assign({}, state.file_characteristics),
			}

			// always include encoding if present
			if (state.encoding) {
				payload.encoding = state.encoding
			}
			return payload
		},
		// needs to support adding values and updating values. Should be able to delete csv values
		async save() {
			try {
				this.saveResult = null // reset save failed/success alert
				const { data: { success, failed }} = await axios.patch('files/', [this.payload], {
					baseURL: process.env.VUE_APP_METAX_FILEAPI_URL,
				})
				if (failed.length > 0) {
					this.saveResult = 'failed'
				} else {
					this.saveResult = 'success'
					this.dataFromServer = success[0].object // set ui values based on save result
					this.$emit('saved', this.dataFromServer)
				}
			} catch (error) {
				this.saveResult = 'failed'
				if (error.response && error.response.status == 401) {
					// there was a permission error
					// we should redirect the user to login
					await this.$auth.logoutDueSessionTimeout()
					this.$router.push({ name: "home", params: { missingSession: true }})
				} else {
					throw error
				}
			}

		},
	},
}
</script>
