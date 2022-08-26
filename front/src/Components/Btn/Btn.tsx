import React from 'react'

export  function Btn(icon = null, text:any, fct: () => void, classCss:string) {
  return (
    <button className={classCss} onClick={fct} >
      {icon}
      {text}
    </button>
    
  )
}
