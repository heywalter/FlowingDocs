import { translate } from '@docusaurus/Translate'
import { sortBy } from '@site/src/utils/jsUtils'

export interface Friend {
  title: string
  description: string
  website: string
  avatar?: string
  tags?: string[]
}

export interface Friends {
  [key: string]: Friend[]
}

export const friends: Friend[] = [
  {
    title: 'FlowDocs',
    description: translate({
      message: '知流小记',
      id: 'friends.flowDocs.description',
    }),
    website: 'https://FlowingDocs.com',
    avatar: 'https://FlowingDocs.com/img/logo.webp',
    tags: [translate({
      message: '技术写作',
      id: 'friends.tags.techWriting',
    }), translate({
      message: '知识分享',
      id: 'friends.tags.collaboration',
    })],
  },
]
