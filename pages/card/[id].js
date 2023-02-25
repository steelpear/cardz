import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import {MainLayout} from '../../components/MainLayout'
import { Tabs } from '../../components/Tabs'
import { EventBus } from '../../components/EventBus'
import { Link } from 'react-scroll'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Loader } from '../../components/Loader'
import styles from '@/styles/Card.module.css'
import mongoose from 'mongoose'
import Card from '../../models/Card'

export default function OneCard({cardz}) {
  const [card, setCard] = useState(JSON.parse(cardz))
  const [loading, setLoading] = useState(true)
  const [isCard, setIsCard] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (card.state && card.state === 'false') {
      setIsCard(true)
      setTimeout(() => setLoading(false), 1000)
    } else {setTimeout(() => setLoading(false), 1000)}
    setTimeout(() => EventBus.$emit('card', card.name), 1100)
  },[card])

  if (loading) {return (<Loader />)}

  const createCard = async () => {
    setIsCard(false)
    setLoading(true)
    const {id} = router.query
    const hotel = await axios.post('/api/hotel',{id})
    const city = await axios.post('/api/city',{id: hotel.data.city.pop()})
    const response = await axios.post('/api/create', {
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
        {false} style={{ width: '40vw' }}>
          <div className="card flex justify-content-between align-items-center">
            <Button label="К списку анкет" onClick={() => router.push('/')} />
            <Button label="Создать анкету" onClick={() => createCard()} />
          </div>
        </Dialog>
      </MainLayout>)
}

export const getServerSideProps = async (context) => {
  const { id } = context.query
  if (!mongoose.connections[0].readyState) {mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true})}
  const data = await Card.findOne({hotel_id:id})
  if (!data) {
    const resp = {state: 'false'}
    return {props: {cardz: JSON.stringify(resp)}}
  }
  return {props: {cardz: JSON.stringify(data)}}
}
