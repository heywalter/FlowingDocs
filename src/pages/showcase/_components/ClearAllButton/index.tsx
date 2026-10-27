/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { type ReactNode } from 'react'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { useClearQueryString } from '@docusaurus/theme-common'

export default function ClearAllButton(): ReactNode {
  const clearQueryString = useClearQueryString()
  const { i18n: { currentLocale } } = useDocusaurusContext()
  return (
    <button
      className="button button--outline button--primary button--sm"
      type="button"
      onClick={() => clearQueryString()}
    >
      {currentLocale === 'en' ? 'Clear filters' : '清除筛选'}
    </button>
  )
}
