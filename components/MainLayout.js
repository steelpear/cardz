import {useState, useEffect} from 'react'
import Link from 'next/link'
import Head from 'next/head'
import {useRouter} from 'next/router'
import 'primeicons/primeicons.css'
import styles from '@/styles/MainLayout.module.css'
import { ScrollTop } from 'primereact/scrolltop'
import Cookies from 'js-cookie'

export function MainLayout({ children }) {
  const router = useRouter()
  const [user, setUser] = useState('')

  useEffect(() => {setUser(Cookies.get('_qHWj5dMs-p27yKjuy'))}, [])

  return (
    <>
      <Head>
        <title>Анкеты объектов</title>
        <meta name="description" content="Анкеты объектов" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className={styles.nav}>
        <div>
          <Link href={'/'} className={router.route === '/' ? styles.disabledlink : ''}><i className="pi pi-home" style={{'marginRight': '12px', 'fontSize': '1.8em', 'color': router.route === '/' ? 'lightgrey' : 'white' }}></i></Link>
          <span style={{'fontSize': '1.4em', 'color': 'white'}}>Анкеты объектов{router.route === '/' ? <>&nbsp;/&nbsp;Главная</> : <></>}{router.route === '/info' ? <>&nbsp;/&nbsp;Инструкция</> : <></>}{router.route === '/card/[id]' ? <>&nbsp;/&nbsp;Карточка объекта</> : <></>}{router.route === '/edit/[id]' ? <>&nbsp;/&nbsp;Редактирование анкеты</> : <></>}</span>
        </div>
        <div className="flex align-items-center">
          <span style={{color:'white', marginRight: '15px'}}>{user}</span>
          <Link href={'/info'} className={router.route === '/info' ? styles.disabledlink : ''}><i className="pi pi-info-circle" style={{'fontSize': '1.8em', 'color': router.route === '/info' ? 'lightgrey' : 'white' }}></i></Link>
        </div>
      </nav>
      <main className={styles.main}>
        {children}
      </main>
      <ScrollTop className="bg-gray-500" />
    </>
  )
}
