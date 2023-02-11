import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { MainLayout } from '../../components/MainLayout'
import { Loader } from '../../components/Loader'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Tooltip } from 'primereact/tooltip'
import styles from '@/styles/Edit.module.css'

export default function Edit({oneCard}) {
  const editorRef = useRef()
  const router = useRouter()
  const [card, setCard] = useState(oneCard)
  const [editorLoaded, setEditorLoaded] = useState(false)
  const {CKEditor, Editor} = editorRef.current || {}
  const [loading, setLoading] = useState(true)
  const [sectionContent, setSectionContent] = useState('')
  const [currentTab, setcurrentTab] = useState(0)
  const [cardName, setCardName] = useState('')

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
    copyCard.sections.push({tabName:'Новая секция', sectionName:'Новая', sectionText: ''})
    setCard(copyCard)
  }

  const clearCard = () => {
    const copyCard = {description: '', sections: []}
    setCard(copyCard)
    setSectionContent('')
  }

  const addTabs = () => {
    const copyCard = {description: '', sections:[{ tabName: 'Название', sectionName: 'НАЗВАНИЕ ОР', sectionText: '' }, { tabName: 'Описание', sectionName: 'ОПИСАНИЕ ОР', sectionText: '' }, { tabName: 'Адрес', sectionName: 'АДРЕС ОР', sectionText: '' }, { tabName: 'Режим работы', sectionName: 'РЕЖИМ РАБОТЫ ОР', sectionText: '' }, { tabName: 'Заезд/Выезд', sectionName: 'ВРЕМЯ ЗАЕЗДА/ВЫЕЗДА', sectionText: '' }, { tabName: 'Юридическое название', sectionName: 'ЮРИДИЧЕСКОЕ НАЗВАНИЕ ОР/ИНН', sectionText: '' }, { tabName: 'Взаиморасчёты', sectionName: 'ВАРИАНТЫ ВЗАИМОРАСЧЁТОВ ', sectionText: '' }, { tabName: 'Условия бронирования', sectionName: 'УСЛОВИЯ БРОНИРОВАНИЯ ОР/АВ /РАСЧЕТ ДНИ/НОЧИ(СУТКИ)/УСЛОВИЯ ПОЛУЧЕНИЯ ОПЛАТЫ ОТ КЛИЕНТА', sectionText: '' }, { tabName: 'Специфика расчёта', sectionName: 'СПЕЦИФИКА РАСЧЕТА АВ', sectionText: '' }, { tabName: 'Специфика выставления', sectionName: 'СПЕЦИФИКА ВЫСТАВЛЕНИЯ СЧЕТА ОТ ОР, РАСЧЕТ ЗАКУПОЧНОЙ ЦЕНЫ', sectionText: '' }, { tabName: 'Дети', sectionName: 'МИНИМАЛЬНЫЙ ВОЗРАСТ ДЕТЕЙ ПРИ БРОНИРОВАНИИ/ОПЛАТА ДЕТСКИХ МЕСТ И ДОПОЛНИТЕЛЬНЫХ МЕСТ ПРИ БРОНИРОВАНИИ ОР', sectionText: '' }, { tabName: 'Питание', sectionName: 'ПИТАНИЕ В ОР /ТИПЫ ПИТАНИЯ', sectionText: '' }, { tabName: 'Животные', sectionName: 'РАЗМЕЩЕНИЕ С ЖИВОТНЫМИ', sectionText: '' }, { tabName: 'Доступная среда', sectionName: 'УСЛОВИЯ ДЛЯ ЛИЦ С ОГРАНИЧЕННЫМИ ВОЗМОЖНОСТЯМИ(ДОСТУПНАЯ СРЕДА)', sectionText: '' }, { tabName: 'Аннуляция', sectionName: 'УСЛОВИЯ АННУЛЯЦИИ ПРИ БРОНИРОВАНИИ В ОР', sectionText: '' }, { tabName: 'Договор', sectionName: 'ДОГОВОР /СРОК ДЕЙСТВИЯ ДОГОВОРА', sectionText: '' }, { tabName: 'Инфраструктура', sectionName: 'ИНФРАСТРУКТУРА ОБЪЕКТА РАЗМЕЩЕНИЯ', sectionText: '' }, { tabName: 'Как добраться', sectionName: 'КАК ДОБРАТЬСЯ ДО ОБЪЕКТА РАЗМЕЩЕНИЯ', sectionText: '' }, { tabName: 'Номера', sectionName: 'НОМЕРНОЙ ФОНД /КАТЕГОРИИ НОМЕРОВ ОР', sectionText: '' }, { tabName: 'Контакты', sectionName: 'КОНТАКТНАЯ ИНФОРМАЦИЯ ПО ОР /ТЕЛ ОР/АДРЕС ЭЛ ПОЧТЫ ОР', sectionText: '' }, { tabName: 'Важная информация', sectionName: 'ВАЖНАЯ ИНФОРМАЦИЯ ОБ ОБЪЕКТЕ РАЗМЕЩЕНИЯ', sectionText: '' }]}
    setCard(copyCard)
  }

  return editorLoaded ? (
    <MainLayout>
      <main className={styles.main}>
        <div className="card flex justify-content-between align-items-center mb-2">
          <span className='flex p-input-icon-right'>
            <InputText value={cardName} onChange={(e) => setCardName(e.target.value)} />
            {cardName ? <><i className="pi pi-times" onClick={() => setCardName('')} style={{cursor: 'pointer'}} /></> : <><i className="pi pi-times" style={{color: 'lightgrey'}} /></>}
          </span>
          <div>
            <Button icon="pi pi-save" className="p-button-secondary p-button-rounded ml-2" aria-label="Save" onClick={() => console.log('Save')} tooltip="Сохранить изменения" tooltipOptions={{ position: 'top' }} />
            <Button disabled={card.sections.length > 0 ? true : false} icon="pi pi-list" className="p-button-secondary p-button-rounded ml-2" aria-label="AddTabs" onClick={() => addTabs()} tooltip="Добавить разделы" tooltipOptions={{ position: 'top' }} />
            <Button icon="pi pi-plus" className="p-button-secondary p-button-rounded ml-2" aria-label="Add" onClick={() => addTab()} tooltip="Добавить раздел" tooltipOptions={{ position: 'top' }} />
            <Button icon="pi pi-minus" className="p-button-secondary p-button-rounded ml-2" aria-label="Remove" onClick={() => deleteLastTab()} tooltip="Удалить последний раздел" tooltipOptions={{ position: 'top' }} />
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
  return {props: {oneCard: data}}
}
