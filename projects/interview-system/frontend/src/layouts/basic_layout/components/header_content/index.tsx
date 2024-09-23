import React from 'react'
import { withRouter } from 'ice'
import PageHeader from '@/components/page_header'
import { IMenuItem } from '../page_nav'
import { asideMenuConfig } from '../../menu_config'

const formatPathName = (path: string): IMenuItem[] => {
  const allPath = path.split('/')
  let currPath = '/'
  return allPath.reduce((prevItem: IMenuItem[], currItem) => {
    currItem && (currPath += `${currItem}/`) && prevItem.push({ name: currItem, path: currPath })
    return prevItem
  }, [])
}

const HeaderContent = (props) => {
  const { location = { pathname: '' } } = props
  const recordPathObj = {}
  const findRightPath = (currPath: IMenuItem[]) => {
    currPath.map(
      (item: IMenuItem): IMenuItem => {
        item && item.path && (recordPathObj[item.path] = item)
        item && item.children && findRightPath(item.children)
        return item
      },
    )
  }
  findRightPath(asideMenuConfig)

  const { name, path = '/' } = recordPathObj[location.pathname] || {}
  return name ? <PageHeader title={name} breadcrumbs={formatPathName(path)} /> : <></>
}

export default withRouter(HeaderContent)
