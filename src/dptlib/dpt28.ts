/**
 * knx.js - a KNX protocol stack in pure Javascript
 *  Supergiovane
 */

import { module } from '../KnxLog'
import type { DatapointConfig } from '.'

//
// DPT28: ASCII string (variable length) UTF-8
//

const logger = module('DPT28')

// Write to BUS
const config: DatapointConfig = {
	id: 'DPT28',
	formatAPDU(value) {
		if (typeof value !== 'string') {
			logger.error('Must supply a string value. Autoconversion to string')
			try {
				value = value.toString()
			} catch (error) {
				value = 'DPT Err'
			}
		}

		try {
			const buf = Buffer.alloc(14)
			if (this.subtypeid === '001') buf.write(value, 'utf-8')
			return buf
		} catch (error) {
			return error.message
		}
	},

	// Read from BUS
	fromBuffer(buf) {
		// nog length check because this is variable
		// if (buf.length != 14) {
		//  knxLog.get().get().error('DPT28: Buffer should be 14 byte long, got', buf.length)
		//  return null
		// }
		if (this.subtypeid === '001') return buf.toString('utf-8')
		return null
	},

	// DPT28 basetype info
	basetype: {
		bitlength: 14 * 8,
		valuetype: 'basic',
		desc: '14-character string',
		help: `// Send a text to a display
msg.payload = "Hello UTF-8!"
return msg;`,
		helplink: '',
	},

	// DPT28 subtypes
	subtypes: {
		// 28.001 UTF-8 string
		'001': {
			use: 'G',
			desc: 'DPT_String_UTF-8',
			name: 'UTF-8 string',
			force_encoding: 'UTF-8',
		},
	},
}

export default config
