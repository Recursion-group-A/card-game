import dynamic from 'next/dynamic'
import React from 'react'

const PhaserComponentWithNoSSR = dynamic(
  () => import('@/components/phaserComponents/BlackjackGame'),
  { ssr: false }
)

export default function GamePage() {
  return <PhaserComponentWithNoSSR />
}
