import {MainLayout} from '../../components/MainLayout'
import {useRouter} from 'next/router'

export default function Card({card}) {
  const router = useRouter()

  console.log(router)

  return(
    <MainLayout>
      <h1>{card.name}</h1>
    </MainLayout>
  )
}

export const getServerSideProps = async (context) => {
  const { id } = context.query
  const response = await fetch(`${process.env.API_URL}/api/card`, {method: "POST", body: id})
  if (response.status !== 404) {
    const card = await response.json()
    return {props:{card}}
  } else {return {props: {}}}
}
