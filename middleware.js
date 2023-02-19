import { NextResponse } from 'next/server'

export default function middleware(req){
  const verify = req.cookies.get('_qHWj5dMs-p27yKjuy')
  const url = req.url
  const _url = process.env.API_URL

  if(!verify && url === `${_url}/`){return NextResponse.redirect(`${_url}/auth`)}
  if(!verify && url === `${_url}/info`){return NextResponse.redirect(`${_url}/auth`)}
  if(!verify && url.includes('/card')){return NextResponse.redirect(`${_url}/auth`)}
  if(!verify && url.includes('/edit')){return NextResponse.redirect(`${_url}/auth`)}
  if (verify && url.includes('/auth')) {return NextResponse.redirect(`${_url}/`)}
}
