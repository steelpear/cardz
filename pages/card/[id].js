import {MainLayout} from '../../components/MainLayout'
import {useRouter} from 'next/router'
import styles from '@/styles/Card.module.css'

export default function Card({card}) {
  const router = useRouter()

  console.log(router)

  return(
    <MainLayout>
      <main className={styles.main}>
        <h1 style={{textAlign:'center'}}>{card.name}</h1>
        <div dangerouslySetInnerHTML={{__html: card.description}} />
      </main>
    </MainLayout>
  )
}

export const getServerSideProps = async (context) => {
  const { id } = context.query
  const response = await fetch(`${process.env.API_URL}/api/card`, {method: "POST", body: id})
  const data = await response.json()
  if (!data) {return {notFound: true}}
  return {props: {card: data}}
}
