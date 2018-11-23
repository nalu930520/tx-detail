import React from 'react'
import { Toast } from 'antd-mobile'
import styles from './index.less'

const PageLoading = () => (
  <div className={styles.lds_css}>
    <div className={styles.lds_spinner}>
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
    </div>
  </div>
)

export default PageLoading
