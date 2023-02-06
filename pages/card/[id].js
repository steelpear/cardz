import {MainLayout} from '../../components/MainLayout'
import { Link } from 'react-scroll'
import styles from '@/styles/Card.module.css'

export default function Card({card}) {
  return(
    <MainLayout>
      <main className={styles.main}>
        <h1 style={{textAlign:'center', marginTop: '55px'}}>{card.name}</h1>
        {card.sections && card.sections.length > 0 ? <>
          <div className={styles.tabs_wrap}>
            {card.sections.map((section, index) => {
              return (
                <div className={styles.tab} key={index}>
                  <Link
                    activeClass={styles.active}
                    className={styles.non_active}
                    to={`#${index}`}
                    spy={true}
                    smooth={true}
                    offset={-160}
                    duration={500}
                  >{section.tabName}</Link>
                </div>
              )
            })}
          </div>
          <div>
            {card.sections.map((section, index) => {
              return (<div key={index}>
                <div id={`#${index}`} style={{fontWeight: 'bold'}}>{section.sectionName}</div>
                <div dangerouslySetInnerHTML={{__html: section.sectionText}} />
              </div>
              )
            })}
          </div>
        </> : <><div dangerouslySetInnerHTML={{__html: card.description}} /></>}
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
