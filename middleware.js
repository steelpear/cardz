import { NextResponse } from 'next/server'

export const config = {
  matcher: ['/','/info', '/card/:path*', '/edit/:path*']
}

export default function middleware(req){
  const verify = req.cookies.get('_qHWj5dMs-p27yKjuy')
  const url = req.url
  const _url = process.env.API_URL

  if (!verify) {return NextResponse.redirect(`${_url}/auth`)}
  if (verify && url.includes('/auth')) {return NextResponse.redirect(`${_url}/`)}
}
