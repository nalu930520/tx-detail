
import React from 'react'
import styles from './index.less'

const Spinner = () => (
  <div className={styles.spinnerBox}>
    <svg className={styles.spinner} width="60px" height="60px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
      <circle className={styles.path} fill="none" strokeWidth="5" cx="33" cy="33" r="30" />
    </svg>
  </div>
)

export default Spinner
