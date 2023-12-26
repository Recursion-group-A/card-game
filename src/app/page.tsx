import dynamic from 'next/dynamic'
import React from 'react'

const PhaserComponentWithNoSSR = dynamic(
  () => import('@/components/PhaserComponent'),
  { ssr: false }
)

export default function Page() {
  return <PhaserComponentWithNoSSR />
}
