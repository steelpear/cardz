import Link from 'next/link'
import Head from 'next/head'

export function MainLayout({ children }) {
  return (
    <>
      <Head>
        <title>Анкеты объектов</title>
        <meta name="description" content="Анкеты объектов" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav>
        <div>
          <Link href={'/'}><span>Home</span></Link>
          <span> | Анкеты объектов</span>
        </div>
        <Link href={'/posts'}><span>Posts</span></Link>
      </nav>
      <main>
        {children}
      </main>
      <style jsx>{`
        nav {
          position: fixed;
          height: 60px;
          left: 0;
          top: 0;
          right: 0;
          background: darkblue;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 20px;
          z-index: 1;
        }
        
        nav span {
          color: #fff;
          text-decoration: none;
        }
        
        main {
          margin-top: 60px;
          padding: 1rem;
        }
      `}</style>
    </>
  )
}