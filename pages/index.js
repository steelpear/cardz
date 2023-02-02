import {useState, useEffect} from 'react'
import Head from 'next/head'
import Link from 'next/link'
import styles from '@/styles/Home.module.css'
import { Loader } from '../components/Loader'
import {MainLayout} from '../components/MainLayout'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
        
export default function Home () {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)

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

  return (
    <MainLayout>
      <main className={styles.main}>
        <div className="card">
          <DataTable value={cards} size="small" stripedRows removableSort paginator responsiveLayout="scroll" paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown" currentPageReportTemplate="Показано {first} - {last} из {totalRecords}" rows={50} rowsPerPageOptions={[50,100,cards.length]}>
            <Column field="name" header="Название объекта" sortable></Column>
            <Column field="city" header="Город / Регион" sortable></Column>
          </DataTable>
        </div>
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
