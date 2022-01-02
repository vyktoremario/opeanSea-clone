import '../styles/globals.css'
import Link from 'next/link'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <nav className='border-b p-6'>
        <p className='text-4xl font-bold'>Marioverse NFT Market</p>
        <div className='flex mt-4'></div>
        <Link href='/'>
          <a className='mr-4 text-pink-500'>Home</a>
        </Link>
        <Link href='/create-item'>
          <a className='mr-6 text-pink-500'>Sell NFT</a>
        </Link>
        <Link href='/my-assets'>
          <a className='mr-6 text-pink-500'>My NFT</a>
        </Link>
        <Link href='/creator-dashboard'>
          <a className='mr-6 text-pink-500'>Dashboard</a>
        </Link>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
