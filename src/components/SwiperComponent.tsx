'use client'

import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import Image from 'next/image'

import 'swiper/css'
import 'swiper/css/effect-cards'

import '@/app/globals.css'

import { EffectCards } from 'swiper/modules'
import ButtonComponent from '@/components/ButtonComponent'

export default function SwiperComponent() {
  const renderImage = (title: string, imagePath: string) => (
    <Image
      src={imagePath}
      alt={`${title} image`}
      width={240}
      height={300}
      className="mt-3"
      priority
      style={{
        objectFit: 'cover',
        borderRadius: '15px',
        width: 'auto',
        height: 'auto'
      }}
    />
  )

  return (
    <Swiper effect="cards" grabCursor modules={[EffectCards]}>
      <SwiperSlide key="blackjack" className="flex-col">
        <h1 className="text-2xl">BLACKJACK</h1>
        {renderImage('BLACKJACK', '/assets/ui/casino3.jpeg')}
        <ButtonComponent title="blackjack" />
      </SwiperSlide>
      <SwiperSlide key="poker" className="flex-col">
        <h1 className="text-2xl">POKER</h1>
        {renderImage('POKER', '/assets/ui/casino8.jpg')}
        <ButtonComponent title="poker" />
      </SwiperSlide>
      <SwiperSlide key="war" className="flex-col">
        <h1 className="text-2xl">WAR</h1>
        {renderImage('WAR', '/assets/ui/casino6.jpeg')}
        <ButtonComponent title="war" />
      </SwiperSlide>
      <SwiperSlide key="speed" className="flex-col">
        <h1 className="text-2xl">SPEED</h1>
        {renderImage('SPEED', '/assets/ui/casino10.jpg')}
        <ButtonComponent title="speed" />
      </SwiperSlide>
    </Swiper>
  )
}
