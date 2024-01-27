// import dynamic from 'next/dynamic'
// import React from 'react'
//
// const PhaserComponentWithNoSSR = dynamic(
//   () => import('@/components/PhaserComponent'),
//   { ssr: false }
// )
//
// export default function Page() {
//   return <PhaserComponentWithNoSSR />
// }

import SwiperComponent from '@/components/SwiperComponent'
import HeaderComponent from '@/components/HeaderComponent'

export default function Home() {
  return (
    <div
      className="h-screen w-screen flex-col items-center justify-center"
      style={{
        backgroundImage: "url('/assets/ui/table.jpeg')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <HeaderComponent />
      <div className="text-center font-semibold">
        <h1 className="mb-14 mt-36 text-4xl">SELECT GAME</h1>
      </div>
      <SwiperComponent />
    </div>
  )
}
