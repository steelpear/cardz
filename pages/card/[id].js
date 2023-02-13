import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import {MainLayout} from '../../components/MainLayout'
import { Tabs } from '../../components/Tabs'
import { Link } from 'react-scroll'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Loader } from '../../components/Loader'
import 'primereact/resources/themes/lara-light-indigo/theme.css'
import 'primereact/resources/primereact.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import styles from '@/styles/Card.module.css'

export default function Card({card}) {
  const [loading, setLoading] = useState(true)
  const [isCard, setIsCard] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (card.state && card.state === 'false') {
      setIsCard(true)
      setTimeout(() => setLoading(false), 1000)
    } else {setTimeout(() => setLoading(false), 1000)}
  },[])

  if (loading) {return (<Loader />)}

  const createCard = async () => {
    const {id} = router.query
    const hotel = await axios.post(`${process.env.API_URL}/api/hotel`,{id})
    const city = await axios.post(`${process.env.API_URL}/api/city`,{id: hotel.data.city.pop()})
    const response = await axios.post(`${process.env.API_URL}/api/create`, {
      name: hotel.data.name,
      hotel_id: hotel.data._id,
      description: '',
      sections: Tabs.sections,
      city: city.data.name,
      active: true
    })
    router.push(`/edit/${response.data}`)
  }

  return !isCard ? (
    <MainLayout>
      <main className={styles.main}>
      <Button icon="pi pi-file-edit" className={['p-button-rounded p-button-lg', styles.float_btn]} aria-label="Edit" onClick={() => router.push(`/edit/${card.hotel_id}`)} />
        <h1 style={{textAlign:'center', marginTop: '65px'}}>{card.name}</h1>
        {card.sections && card.sections.length > 0 ? <>
          <div className={styles.tabs_wrap}>
            {card.sections.map((section, index) => {
              return (
                <div className={styles.tab} key={index}>
                  <Link
                    activeClass={styles.active}
                    className={styles.non_active}
                    to={`#${index}`}
                    spy={true}
                    smooth={true}
                    offset={-160}
                    duration={500}
                  >{section.tabName}</Link>
                </div>
              )
            })}
          </div>
          <div>
            {card.sections.map((section, index) => {
              return (<div key={index}>
                <div id={`#${index}`} style={{fontWeight: 'bold'}}>{section.sectionName}</div>
                <div dangerouslySetInnerHTML={{__html: section.sectionText}} />
              </div>
              )
            })}
          </div>
        </> : <><div dangerouslySetInnerHTML={{__html: card.description}} /></>}
      </main>
    </MainLayout>
  ) : (<MainLayout>
        <Dialog header="Анкета не найдена!" headerStyle={{textAlign: 'center'}} visible={isCard} closable=
        {false} style={{ width: '35vw' }}>
          <div className="card flex justify-content-between align-items-center">
            <Button label="К списку анкет" onClick={() => router.push('/')} />
            <Button label="Создать анкету" onClick={() => createCard()} />
          </div>
        </Dialog>
      </MainLayout>)
}

export const getServerSideProps = async (context) => {
  const { id } = context.query
  const response = await axios.post(`${process.env.API_URL}/api/card`, {id})
  const data = response.data
  if (!data) {return {notFound: true}}
  return {props: {card: data}}
}
