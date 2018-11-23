import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { FormattedMessage, IntlProvider } from 'react-intl'
import { WingBlank, WhiteSpace, Flex, Button } from 'antd-mobile'
import styles from './segwitAdress.less'
import segwitImg from '../../public/img/segwit.png'
import startSegwitImg from '../../public/img/startSegwit.png'
import native from '../../utils/native.js'

const Item = Flex.Item

const Segwit = ({ segwit, dispatch, i18n }) => {
  const { userTransfee } = segwit;
  const { userTicket } = userTransfee
  console.log(userTransfee)
  const localization = i18n.messages
  native.setTitle(localization.segwit_view_activated_title)
  return (
    <IntlProvider locale={i18n.locale} messages={i18n.messages}>
      <div className={styles.segwitWraper}>
        <div>
          <div className={styles.segwitImg}>
            <img
              style={{ width: '100%' }}
              src={segwitImg}
              alt="icon"
            />
          </div>
          <WingBlank>
            <div className={styles.content}>
              <h2><span className={styles.left_border} />{localization.segwit_view_activated_title}<span className={styles.right_border} /></h2>
              <ul className={styles.ticket}>
                {userTicket.map(obj => (
                  obj.num <= 0 ? '' : (
                    <li>
                      <div className={styles.tiket_text}>
                        <div>
                          <h3>{obj.type === '1' ? <FormattedMessage id="segwit_view_label_free_deposit" /> : <FormattedMessage id="segwit_view_label_network_fee_discount" values={{ 0: `${obj.rate}%` }} />}</h3>
                          <p>{obj.type === '1' ? <FormattedMessage id="segwit_view_label_free_deposit_note" /> : ''}</p>
                        </div>
                        <div>
                          <span><FormattedMessage id={obj.type === '1' ? 'segwit_view_label_coupons' : 'segwit_view_label_coupon'} values={{ 0: <i>{obj.num}<br /></i> }} /></span>
                        </div>
                      </div>
                    </li>
                  )
                ))
                }
              </ul>
              { (userTicket[0].num + userTicket[1].num) < 1 && <ul className={styles.no_ticket}><li><p>{localization.segwit_view_note_no_coupons}</p></li></ul>}
              <WhiteSpace />
              <h2><span className={styles.left_border} />{localization.segwit_view_note_rules_title}<span className={styles.right_border} /></h2>
              <ol>
                <li>{localization.segwit_view_note_rules_1}</li>
                <li><FormattedMessage
                  id="segwit_view_note_rules_2"
                  values={{ 0: userTransfee.freeDepositAmount / (10 ** 8), 1: userTransfee.currencyCode.toUpperCase() }}
                /></li>
                <li>{localization.segwit_view_activate_notice_3}</li>
              </ol>
              <p style={{ marginBottom: '10px' }}>{localization.segwit_view_note_rights}</p>
            </div>
          </WingBlank>
        </div>
        <Button
          className={styles.btn}
          type="primary"
          onClick={() => {
            native.pushNativePage('receive', JSON.stringify({ currency: 'BTC' }))
          }}
        >{localization.segwit_view_button_check_address}</Button>
      </div>
    </IntlProvider>
  )
}
export default connect(({ segwit, i18n }) => ({ segwit, i18n }))(Segwit)
