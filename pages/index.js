import {useState, useEffect} from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { ProgressSpinner } from 'primereact/progressspinner'
import styles from '@/styles/Home.module.css'
import 'primereact/resources/themes/lara-light-indigo/theme.css'
import 'primereact/resources/primereact.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

export default function Home () {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [height, setHeight] = useState(null)

  useEffect(() => {
    async function load() {
      const response = await fetch(`${process.env.API_URL}/api/cards`)
      const json = await response.json()
      setCards(json)
      setLoading(false)
    }
    setHeight(window.innerHeight - 20)
    load()
  }, [])

  console.log(height)

  if (loading && height) { return (
    <>
      <Head>
        <title>Анкеты объектов</title>
        <meta name="description" content="Анкеты объектов | Инструменты администратора" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="card flex justify-content-center align-items-center" style={{ height: height}}>
        <ProgressSpinner style={{width: '120px', height: '120px'}} strokeWidth="3" />
      </div>
    </>
  )}

  return (
    <>
      <Head>
        <title>Анкеты объектов</title>
        <meta name="description" content="Анкеты объектов | Инструменты администратора" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <ul>
        {cards.map(card => (
          <li key={card._id}>
            <Link href={`/card/[_id]`} as={`/card/${card._id}`}>{card.name}</Link>
          </li>
        ))}
        </ul>
      </main>
    </>
  )
}

// export const getServerSideProps = async () => {
//   const response = await fetch(`${process.env.API_URL}/api/cards`)
//   const cards = response.json()
//   console.log(cards)
//   return {props: JSON.parse(JSON.stringify(cards))}
// }
