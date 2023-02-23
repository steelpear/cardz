import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import styles from '@/styles/Home.module.css'
import { Loader } from '../components/Loader'
import { MainLayout } from '../components/MainLayout'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext'
import { FilterMatchMode } from 'primereact/api'
import mongoose from 'mongoose'
import Card from '../models/Card'
        
export default function Home ({cardz}) {
  const router = useRouter()
  const [cards, setCards] = useState(JSON.parse(cardz))
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({'global': { value: null, matchMode: FilterMatchMode.CONTAINS }})
  const [globalFilterValue, setGlobalFilterValue] = useState('')

  useEffect(() => {if (cards && cards.length > 1) {setTimeout(() => setLoading(false), 1000)}},[cards])

  if (loading) {return (<Loader />)}

  const onGlobalFilterChange = (e) => {
    const value = e.target.value
    let _filters = { ...filters }
    _filters['global'].value = value
    setFilters(_filters)
    setGlobalFilterValue(value)
  }

  const header = () => {
    return (
      <div className="flex justify-content-end">
        <span className='p-input-icon-left p-input-icon-right'>
          <i className="pi pi-search" />
          <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Поиск" />
          {globalFilterValue ? <><i className="pi pi-times" onClick={clearFilter} style={{cursor: 'pointer'}} /></> : <><i className="pi pi-times" style={{color: 'lightgrey'}} /></>}
        </span>
      </div>
    )
  }

  const clearFilter = () => {
    setFilters({'global': { value: null, matchMode: FilterMatchMode.CONTAINS }})
    setGlobalFilterValue('')
  }

  return (
    <MainLayout>
      <main className={styles.main}>
        <DataTable value={cards} size="small" selectionMode="single" onSelectionChange={e => router.push(`/card/${e.value.hotel_id}`)} dataKey="_id" stripedRows removableSort paginator responsiveLayout="scroll" paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown" currentPageReportTemplate="Строки {first} - {last} из {totalRecords}" rows={50} rowsPerPageOptions={[50,100,cards.length]} filters={filters} filterDisplay="row" globalFilterFields={['name', 'city']} header={header} emptyMessage="Ничего не найдено." style={{'width': '95%'}}>
          <Column field="name" header="Название объекта" sortable style={{'width': '70%'}}></Column>
          <Column field="city" header="Город / Регион" sortable style={{'width': '30%'}}></Column>
        </DataTable>
      </main>
    </MainLayout>
  )
}

export const getServerSideProps = async () => {
  if (!mongoose.connections[0].readyState) {mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true})}
  const data = await Card.find({ active: true }, 'name city hotel_id')
  return {props: {cardz: JSON.stringify(data)}}
}
