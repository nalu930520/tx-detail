/* global window */

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { List, Flex, WhiteSpace, TextareaItem, Modal, Toast, Button } from 'antd-mobile'
import moment from 'moment'
import native from '../../utils/native'
import styles from './index.less'
import { numberFormat, replaceLocalization } from '../../utils'
import incomeIcon from '../../public/icon_card_direct_deposit@2x.png'
import cardIcon from '../../public/icon_card_monthly_fee@2x.png'
import defaultAvatar from '../../public/default_portrait@2x.png'
import convertArrow from '../../public/icon_convert_deriction@3x.png'
import config from '../../utils/config'
import getDisabledCurrencyConfig from '../../utils/disabledCurrency'

const Item = List.Item
const Brief = Item.Brief
const Alert = Modal.alert
const Prompt = Modal.prompt

const TxDetail = ({ txDetail, dispatch, i18n }) => {
  native.setTitle(i18n.messages.transaction_view_title_details)
  const mins = moment().utcOffset()
  const h = mins / 60 | 0
  const m = mins % 60 | 0
  const offsetUTCTime = moment.utc().hours(h).minutes(m).format('hh:mm')
  const { txDetailData, showNoteModal, textAreaRemark } = txDetail
  const currentWallet = txDetail.wallet
  const handleChange = (value) => {
    dispatch({ type: 'txDetail/updateTextAreaRemark', payload: value })
  }
  const getCurrencyInfo = (code) => {
    if (native.getCurrencyConfig(code)) {
      return native.getCurrencyConfig(code)
    }
    const obj = getDisabledCurrencyConfig(code)[0]
    const info = {
      code: obj.code,
      currencyType: obj.currencyType,
      decimalPlace: obj.decimalPlace,
      displayDecimalPlace: obj.displayDecimalPlace,
      displayUnitDecimalPlace: obj.displayUnitDecimalPlace,
      firstCurrencyRatePlace: obj.firstCurrencyRatePlace,
      isErc20Token: false,
      currencyUnitSymbol: code.toUpperCase(),
      imageUrl: 'http://mobi-res.mobimecdn.com/default_currency_1537513416.png?e=1569051112&token=paOH3LkKPuT47JK1qxxOpTI44-cRBSa9IUfQrWXZ:B2gqtfHNgntfmwbXVOS8gVa-aoE=',
    }
    return info
  }
  const getAmountFormat = (amount, currencyInfo, isConvert) => {
    let fixBtc = 0
    if (isConvert) {
      fixBtc = currencyInfo.code === 'btc' ? 2 : 0
    }
    // amount 为 api 返回的值

    return `${numberFormat(amount,
      currencyInfo.decimalPlace + currencyInfo.displayUnitDecimalPlace,
      (currencyInfo.displayDecimalPlace + currencyInfo.displayUnitDecimalPlace) - fixBtc,
      currencyInfo.currencyType)} ${currencyInfo.currencyUnitSymbol}`
  }

  const getConvertBalance = (data) => {
    switch (data.type) {
      case 11:
      case 12:
        if (!currentWallet) {
          return (
            <div>
              <p className={styles.label}>{i18n.messages.transaction_view_title_balance}</p>
              <p>{getAmountFormat(txDetailData.balance, getCurrencyInfo(txDetailData.currencyCode))}</p>
              <p className={styles.label}>{i18n.messages.transaction_view_title_balance}</p>
              <p>{getAmountFormat(txDetailData.targetBalance, getCurrencyInfo(txDetailData.targetCurrencyCode))}</p>
            </div>
          )
        }
        return (
          <div>
            <p className={styles.label}>{i18n.messages.transaction_view_title_balance}</p>
            <p>{currentWallet === txDetailData.currencyCode ?
              getAmountFormat(txDetailData.balance, getCurrencyInfo(txDetailData.currencyCode)) : getAmountFormat(txDetailData.targetBalance, getCurrencyInfo(txDetailData.targetCurrencyCode))}
            </p>
          </div>
        )
      default:
        return (
          <div>
            <p className={styles.label}>{i18n.messages.transaction_view_title_balance}</p>
            <p>{data.balance === -1 ? i18n.messages.transaction_view_text_pending : getAmountFormat(data.balance, getCurrencyInfo(txDetailData.currencyCode))}</p>
          </div>
        )
    }
  }

  const getC2CId = (data) => {
    if (!data.description) return ''
    if (data.type === 19 || data.type === 20) {
      return (
        <div>
          <p className={styles.label}>{i18n.messages.mtm_text_order_number}</p>
          <p>{data.description ? data.description : ''}</p>
          <WhiteSpace size="xs" />
        </div>
      )
    }
    return ''
  }

  const getSender = (data, locale) => {
    switch (data.type) {
      case 4:
        return (
          <div>
            <WhiteSpace size="lg" />
            <List>
              <Item
                multipleLine
              >
                <Flex justify="start" wrap>
                  <p className={styles.title}><img src={incomeIcon} alt="sssss" /></p>
                  <div>{txDetailData.creatorMobiName}</div>
                </Flex>
              </Item>
            </List>
          </div>
        )
      case 5:
        return (
          <div>
            <WhiteSpace size="lg" />
            <List>
              <Item
                multipleLine
              >
                <Flex justify="start">
                  <p className={styles.title}><img src={txDetailData.userInfo.profile_image_url || defaultAvatar} alt="" /></p>
                  <div>{txDetailData.userInfo.friend_alias || txDetailData.userInfo.mobi_name || txDetailData.userInfo.mobile}<Brief>{txDetailData.userInfo.type === 1 && ''}{txDetailData.userInfo.type !== 1 && (txDetailData.isPayer ? `+${txDetailData.userInfo.mobileCode} ${txDetailData.userInfo.mobile}` : `+${txDetailData.creatorMobileCode} ${txDetailData.creatorMobile}`)}</Brief></div>
                </Flex>
              </Item>
            </List>
          </div>
        )
      case 6:
        return (
          <div>
            <WhiteSpace size="lg" />
            <List>
              <Item
                multipleLine
              >
                <Flex justify="start">
                  <p className={styles.title}><img src={getCurrencyInfo(txDetailData.currencyCode).imageUrl} alt="sssss" /></p>
                  <div className={styles.rightPayee}>{txDetailData.payeeName}</div>
                </Flex>
              </Item>
            </List>
          </div>
        )
      case 7:
        return (
          <div>
            <WhiteSpace size="lg" />
            <List>
              <Item
                multipleLine
              >
                <Flex justify="start">
                  <p className={styles.title}><img src={getCurrencyInfo(txDetailData.currencyCode).imageUrl} alt="sssss" /></p>
                  <div> {replaceLocalization(locale.messages.global_text_address_name, locale.messages[`CURRENCY_${txDetailData.currencyCode.toUpperCase()}`], getCurrencyInfo(txDetailData.currencyCode).code.toUpperCase())}</div>
                </Flex>
              </Item>
            </List>
          </div>
        )
      case 11:
      case 12:
        return (
          <div>
            <WhiteSpace size="lg" />
            <List>
              <Item>
                {i18n.messages.transaction_view_text_conversion}
              </Item>
              <Item>
                <Flex direction="column" align="start">
                  <Flex.Item style={{ marginLeft: '0' }}>
                    <p className={styles.conversionTitle}>
                      <span className={styles.flag}><img src={getCurrencyInfo(txDetailData.currencyCode).imageUrl} alt="direct" /></span>
                      <span className={styles.titleAmount}>- {getAmountFormat(txDetailData.amount, getCurrencyInfo(txDetailData.currencyCode))}</span>
                    </p>
                    <p className={styles.converIcon}><img src={convertArrow} width="10px" alt="converIcon" /></p>
                    <p className={styles.conversionTitle}>
                      <span className={styles.flag}><img src={getCurrencyInfo(txDetailData.targetCurrencyCode).imageUrl} alt="direct" /></span>
                      <span className={styles.titleAmount}>+ {getAmountFormat(txDetailData.targetAmount, getCurrencyInfo(txDetailData.targetCurrencyCode))}</span>
                    </p>
                  </Flex.Item>
                </Flex>
              </Item>
            </List>
          </div>
        )
      case 3:
      case 13:
      case 14:
        return (
          <div>
            <WhiteSpace size="lg" />
            <List>
              <Item
                multipleLine
              >
                <Flex justify="start" wrap>
                  <p className={styles.title}><img src={cardIcon} alt="sssss" /></p>
                  <div>{txDetailData.isPayer ? txDetailData.payeeMobiName : txDetailData.creatorMobiName}</div>
                </Flex>
              </Item>
            </List>
          </div>
        )
      default:
        break
    }
    return ''
  }
  const getTxStatus = (statusType) => {
    if (statusType === 4) {
      return <span className={`${styles.statusIcon} ${styles.successIcon}`}>{i18n.messages.transaction_view_status_completed}</span>
    }
    if (statusType === 3 || statusType === 2 || statusType === 8 || statusType === 9) {
      return <span className={`${styles.statusIcon} ${styles.pendingIcon}`}>{i18n.messages.transaction_view_status_pending}</span>
    }
    if (statusType === 5) {
      return <span className={`${styles.statusIcon} ${styles.cancelIcon}`}>{i18n.messages.transaction_view_status_canceled}</span>
    }
    return ''
  }
  const getAmount = (data) => {
    if (data.type === 11 || data.type === 12) {
      return ''
    }
    if (data.type === 6 && data.isPayer === 1) {
      return (
        <List>
          <Item>
            <Flex justify="between">
              <p className={styles.label}>{i18n.messages.transaction_view_type_sent}</p>
              <p className={styles.amount}>- {getAmountFormat(data.amount, getCurrencyInfo(data.currencyCode))}</p>
            </Flex>
            <Flex justify="end">
              <p>{getTxStatus(data.status)}</p>
            </Flex>
            <Flex justify="between">
              <p className={styles.label}>{i18n.messages.transaction_view_title_fee}</p>
              <p>- {getAmountFormat(data.fee + data.extraFee, getCurrencyInfo(data.currencyCode))}</p>
            </Flex>
            <Flex justify="between">
              <p className={styles.label}>{i18n.messages.transaction_view_title_total}</p>
              <p>{data.isPayer ? '- ' : '+ '} {getAmountFormat(data.amount + data.fee + data.extraFee, getCurrencyInfo(data.currencyCode))}</p>
            </Flex>
          </Item>
        </List>
      )
    }
    if (data.type === 5 && data.extraFee && data.isPayer) {
      return (
        <List>
          <Item>
            <Flex justify="between">
              <p className={styles.label}>{i18n.messages.transaction_view_type_sent}</p>
              <p className={styles.amount}>- {getAmountFormat(data.amount, getCurrencyInfo(data.currencyCode))}</p>
            </Flex>
            <Flex justify="end">
              <p>{getTxStatus(data.status)}</p>
            </Flex>
            <Flex justify="between">
              <p className={styles.label}>{i18n.messages.transaction_view_title_fee}</p>
              <p>- {getAmountFormat(data.extraFee, getCurrencyInfo(data.currencyCode))}</p>
            </Flex>
            <Flex justify="between">
              <p className={styles.label}>{i18n.messages.transaction_view_title_total}</p>
              <p>{data.isPayer ? '- ' : '+ '} {getAmountFormat(data.amount + data.extraFee, getCurrencyInfo(data.currencyCode))}</p>
            </Flex>
          </Item>
        </List>
      )
    }
    if (data.type === 7 && data.currencyCode === 'btc') {
      return (
        <List>
          <Item>
            <Flex justify="between">
              <p className={styles.label}>{i18n.messages.transaction_view_label_total_received}</p>
              <p className={styles.amount}>{data.isPayer ? '- ' : '+ '} {getAmountFormat(data.amount + data.extraFee, getCurrencyInfo(data.currencyCode))}</p>
            </Flex>
            <Flex justify="end">
              <p>{getTxStatus(data.status)}</p>
            </Flex>
            <Flex justify="between">
              <p className={styles.label}>{i18n.messages.global_text_fee}</p>
              <p> {getAmountFormat(data.extraFee, getCurrencyInfo(data.currencyCode))}</p>
            </Flex>
            <Flex justify="between">
              <p className={styles.label}>{i18n.messages.transaction_view_label_amount_received}</p>
              <p> {getAmountFormat(data.amount, getCurrencyInfo(data.currencyCode))}</p>
            </Flex>
          </Item>
        </List>
      )
    }
    return (
      <List>
        <Item wrap>
          <WhiteSpace size="lg" />
          <Flex justify="between">
            <p className={styles.label}>{i18n.messages.messages_detail_view_text_amount}</p>
            <p className={styles.amount}>{data.isPayer ? '- ' : '+ '} {getAmountFormat(data.amount, getCurrencyInfo(data.currencyCode))}</p>
          </Flex>
          <Flex justify="end">
            <p>{getTxStatus(data.status)}</p>
          </Flex>
          <WhiteSpace size="lg" />
        </Item>
      </List>
    )
  }

  const displayRate = (data) => {
    const rate = data.amount / data.targetAmount
    const oppRate = data.targetAmount / data.amount
    const currencyCodeInfo = getCurrencyInfo(data.currencyCode)
    const targetCurrencyCodeInfo = getCurrencyInfo(data.targetCurrencyCode)
    return (
      <div>
        {`${getAmountFormat((10 ** currencyCodeInfo.firstCurrencyRatePlace) * (10 ** currencyCodeInfo.decimalPlace), currencyCodeInfo, true)} ≈
          ${getAmountFormat(oppRate * (10 ** currencyCodeInfo.firstCurrencyRatePlace) * (10 ** currencyCodeInfo.decimalPlace), targetCurrencyCodeInfo, true)}
        `}
        <br />
        {`${getAmountFormat(rate * (10 ** targetCurrencyCodeInfo.firstCurrencyRatePlace) * (10 ** targetCurrencyCodeInfo.decimalPlace), currencyCodeInfo, true)} ≈
         ${getAmountFormat((10 ** targetCurrencyCodeInfo.firstCurrencyRatePlace) * (10 ** targetCurrencyCodeInfo.decimalPlace), targetCurrencyCodeInfo, true)}

        `}
      </div>
    )
  }
  const undoConversion = (data) => {
    Alert(i18n.messages.conversion_undo_button_title, i18n.messages.conversion_undo_content, [
      { text: i18n.messages.popup_button_cancel,
        onPress: () => {
          console.log(false)
        } },
      { text: i18n.messages.conversion_undo_button_title,
        onPress: () => new Promise((resolve) => {
          resolve(dispatch({ type: 'txDetail/undoTransaction', payload: { SN: data.SN } }))
        }) },
    ])
  }
  const getUndoInfo = (data) => {
    if (data.type === 11 && data.status === 5) {
      return (
        <div>
          <WhiteSpace />
          <List>
            <Item
              arrow="horizontal"
              onClick={() => { dispatch({ type: 'txDetail/getTxDetail', payload: { SN: data.description, wallet: currentWallet } }) }}
            >
              <p>{i18n.messages.transaction_view_text_undone}</p>
              <p>{data.description}</p>
            </Item>
          </List>
          <WhiteSpace />
        </div>
      )
    }
    if (data.type === 11 && data.status === 4 && data.undoable) {
      return (
        <div>
          <WhiteSpace />
          <List>
            <Item
              arrow="horizontal"
              onClick={() => { undoConversion(data) }}
            >
              <p>{i18n.messages.transaction_view_button_undo}</p>
            </Item>
          </List>
          <WhiteSpace />
        </div>
      )
    }
    if (data.type === 12) {
      return (
        <div>
          <WhiteSpace />
          <List>
            <Item
              arrow="horizontal"
              onClick={() => { dispatch({ type: 'txDetail/getTxDetail', payload: { SN: data.description, wallet: currentWallet } }) }}
            >
              <p>{i18n.messages.transaction_view_text_undone_conversion}</p>
              <p>{data.description}</p>
            </Item>
          </List>
          <WhiteSpace />
        </div>
      )
    }
    return ''
  }
  const skipUrl = (data) => {
    const { isErc20Token } = getCurrencyInfo(data.currencyCode)
    if (data.currencyCode === 'eth' || isErc20Token) {
      return native.openSystemBrowser(`${config.ethBrowersUrl}${data.txnId}`)
    }
    return native.openSystemBrowser(`${config.cryptoExproler[data.currencyCode]}${data.txnId}`)
  }

  return (
    <div className={styles.content}>
      {txDetailData ? (
        <div>
          {getSender(txDetailData, i18n)}
          {getAmount(txDetailData)}
          {txDetailData.txnId ? (
            <div>
              <List>
                <Item
                  arrow="horizontal"
                  onClick={() => { skipUrl(txDetailData) }}
                >
                  <p className={styles.label}>{i18n.messages.transaction_view_text_blockchain_id}</p>
                  <p>{txDetailData.txnId.substring(0, 18)}...{txDetailData.txnId.substring(txDetailData.txnId.length - 18)}</p>
                </Item>
              </List>
            </div>
          ) : ''}
          <List>
            <Item>
              <Flex direction="column" align="start">
                <Flex.Item>
                  {txDetailData.description
                    && txDetailData.type !== 11
                    && txDetailData.type !== 12
                    && txDetailData.type !== 19
                    && txDetailData.type !== 20
                    ? (
                      <div>
                        <p className={styles.label}>{i18n.messages.transaction_view_title_message}</p>
                        <p className={styles.message}>{txDetailData.description}</p>
                        <WhiteSpace size="xs" />
                      </div>
                    ) : ''}
                  {txDetailData.type === 11 || txDetailData.type === 12 ? (
                    <div>
                      <p className={styles.label}>{i18n.messages.transaction_view_text_rate}</p>
                      <p>
                        {displayRate(txDetailData)}
                      </p>
                      <WhiteSpace size="xs" />
                    </div>
                  ) : ''}
                  <p className={styles.label}>{i18n.messages.transaction_view_title_time}</p>
                  <p>{moment(new Date(txDetailData.createdAt)).format('YYYY-MM-DD HH:mm:ss')} (UTC+{offsetUTCTime})</p>
                  <WhiteSpace size="xs" />
                  <p className={styles.label}>{i18n.messages.transaction_view_title_transactionID}</p>
                  <p id="sn">{txDetailData.SN}</p>
                  <WhiteSpace size="xs" />
                  {getC2CId(txDetailData)}
                  {getConvertBalance(txDetailData)}
                </Flex.Item>
              </Flex>
            </Item>
          </List>
          {getUndoInfo(txDetailData)}
          <List>
            <Item>
              <Flex direction="column" align="start">
                <p className={styles.label}>
                  {i18n.messages.transaction_view_label_memo}
                </p>
                <div className={styles.textAreaWrpaer}>
                  <TextareaItem
                    rows={5}
                    count={150}
                    placeholder={!txDetailData.memo ? i18n.messages.transaction_view_label_addMemo : ''}
                    style={{ width: '100%' }}
                    value={textAreaRemark}
                    onChange={(value) => { handleChange(value) }}
                  />
                  <button className={styles.saveBtn} onClick={() => { dispatch({ type: 'txDetail/addMemo', payload: { memo: textAreaRemark, SN: txDetailData.SN } }) }}>{i18n.messages.global_alert_button_save}</button>
                </div>
              </Flex>
            </Item>
          </List>
        </div>
      ) : ''}
      <WhiteSpace size="lg" />
    </div>
  )
}

TxDetail.PropTypes = {
  cardIndex: PropTypes.object,
  txDetail: PropTypes.object,
}

export default connect(({ txDetail, i18n }) => ({ txDetail, i18n }))(TxDetail)
