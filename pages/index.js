import {useState, useEffect} from 'react'
import styles from '@/styles/Home.module.css'
import { Loader } from '../components/Loader'
import {MainLayout} from '../components/MainLayout'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext'
import { FilterMatchMode } from 'primereact/api'
        
export default function Home () {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({'global': { value: null, matchMode: FilterMatchMode.CONTAINS }})
  const [globalFilterValue, setGlobalFilterValue] = useState('')

  useEffect(() => {
    async function load() {
      const response = await fetch(`${process.env.API_URL}/api/cards`)
      const json = await response.json()
      setCards(json)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {return (<Loader />)}

  const onGlobalFilterChange = (e) => {
    const value = e.target.value
    let _filters = { ...filters }
    _filters['global'].value = value
    setFilters(_filters)
    setGlobalFilterValue(value)
  }

  const renderHeader = () => {
    return (
      <div className="flex justify-content-end">
        <span className='p-input-icon-left p-input-icon-right'>
          <i className="pi pi-search" />
          <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Поиск" />
          <i className="pi pi-times" />
        </span>
      </div>
    )
  }

  const header = renderHeader()

  return (
    <MainLayout>
      <main className={styles.main}>
        <DataTable value={cards} size="small" stripedRows removableSort paginator responsiveLayout="scroll" paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown" currentPageReportTemplate="Строки {first} - {last} из {totalRecords}" rows={50} rowsPerPageOptions={[50,100,cards.length]} filters={filters} filterDisplay="row" globalFilterFields={['name', 'city']} header={header} emptyMessage="Ничего не найдено." style={{'width': '95%'}}>
          <Column field="name" header="Название объекта" sortable style={{'width': '70%'}}></Column>
          <Column field="city" header="Город / Регион" sortable style={{'width': '30%'}}></Column>
        </DataTable>
      </main>
    </MainLayout>
  )
}

// export const getServerSideProps = async () => {
//   const response = await fetch(`${process.env.API_URL}/api/cards`)
//   const cards = response.json()
//   console.log(cards)
//   return {props: JSON.parse(JSON.stringify(cards))}
// }
