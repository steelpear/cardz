import { useState, useEffect } from 'react'
import {MainLayout} from '../../components/MainLayout'
import { Editor } from 'primereact/editor'
import { Loader } from '../../components/Loader'
import styles from '@/styles/Edit.module.css'

export default function Edit({card}) {
  const [loading, setLoading] = useState(true)
  const [sectionContent, setSectionContent] = useState('')
  const [currentTab, setcurrentTab] = useState(0)

  useEffect(() => {
    if (card) setTimeout(() => setLoading(false), 1000)
    if (card.sections && card.sections.length > 0) {
      setSectionContent(card.sections[0].sectionText)
    } else {setSectionContent(card.description)}
  },[])

  if (loading) {return (<Loader />)}

  const selectTab = (index) => {
    setcurrentTab(index)
    setSectionContent(card.sections[index].sectionText)
  }

  return(
    <MainLayout>
      <main className={styles.main}>
        <h1 style={{textAlign:'center', marginTop: '55px'}}>{card.name}</h1>
        {card.sections && card.sections.length > 0 ? <>
          <div className={styles.tabs_wrap}>
            {card.sections.map((section, index) => {
              return (
                <div className={styles.tab} key={index}>
                  <span className={currentTab === index ? styles.active : styles.non_active} onClick={() => selectTab(index)}>{section.tabName}</span>
                </div>
              )
            })}
          </div>
          <div className="card">
            <Editor value={sectionContent} onTextChange={(e) => setSectionContent(e.htmlValue)} style={{ height: '320px' }} />
          </div>
        </> : <>
        <div className="card">
          <Editor value={sectionContent} onTextChange={(e) => setSectionContent(e.htmlValue)} style={{ height: '320px' }} />
        </div></>}
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
