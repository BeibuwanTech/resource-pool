import React from 'react'
import { GithubOutlined } from '@ant-design/icons'
import { DefaultFooter } from '@ant-design/pro-layout'
import { getCmsConfig } from '@/utils'

export default () => (
  <DefaultFooter
    copyright={`2020 ${getCmsConfig('copyright')}`}
    links={[
      {
        key: getCmsConfig('cmsTitle'),
        title: getCmsConfig('cmsTitle'),
        href: WX_MP
          ? 'https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/extensions/cms/introduction.html'
          : getCmsConfig('officialSiteLink'),
        blankTarget: true,
      },
      {
        key: 'github',
        title: <GithubOutlined />,
        href: 'https://BeibuwanTech.github.io',
        blankTarget: true,
      },
      {
        key: getCmsConfig('appName'),
        title: getCmsConfig('appName'),
        href: WX_MP
          ? 'https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html'
          : getCmsConfig('officialSiteLink'),
        blankTarget: true,
      },
    ]}
  />
)
