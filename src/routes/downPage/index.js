import React from 'react'
import { connect } from 'dva'
import { FormattedMessage, IntlProvider } from 'react-intl'
import { WingBlank, WhiteSpace, Flex, Button, Toast } from 'antd-mobile'
import styles from './index.less'
import downPageIcon from '../../public/downPageIcon@2x.png'
import native from '../../utils/native.js'

const Item = Flex.Item

const DownPage = ({ i18n }) => {
  const localization = i18n.messages
  native.setTitle(localization.segwit_view_title)
  return (
    <IntlProvider locale={i18n.locale} messages={i18n.messages}>
      <div style={{ marginTop: '100px' }}>
        <Flex direction="column" align="center" justify="center">
          <img alt="downPage" src={downPageIcon} style={{ width: '200px' }} />
          <p style={{ width: '200px', textAlign: 'center', fontSize: '18px' }}>{localization.global_note_overload}</p>
        </Flex>
      </div>
    </IntlProvider>
  )
}
export default connect(({ i18n }) => ({ i18n }))(DownPage)
