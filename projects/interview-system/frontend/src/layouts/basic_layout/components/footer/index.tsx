import React from 'react'
import styles from './index.module.scss'

export default function Footer() {
  return (
    <p className={styles.footer}>
      <span className={styles.logo}>人才简历库</span>
      <br />
      <span className={styles.copyright}>© 2024-现在 人才简历库 & ICE</span>
    </p>
  )
}
