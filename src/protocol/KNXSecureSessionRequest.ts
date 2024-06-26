import KNXPacket from './KNXPacket'
import HPAI from './HPAI'
import CRIFactory from './CRIFactory'
import { KNX_CONSTANTS } from './KNXConstants'
import { generateKeyPair } from '../Curve25519'
import TunnelCRI from './TunnelCRI'

export default class KNXSecureSessionRequest extends KNXPacket {
	cri: TunnelCRI

	hpaiData: HPAI

	diffieHellmanClientPublicValue: string

	constructor(
		cri: TunnelCRI,
		hpaiData: HPAI = HPAI.NULLHPAI,
		private _jKNXSecureKeyring: any = {},
	) {
		super(KNX_CONSTANTS.SECURE_SESSION_REQUEST, hpaiData.length + 32)
		this.cri = cri
		this.hpaiData = hpaiData
		this.diffieHellmanClientPublicValue = Buffer.alloc(32).toString()

		let authenticationPassword =
			_jKNXSecureKeyring.Devices[0].authenticationPassword
		authenticationPassword =
			authenticationPassword.length === 0
				? '00000000000000000000000000000000'
				: authenticationPassword
		let _key = authenticationPassword
		_key += new Array(32 + 1 - _key.length).join('\0')

		const authenticationPasswordHEX = Buffer.from(_key).toString('hex')
		const authenticationPasswordUint8Array = Uint8Array.from(
			Buffer.from(authenticationPasswordHEX, 'hex'),
		)
		const secret = generateKeyPair(authenticationPasswordUint8Array)
		this.diffieHellmanClientPublicValue = Buffer.from(
			secret.public,
		).toString('hex')
	}

	static createFromBuffer(
		buffer: Buffer,
		offset: number = 0,
	): KNXSecureSessionRequest {
		if (offset >= buffer.length) {
			throw new Error('Buffer too short')
		}
		const hpaiControl = HPAI.createFromBuffer(buffer, offset)
		offset += hpaiControl.length
		const hpaiData = HPAI.createFromBuffer(buffer, offset)
		offset += hpaiData.length
		const cri = CRIFactory.createFromBuffer(buffer, offset)
		return new KNXSecureSessionRequest(cri, hpaiControl, hpaiData)
	}

	toBuffer(): Buffer {
		return Buffer.concat([
			this.header.toBuffer(),
			this.hpaiData.toBuffer(),
			Buffer.from(this.diffieHellmanClientPublicValue as string, 'hex'),
		])
	}
}
