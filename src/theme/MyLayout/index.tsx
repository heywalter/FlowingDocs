import type { Props } from '@theme/Layout'
import Layout from '@theme/Layout'

export default function MyLayout({ children, maxWidth, ...layoutProps }: Props & { maxWidth?: number }) {
  return <Layout {...layoutProps}><main className="site-page" style={maxWidth ? { maxWidth } : undefined}>{children}</main></Layout>
}
