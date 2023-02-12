import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { MainLayout } from '../../components/MainLayout'
import { Loader } from '../../components/Loader'
import { Tabs } from '../../components/Tabs'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Tooltip } from 'primereact/tooltip'
import { Toast } from 'primereact/toast'
import styles from '@/styles/Edit.module.css'

export default function Edit({oneCard}) {
  const toast = useRef(null)
  const editorRef = useRef()
  const router = useRouter()
  const [card, setCard] = useState(oneCard)
  const [editorLoaded, setEditorLoaded] = useState(false)
  const {CKEditor, Editor} = editorRef.current || {}
  const [loading, setLoading] = useState(true)
  const [sectionContent, setSectionContent] = useState('')
  const [currentTab, setcurrentTab] = useState(0)
  const [cardName, setCardName] = useState('')
  const [newTabName, setNewTabName] = useState('')
  const [newPartName, setNewPartName] = useState('')
  const [newTabDialog, setNewTabDialog] = useState(false)

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
    setCardName(card.name)
  },[])

  if (loading) {return (<Loader />)}

  const selectTab = (index) => {
    setcurrentTab(index)
    setSectionContent(card.sections[index].sectionText)
  }

  const deleteLastTab = () => {
    const copyCard = {...card}
    copyCard.sections.pop()
    setCard(copyCard)
  }

  const addTab = () => {
    const copyCard = {...card}
    copyCard.sections.push({tabName:newTabName, sectionName:newPartName ? newPartName : newTabName, sectionText: ''})
    setNewTabDialog(false)
    setCard(copyCard)
    setNewTabName('')
    setNewPartName('')
  }

  const clearCard = () => {
    const copyCard = {description: '', sections: []}
    setCard(copyCard)
    setSectionContent('')
  }

  const updateCard = async () => {
    const copyCard = {...card}
    const id = copyCard._id
    const data = { name: cardName }
    if (copyCard.sections && copyCard.sections.length > 0) {
      copyCard.sections[currentTab].sectionText = sectionContent
      data.sections = copyCard.sections
    } else { data.description = sectionContent }
    const response = await axios.post(`${process.env.API_URL}/api/update`, {id, data})
    if (response.data.state === 'true') {
      toast.current.show({ severity: 'success', summary: 'Сохранено', detail: 'Изменения сохранены' })
    } else { toast.current.show({ severity: 'error', summary: 'Ошибка!', detail: 'Ошибка сохранения!' }) }
  }

  return editorLoaded ? (
    <MainLayout>
      <main className={styles.main}>
        <div className="card flex justify-content-between align-items-center mb-2">
          <span className='p-input-icon-right'>
            <InputText value={cardName} onChange={(e) => setCardName(e.target.value)} className={styles.inputtext} />
            {cardName ? <><i className="pi pi-times" onClick={() => setCardName('')} style={{cursor: 'pointer'}} /></> : <><i className="pi pi-times" style={{color: 'lightgrey'}} /></>}
          </span>
          <div>
            <Button icon="pi pi-save" className="p-button-secondary p-button-rounded ml-2" aria-label="Save" onClick={() => updateCard()} tooltip="Сохранить изменения" tooltipOptions={{ position: 'top' }} />
            <Button disabled={card.sections && card.sections.length > 0 || sectionContent !== '' ? true : false} icon="pi pi-list" className="p-button-secondary p-button-rounded ml-2" aria-label="AddTabs" onClick={() => setCard(Tabs)} tooltip="Добавить разделы" tooltipOptions={{ position: 'top' }} />
            <Button disabled={card.sections && card.sections.length < 1 ? true : false} icon="pi pi-plus" className="p-button-secondary p-button-rounded ml-2" aria-label="Add" onClick={() => setNewTabDialog(true)} tooltip="Добавить раздел" tooltipOptions={{ position: 'top' }} />
            <Button disabled={card.sections && card.sections.length < 1 ? true : false} icon="pi pi-minus" className="p-button-secondary p-button-rounded ml-2" aria-label="Remove" onClick={() => deleteLastTab()} tooltip="Удалить последний раздел" tooltipOptions={{ position: 'top' }} />
            <Button icon="pi pi-times" className="p-button-secondary p-button-rounded ml-2" aria-label="Clear" onClick={() => clearCard()} tooltip="Очистить анкету" tooltipOptions={{ position: 'top' }} />
            <Button icon="pi pi-trash" className="p-button-secondary p-button-rounded ml-2" aria-label="Delete" onClick={() => console.log('Delete')} tooltip="Удалить анкету" tooltipOptions={{ position: 'top' }} />
            <Button icon="pi pi-arrow-left" className="p-button-secondary p-button-rounded ml-2" aria-label="Back" onClick={() => router.back()} tooltip="Назад" tooltipOptions={{ position: 'top' }} />
          </div>
        </div>
        {card.sections && card.sections.length > 0 ? <>
          <div style={{marginBottom:'15px',lineHeight:'23px'}}>
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
            onChange={(event, editor) => {
              const data = editor.getData()
              setSectionContent(data)
            }}
            // onReady={ editor => {console.log( 'Editor is ready to use!', editor )}}
          />
        </div>
        <Dialog header="Новый раздел" headerStyle={{textAlign: 'center'}} visible={newTabDialog} style={{ width: '30vw' }} onHide={() => setNewTabDialog(false)}>
          <div className="card flex justify-content-center align-items-center mb-3" style={{flexDirection: 'column'}}>
            <InputText placeholder="Название вкладки" value={newTabName} onChange={(e) => setNewTabName(e.target.value)} className="mb-3" style={{width: '300px'}} />
            <InputText placeholder="Название раздела" value={newPartName} onChange={(e) => setNewPartName(e.target.value)} style={{width: '300px'}} />
          </div>
          <div className="card flex justify-content-end align-items-center">
            <Button disabled={newTabName ? false : true} label="Добавить" onClick={() => addTab()} />
          </div>
        </Dialog>
        <Toast ref={toast} />
      </main>
    </MainLayout>
  ) : (<MainLayout><div>Editor loading...</div></MainLayout>)
}

export const getServerSideProps = async (context) => {
  const { id } = context.query
  const response = await axios.post(`${process.env.API_URL}/api/card`, {id})
  const data = response.data
  if (!data) {return {notFound: true}}
  return {props: {oneCard: data}}
}
