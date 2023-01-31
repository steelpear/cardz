import {useState, useEffect} from 'react'
import Head from 'next/head'
import Link from 'next/link'
import styles from '@/styles/Home.module.css'
import { Loader } from '../components/Loader'

export default function Home () {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const response = await fetch(`${process.env.API_URL}/api/cards`)
      const json = await response.json()
      setCards(json)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {return (<Loader />)}

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
