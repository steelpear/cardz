import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { MainLayout } from '../../components/MainLayout'
import { EventBus } from '../../components/EventBus'
import { Loader } from '../../components/Loader'
import { Tabs } from '../../components/Tabs'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Tooltip } from 'primereact/tooltip'
import { Toast } from 'primereact/toast'
import { ContextMenu } from 'primereact/contextmenu'
import styles from '@/styles/Edit.module.css'
import mongoose from 'mongoose'
import Card from '../../models/Card'

export default function Edit({oneCard}) {
  const toast = useRef(null)
  const cm = useRef(null)
  const editorRef = useRef()
  const router = useRouter()
  const [card, setCard] = useState(JSON.parse(oneCard))
  const [editorLoaded, setEditorLoaded] = useState(false)
  const {CKEditor, Editor} = editorRef.current || {}
  const [loading, setLoading] = useState(true)
  const [sectionContent, setSectionContent] = useState('')
  const [currentTab, setcurrentTab] = useState(0)
  const [cardName, setCardName] = useState('')
  const [newTabName, setNewTabName] = useState('')
  const [newPartName, setNewPartName] = useState('')
  const [newTabDialog, setNewTabDialog] = useState(false)
  const [editTabDialog, setEditTabDialog] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [mode, setMode] = useState('new')

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
    setTimeout(() => EventBus.$emit('card', card.name), 1100)
  },[card])

  if (loading) {return (<Loader />)}

  const footerContent = (
    <div className="card flex justify-content-between align-items-center">
      <Button label="Отмена" icon="pi pi-times" onClick={() => setConfirm(false)} className="p-button-success" />
      <Button label="Удалить" icon="pi pi-check" onClick={() => deleteCard()} autoFocus className="p-button-danger" />
    </div>
  )

  const selectTab = (index) => {
    setcurrentTab(index)
    setSectionContent(card.sections[index].sectionText)
  }

  const deleteOneTab = async () => {
    const copyCard = await {...card}
    await copyCard.sections.splice(currentTab, 1)
    setCard(copyCard)
    selectTab(currentTab)
    await toast.current.show({ severity: 'success', summary: 'Удалено', detail: 'Раздел удалён', life: 3000 })
  }

  const addTab = () => {
    const copyCard = {...card}
    if (mode === 'before') {
      copyCard.sections.splice(currentTab, 0, {tabName:newTabName, sectionName:newPartName ? newPartName : newTabName, sectionText: ''})
      setSectionContent('')}
    if (mode === 'after') {
      copyCard.sections.splice(currentTab + 1, 0, {tabName:newTabName, sectionName:newPartName ? newPartName : newTabName, sectionText: ''})
      setSectionContent('')
      setcurrentTab(currentTab + 1)
    }
    if (mode === 'edit') {
      copyCard.sections[currentTab].tabName = newTabName
      copyCard.sections[currentTab].sectionName = newPartName
      setEditTabDialog(false)
    }
    setNewTabDialog(false)
    setCard(copyCard)
    setNewTabName('')
    setNewPartName('')
    setMode('new')
  }

  const editTab = () => {
    const copyCard = {...card}
    setNewTabName(copyCard.sections[currentTab].tabName)
    setNewPartName(copyCard.sections[currentTab].sectionName)
    setEditTabDialog(true)
    setMode('edit')
  }

  const closeEditTabDialog = () => {
    setEditTabDialog(false)
    setNewTabName('')
    setNewPartName('')
    setMode('new')
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
    const response = await axios.post('/api/update', {id, data})
    if (response.data.state === 'true') {
      toast.current.show({ severity: 'success', summary: 'Сохранено', detail: 'Изменения сохранены' })
    } else { toast.current.show({ severity: 'error', summary: 'Ошибка!', detail: 'Ошибка сохранения!' }) }
  }

  const deleteCard = async () => {
    const response = await axios.post('/api/delete',{id: card._id})
    if (response.data.state === 'Deleted') {
      toast.current.show({ severity: 'success', summary: 'Удалено', detail: 'Анкета удалена' })
      setConfirm(false)
      setLoading(true)
      setTimeout(() => router.push('/'), 500)
    } else { toast.current.show({ severity: 'error', summary: 'Ошибка!', detail: 'Ошибка удаления!' }) }
  }

  const cmItems = [
    {
      label: 'Редактировать',
      icon: 'pi pi-fw pi-file-edit',
      command: () => {editTab()}
    },
    {
      label: 'Вставить до',
      icon: 'pi pi-fw pi-chevron-left',
      command: () => {
        setMode('before')
        setNewTabDialog(true)
      }
    },
    {
      label: 'Вставить после',
      icon: 'pi pi-fw pi-chevron-right',
      command: () => {
        setMode('after')
        setNewTabDialog(true)
      }
    },
    {
      label: 'Удалить',
      icon: 'pi pi-fw pi-trash',
      command: () => {deleteOneTab()}
    }
  ]

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
            <Button icon="pi pi-times" className="p-button-secondary p-button-rounded ml-2" aria-label="Clear" onClick={() => clearCard()} tooltip="Очистить анкету" tooltipOptions={{ position: 'top' }} />
            <Button icon="pi pi-trash" className="p-button-secondary p-button-rounded ml-2" aria-label="Delete" onClick={() => setConfirm(true)} tooltip="Удалить анкету" tooltipOptions={{ position: 'top' }} />
            <Button icon="pi pi-arrow-left" className="p-button-secondary p-button-rounded ml-2" aria-label="Back" onClick={() => router.back()} tooltip="Назад" tooltipOptions={{ position: 'top' }} />
          </div>
        </div>
        {card.sections && card.sections.length > 0 ? <>
          <div style={{marginBottom:'15px',lineHeight:'22px'}}>
            {card.sections.map((section, index) => {
              return (
                <div className={styles.tab} key={index}>
                  {currentTab === index ? <span className={currentTab === index ? styles.active : styles.non_active} onClick={() => selectTab(index)} onContextMenu={(e) => cm.current.show(e)}>{section.tabName}</span> : <span className={currentTab === index ? styles.active : styles.non_active} onClick={() => selectTab(index)}>{section.tabName}</span>}
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
              setSectionContent(data)}}
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
        <Dialog header="Редактировать раздел" headerStyle={{textAlign: 'center'}} visible={editTabDialog} style={{ width: '30vw' }} onHide={() => closeEditTabDialog()}>
          <div className="card flex justify-content-center align-items-center mb-3" style={{flexDirection: 'column'}}>
            <InputText placeholder="Название вкладки" value={newTabName} onChange={(e) => setNewTabName(e.target.value)} className="mb-3" style={{width: '300px'}} />
            <InputText placeholder="Название раздела" value={newPartName} onChange={(e) => setNewPartName(e.target.value)} style={{width: '300px'}} />
          </div>
          <div className="card flex justify-content-end align-items-center">
            <Button disabled={newTabName ? false : true} label="Сохранить" onClick={() => addTab()} />
          </div>
        </Dialog>
        <Dialog header="Подтвердите удаление" headerStyle={{textAlign: 'center'}} visible={confirm} style={{ width: '35vw' }} onHide={() => setConfirm(false)} footer={footerContent}>
          <p className="m-0" style={{fontSize: '20px'}}>Вы уверены, что хотите удалить анкету объекта <span style={{fontWeight: 'bold'}}>{card.name}</span>?</p>
        </Dialog>
        <Toast ref={toast} />
        <ContextMenu model={cmItems} ref={cm} />
      </main>
    </MainLayout>
  ) : (<MainLayout><div>Редактор загружается...</div></MainLayout>)
}

export const getServerSideProps = async (context) => {
  const { id } = context.query
  if (!mongoose.connections[0].readyState) {mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true})}
  const data = await Card.findOne({hotel_id:id})
  return {props: {oneCard: JSON.stringify(data)}}
}
