import {useState, useEffect, useRef} from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import axios from 'axios'
import Cookies from 'js-cookie'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'

export default function Auth() {
  const toast = useRef(null)
  const router = useRouter()
  const [height, setHeight] = useState(null)
  const [login, setLogin] = useState('')

  useEffect(() => {setHeight(window.innerHeight - 30)}, [])

  const checkLogin = () => {
    Cookies.set('_qHWj5dMs-p27yKjuy', login, { expires: 7 })
    setTimeout(() => router.push('/'), 500)
  }

  if (height) {
    return (
      <>
        <Head>
          <title>Анкеты объектов | Авторизация</title>
          <meta name="description" content="Анкеты объектов" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="card flex justify-content-center align-items-center flex-column" style={{height: height, marginTop: '-30px'}}>
          <h2 style={{margin: '0', color: 'dimgrey'}}>Анкеты объектов</h2>
          <h3 style={{margin: '5px 0 15px 0', color: 'dimgrey'}}>Авторизация</h3>
          <div style={{width: '235px'}}>
            <div>
              <span className='p-input-icon-left'>
                <InputText value={login} onChange={(e) => setLogin(e.target.value)} placeholder='Введите логин' />
                <i className="pi pi-user" />
              </span>
            </div>
            <Button label="Войти" icon="pi pi-check" onClick={() => checkLogin()} className="p-button-success p-button-raised mt-3" style={{width: 'inherit'}} />
          </div>
        </div>
        <Toast ref={toast} />
      </>
    )
  } else {return (<></>)}
}
