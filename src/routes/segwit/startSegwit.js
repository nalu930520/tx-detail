import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { FormattedMessage, IntlProvider } from 'react-intl'
import { WingBlank, WhiteSpace, Flex, Button, Toast } from 'antd-mobile'
import styles from './startSegwit.less'
import segwitImg from '../../public/img/segwit.png'
import startSegwitImg from '../../public/img/startSegwit.png'
import native from '../../utils/native.js'

const Item = Flex.Item

const Segwit = ({ segwit, dispatch, i18n }) => {
  const localization = i18n.messages
  native.setTitle(localization.segwit_view_title)
  const { userTransfee } = segwit;
  return (
    <IntlProvider locale={i18n.locale} messages={i18n.messages}>
      <div className={styles.segwitWraper}>
        <div>
          <div className={styles.segwitImg}>
            <img
              style={{ width: '100%' }}
              src={startSegwitImg}
              alt="icon"
            />
            <div className={styles.startSegwitText}>
              <p>{localization.receive_segwit_prom_title_1}</p>
              <p className={styles.white_text}>{localization.receive_segwit_prom_title_2}</p>
            </div>
          </div>
          <WingBlank>
            <div className={styles.content}>
              <h2><span className={styles.left_border} />{localization.segwit_view_activate_note_title}<span className={styles.right_border} /></h2>
              <h3>{localization.segwit_view_activate_note_support_segwit}</h3>
              <p>{localization.segwit_view_activate_note_discount}</p>
              <ul style={{ paddingLeft: 0 }}>
                <li><span className={styles.dis}>1</span>{localization.segwit_view_activate_note_discount_1}</li>
                <li><span className={styles.dis}>2</span><FormattedMessage id="segwit_view_activate_note_discount_2" values={{ 0: `${userTransfee.setfeeDiscount * 100}%` }} /></li>
              </ul>
              <WhiteSpace />
              <h3>{localization.segwit_view_activate_notice_title}</h3>
              <ol>
                <li>{localization.segwit_view_activate_notice_1}</li>
                <li>{localization.segwit_view_activate_notice_2}</li>
                <li>{localization.segwit_view_activate_notice_3}</li>
              </ol>
            </div>
          </WingBlank>
        </div>
        <Button
          className={styles.btn}
          type="primary"
          onClick={() => {
            Toast.loading('Loading...', null, null)
            dispatch({ type: 'segwit/createSegwitAddress' })
          }}
        >
          {localization.segwit_view_button_activate}
        </Button>
        <WhiteSpace size="lg" />
      </div>
    </IntlProvider>
  )
}
export default connect(({ segwit, i18n }) => ({ segwit, i18n }))(Segwit)
