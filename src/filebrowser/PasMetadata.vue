<!-- ADD_LICENSE_HEADER -->
<template>
	<b-card :id="testing_id + '_card'" class="cursor-reset bg-light">
		<h4>File metadata for PAS</h4>
		<p>Here you can edit file metadata to make your files viable for PAS. Note that these changes do not affect your dataset directly.</p>

		<table class="file-table" style="width: 100%;">
			<thead>
				<th>Title</th>
				<th>Format</th>
				<th>Description</th>
			</thead>
			<tbody>
				<td>{{ dataFromServer.file_characteristics['title'] || '-' }}</td>
				<td>{{ dataFromServer.file_format || '-' }}</td>
				<td style="width: 50%;">{{ dataFromServer.file_characteristics['description'] || '-' }}</td>
			</tbody>
		</table>

		<b-row>
			<b-col lg="6">
				<b-form-group label="Encoding:">
					<b-form-select
						v-model="dataFromServer.file_characteristics.encoding"
						:options="encodingOptions"
						:disabled="readOnly"
					>
						<template slot="first">
							<option :value="undefined" disabled>-- Select an encoding --</option>
						</template>
					</b-form-select>
				</b-form-group>
			</b-col>

			<b-col lg="6">
				<b-form-group label="Sequential settings:">
					<b-form-checkbox
						v-model="sequential"
						class=""
						name="check-button"
						switch
						:disabled="readOnly"
					>
						This file is a sequential file (for example csv file)
					</b-form-checkbox>
				</b-form-group>
			</b-col>
		</b-row>

		<b-row v-if="sequential" style="margin-bottom: 10px;">
			<b-col lg="6">
				<b-form-group label="Delimiter:">
					<b-form-select
						v-model="dataFromServer.file_characteristics.csv_delimiter"
						:options="delimiterOptions"
						:disabled="readOnly"
					>
						<template slot="first">
							<option :value="undefined" disabled>-- Select a delimiter --</option>
						</template>
					</b-form-select>
				</b-form-group>
			</b-col>
			<b-col lg="6">
				<b-form-group label="Quoting character (defaults: \ ):">
					<b-form-input
						v-model="dataFromServer.file_characteristics.csv_quoting_char"
						placeholder="Enter quoting character"
						:disabled="readOnly"
					/>
				</b-form-group>
			</b-col>
		</b-row>

		<b-row v-if="sequential" style="margin-bottom: 10px;">
			<b-col lg="6">
				<b-form-group label="Record separator:">
					<b-form-select
						v-model="dataFromServer.file_characteristics.csv_record_separator"
						:options="separatorOptions"
						:disabled="readOnly"
					>
						<template slot="first">
							<option :value="undefined" disabled>-- Select a record separator --</option>
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
						:disabled="readOnly"
					>
						Header in file?
					</b-form-checkbox>
				</b-form-group>
			</b-col>
		</b-row>

		<p class="info-text" v-if="file"> Note! By saving the data you are changing the file metadata regardless whether you select the file into your dataset or not. Dataset is not saved / published!</p>
		<p class="info-text" v-else> Note! By saving the data you are changing the file metadata FOR ALL THE FILES IN THE FOLDER regardless whether you select the files / folder into your dataset or not. Dataset is not saved / published!</p>
		<b-alert :show="saveResult === 'failed'" variant="danger" dismissible>Something went wrong. Your changes are not saved. Please try again.</b-alert>
		<b-alert :show="saveResult === 'success'" variant="success" dismissible>The file metadata was successfully saved.</b-alert>
		<b-button
			:disabled="readOnly"
			variant="primary"
			class="w-100"
			@click="save"
		>Save PAS Metadata</b-button>
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
</style>

<script>
import axios from 'axios'
import dateFormat from 'date-fns/format'

export default {
	name: 'PAS-metadata',
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
	computed: {
		testing_id() {
			return `${this.identifier}_PAS_METADATA`;
		},
		payload() {
			// TODO: extend here to support folders
			return Object.assign(
				{ identifier: this.identifier },
				this.createPayload(this.dataFromServer, this.sequential)
			);
		}
	},
	methods: {
		createPayload(state, sequential) {
			const payload = {
				// take copy for later delete calls
				file_characteristics: Object.assign({}, state.file_characteristics)
			};

			// always include encoding if present
			if (state.encoding) {
				payload.encoding = state.encoding;
			}

			if (sequential) {
				payload.file_format = 'text/csv';
			} else {
				// Note: by the default set file_format to text/plain if not defined or csv
				payload.file_format = state.file_format !== 'text/csv' ? state.file_format : 'text/plain';

				// remove csv info if not sequential
				delete payload.file_characteristics.csv_delimiter;
				delete payload.file_characteristics.csv_has_header;
				delete payload.file_characteristics.csv_record_separator;
				delete payload.file_characteristics.csv_quoting_char;
			}

			return payload;
		},
		// needs to support adding values and updating values. Should be able to delete csv values
		async save() {
			try {
				this.saveResult = null; // reset save failed/success alert
				const { data: { success, failed } } = await axios.patch('files/', [this.payload], {
					baseURL: process.env.VUE_APP_METAX_FILEAPI_URL,
				});
				if (failed.length > 0) {
					this.saveResult = 'failed';
				} else {
					this.saveResult = 'success';
					this.dataFromServer = success[0].object; // set ui values based on save result
					this.$emit('saved', this.dataFromServer)
				}
			} catch (error) {
				this.saveResult = 'failed';
				if (error.response && error.response.status == 401) {
					// there was a permission error
					// we should redirect the user to login
					await this.$auth.logoutDueSessionTimeout()
					this.$router.push({ name: "home", params: { missingSession: true }})
				} else {
					throw error;
				}
			}

		}
	},
	data() {
		return {
			dataFromServer: null,
			saveResult: null,
			sequential: false,
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
				{ value: '|', text: 'Pipe' }
			],
			encodingOptions: [
				{ value: 'UTF-8', text: 'UTF-8 (default)' },
				{ value: 'UTF-16', text: 'UTF-16' },
				{ value: 'UTF-32', text: 'UTF-32' },
				{ value: 'ISO-8859-15', text: 'ISO-8859-15' },
			],
		}
	},
	created() {
		// set values to data for editability. Use Object.assign to avoid sharing object references with parent.
		// this.dataFromServer = Object.assign({}, this.file);
		// this.dataFromServer.file_characteristics = Object.assign({}, this.file.file_characteristics);
		this.dataFromServer = JSON.parse(JSON.stringify(this.file));
	},
	watch: {
		dataFromServer(newValues) {
			this.sequential = newValues.file_format === 'text/csv';
		}
	}
}
</script>
