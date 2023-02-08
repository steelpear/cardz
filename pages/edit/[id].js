import { useState, useEffect, useRef } from 'react'
import { MainLayout } from '../../components/MainLayout'
import { Loader } from '../../components/Loader'
import styles from '@/styles/Edit.module.css'

export default function Edit({card}) {
  const editorRef = useRef()
  const [editorLoaded, setEditorLoaded] = useState(false)
  const { CKEditor, Editor } = editorRef.current || {}
  const [loading, setLoading] = useState(true)
  const [sectionContent, setSectionContent] = useState('')
  const [currentTab, setcurrentTab] = useState(0)

  useEffect(() => {
    if (card) setTimeout(() => setLoading(false), 1000)
    if (card.sections && card.sections.length > 0) {
      setSectionContent(card.sections[0].sectionText)
    } else {setSectionContent(card.description)}
    editorRef.current = {
      CKEditor: require('@ckeditor/ckeditor5-react').CKEditor,
      Editor: require('ckeditor5-custom-build/build/ckeditor')
    }
    setEditorLoaded(true)
  },[])

  if (loading) {return (<Loader />)}

  const selectTab = (index) => {
    setcurrentTab(index)
    setSectionContent(card.sections[index].sectionText)
  }

  return editorLoaded ? (
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
        </> : <></>}
        <div className="card">
          <CKEditor
            editor={ Editor  }
            data={ sectionContent }
            onReady={ editor => {console.log( 'Editor is ready to use!', editor )}}
            onBlur={ ( event, editor ) => {console.log( 'Blur.', editor )}}
            onFocus={ ( event, editor ) => {console.log( 'Focus.', editor )}}
          />
        </div>
      </main>
    </MainLayout>
  ) : (<MainLayout><div>Editor loading</div></MainLayout>)
}

export const getServerSideProps = async (context) => {
  const { id } = context.query
  const response = await fetch(`${process.env.API_URL}/api/card`, {method: "POST", body: id})
  const data = await response.json()
  if (!data) {return {notFound: true}}
  return {props: {card: data}}
}
