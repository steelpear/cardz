import {useState, useEffect} from 'react'
import Head from 'next/head'
import { ProgressSpinner } from 'primereact/progressspinner'
import 'primereact/resources/themes/lara-light-indigo/theme.css'
import 'primereact/resources/primereact.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

export const Loader = () => {
  const [height, setHeight] = useState(null)

  useEffect(() => {setHeight(window.innerHeight - 20)}, [])

  if (height) {
    return (
      <>
        <Head>
          <title>Анкеты объектов</title>
          <meta name="description" content="Анкеты объектов" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="card flex justify-content-center align-items-center" style={{ height: height}}>
          <ProgressSpinner style={{width: '120px', height: '120px'}} strokeWidth="3" />
        </div>
      </>
    )
  } else {return (<></>)}
}
