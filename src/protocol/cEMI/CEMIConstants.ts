const CEMIConstants = {
	PL_MEDIUM_INFO: 0x01,
	RF_MEDIUM_INFO: 0x02,
	BUSMONITOR_STATUS_INFO: 0x03,
	TIMESTAMP_RELATIVE: 0x04,
	TIME_DELAY_TILL_SENDING: 0x05,
	EXTENDED_RELATIVE_TIMESTAMP: 0x06,
	BIBAT_INFO: 0x07,
	RF_MULTI_INFO: 0x08,
	PREAMBLE: 0x09,
	POSTAMBLE: 0x09,
	RF_FASK_ACK_INFO: 0x0a,
	MANUFACTURER_SPECIFIC_INFO: 0xfe,
	L_DATA_REQ: 0x11,
	L_DATA_CON: 0x2e,
	L_DATA_IND: 0x29,
	GROUP_READ: 0x0,
	GROUP_RESPONSE: 0x01,
	GROUP_WRITE: 0x02,
	INDIVIDUAL_WRITE: 0x03,
	INDIVIDUAL_READ: 0x04,
	INDIVIDUAL_RESPONSE: 0x04,
	TPCI_UNUMBERED_PACKET: 0x0,
}

export default CEMIConstants
