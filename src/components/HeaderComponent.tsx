import Link from 'next/link'
import Image from 'next/image'

export default function HeaderComponent() {
  return (
    <nav className="border-gray-200 bg-white dark:bg-gray-900">
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <Image
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="Logo"
            width={30}
            height={30}
          />
          <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
            Card Game
          </span>
        </Link>
        <div className="flex items-center space-x-6 rtl:space-x-reverse">
          Login
        </div>
      </div>
    </nav>
  )
}
