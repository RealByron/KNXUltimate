/**
 * knx.js - a KNX protocol stack in pure Javascript
 *  Supergiovane
 */
import { module } from '../KnxLog'
import type { DatapointConfig } from '.'
import { hasProp } from '../utils'

//
// DPT22: 2-byte RHCC status
//

function reverseString(str: string) {
	let newString = ''
	for (let i = str.length - 1; i >= 0; i--) {
		newString += str[i]
	}
	return newString
}

interface DPT22Value {
	Fault: boolean
	StatusEcoH: boolean
	TempFlowLimit: boolean
	TempReturnLimit: boolean
	StatusMorningBoostH: boolean
	StatusStartOptim: boolean
	StatusStopOptim: boolean
	HeatingDisabled: boolean
	HeatCoolMode: boolean
	StatusEcoC: boolean
	StatusPreCool: boolean
	CoolingDisabled: boolean
	DewPointStatus: boolean
	FrostAlarm: boolean
	OverheatAlarm: boolean
	reserved: boolean
}

const logger = module('DPT22')

const config: DatapointConfig = {
	id: 'DPT22',
	formatAPDU: (value: DPT22Value) => {
		// Send to BUS
		const apdu_data = Buffer.alloc(2)
		if (!value) {
			logger.error('cannot write null value')
			return null
		}
		if (typeof value === 'object') {
			if (!hasProp(value, 'Fault')) value.Fault = false
			if (!hasProp(value, 'StatusEcoH')) value.StatusEcoH = false
			if (!hasProp(value, 'TempFlowLimit')) value.TempFlowLimit = false
			if (!hasProp(value, 'TempReturnLimit'))
				value.TempReturnLimit = false
			if (!hasProp(value, 'StatusMorningBoostH'))
				value.StatusMorningBoostH = false
			if (!hasProp(value, 'StatusStartOptim'))
				value.StatusStartOptim = false
			if (!hasProp(value, 'StatusStopOptim'))
				value.StatusStopOptim = false
			if (!hasProp(value, 'HeatingDisabled'))
				value.HeatingDisabled = false
			if (!hasProp(value, 'HeatCoolMode')) value.HeatCoolMode = false
			if (!hasProp(value, 'StatusEcoC')) value.StatusEcoC = false
			if (!hasProp(value, 'StatusPreCool')) value.StatusPreCool = false
			if (!hasProp(value, 'CoolingDisabled'))
				value.CoolingDisabled = false
			if (!hasProp(value, 'DewPointStatus')) value.DewPointStatus = false
			if (!hasProp(value, 'FrostAlarm')) value.FrostAlarm = false
			if (!hasProp(value, 'OverheatAlarm')) value.OverheatAlarm = false
			if (!hasProp(value, 'reserved')) value.reserved = true
		} else {
			logger.error('Must supply a correct payload. See wiki.')
			return null
		}
		let firstHex = ''
		let secondHex = ''
		firstHex = firstHex.concat(
			...[
				value.Fault,
				value.StatusEcoH,
				value.TempFlowLimit,
				value.TempReturnLimit,
				value.StatusMorningBoostH,
				value.StatusStartOptim,
				value.StatusStopOptim,
				value.HeatingDisabled,
			].map((v) => {
				return Number(v).toString()
			}),
		)
		secondHex = secondHex.concat(
			...[
				value.HeatCoolMode,
				value.StatusEcoC,
				value.StatusPreCool,
				value.CoolingDisabled,
				value.DewPointStatus,
				value.FrostAlarm,
				value.OverheatAlarm,
				value.reserved,
			].map((v) => {
				return Number(v).toString()
			}),
		)
		apdu_data[0] = parseInt(reverseString(secondHex), 2)
		apdu_data[1] = parseInt(reverseString(firstHex), 2)
		return apdu_data
	},
	fromBuffer: (buf) => {
		// RX from BUS
		if (buf.length !== 2) {
			logger.warn('Buffer should be 2 bytes long, got', buf.length)
			return null
		}
		const byte1 = reverseString(buf[1].toString(2).padStart(8, '0')).split(
			'',
		)
		const byte2 = reverseString(buf[0].toString(2).padStart(8, '0')).split(
			'',
		)
		const value: DPT22Value = {
			// byte1
			Fault: byte1[0] === '1',
			StatusEcoH: byte1[1] === '1',
			TempFlowLimit: byte1[2] === '1',
			TempReturnLimit: byte1[3] === '1',
			StatusMorningBoostH: byte1[4] === '1',
			StatusStartOptim: byte1[5] === '1',
			StatusStopOptim: byte1[6] === '1',
			HeatingDisabled: byte1[7] === '1',
			// byte2
			HeatCoolMode: byte2[0] === '1',
			StatusEcoC: byte2[1] === '1',
			StatusPreCool: byte2[2] === '1',
			CoolingDisabled: byte2[3] === '1',
			DewPointStatus: byte2[4] === '1',
			FrostAlarm: byte2[5] === '1',
			OverheatAlarm: byte2[6] === '1',
			reserved: byte2[7] === '1',
		}

		return value
	},
	basetype: {
		bitlength: 16,
		range: [,],
		valuetype: 'basic',
		desc: '2-byte',
		help: `// You can set all parameters you want.
		// Every parameter is optional.
		// Please respect the upper and lowercase letters.
		// For help about meaning of each parameter, please see the sample in the Wiki
		var s1={}; 
		s1.Fault = true;
		s1.StatusEcoH = false;
		s1.TempFlowLimit = false;
		s1.TempReturnLimit = false;
		s1.StatusMorningBoostH = false;
		s1.StatusStartOptim = false;
		s1.StatusStopOptim = false;
		s1.HeatingDisabled = true;
		s1.HeatCoolMode = true;
		s1.StatusEcoC = false;
		s1.StatusPreCool = false;
		s1.CoolingDisabled = true;
		s1.DewPointStatus = false;
		s1.FrostAlarm = false;
		s1.OverheatAlarm = true;
		return {payload:s1};`,
		helplink: '',
	},
	subtypes: {
		// 22.101 DPT_StatusRHCC
		101: {
			name: 'RHCC Status',
			desc: 'RHCC Status',
			unit: '',
			scalar_range: [,],
			range: [,],
		},
	},
}

export default config
