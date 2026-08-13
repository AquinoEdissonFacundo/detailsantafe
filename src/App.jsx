import { useEffect, useRef } from 'react'
import pageMarkup from './content.html?raw'
import demoScript from './demoScript.js?raw'

export default function App() {
  const rootRef = useRef(null)

  useEffect(() => {
    // La demo original conserva sus animaciones, menú y cotizador de WhatsApp.
    const runDemo = new Function(demoScript)
    runDemo()

    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return <main ref={rootRef} dangerouslySetInnerHTML={{ __html: pageMarkup }} />
}
