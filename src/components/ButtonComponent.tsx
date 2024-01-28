import React from 'react'
import Link from 'next/link'

export default function ButtonComponent({ title }: { title: string }) {
  return (
    <Link href={`/games/${title}`} passHref>
      <button
        className="mt-7 h-14 w-64 rounded-2xl border-[1.5px] border-white bg-red-600
      px-4 py-3 text-white hover:bg-red-500 focus:outline-none focus:ring-4 focus:ring-red-500"
        type="button"
      >
        <p className="text-xl">PLAY</p>
      </button>
    </Link>
  )
}
