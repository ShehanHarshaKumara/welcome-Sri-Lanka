import { useEffect, useRef, useState } from "react"

type SitePage="home"|"destinations"|"tours"|"experiences"|"gallery"|"reach-us"
type SectionItem={id:string;label:string;icon:string}

const pageSections:Record<SitePage,SectionItem[]>={
  home:[
    {id:"home",label:"Welcome",icon:"●"},
    {id:"destinations",label:"Places",icon:"⌖"},
    {id:"experiences",label:"Experiences",icon:"✦"},
    {id:"tours",label:"Tours",icon:"◇"},
    {id:"reach-us",label:"Contact",icon:"➜"},
  ],
  destinations:[
    {id:"destination-overview",label:"Overview",icon:"●"},
    {id:"destination-tourist-map",label:"Map",icon:"⌖"},
    {id:"key-destinations-guide",label:"Guide",icon:"✦"},
    {id:"destination-smart-ride",label:"Transport",icon:"▰"},
    {id:"destination-gallery",label:"Gallery",icon:"▧"},
    {id:"destination-discovery",label:"Discover",icon:"➜"},
  ],
  tours:[
    {id:"tour-overview",label:"Overview",icon:"●"},
    {id:"tour-options",label:"Tours",icon:"✦"},
    {id:"tour-map",label:"Map",icon:"⌖"},
    {id:"travel-guide",label:"Guide",icon:"☼"},
    {id:"vehicle-fleet",label:"Vehicles",icon:"▰"},
    {id:"sample-journey",label:"Journey",icon:"➜"},
  ],
  experiences:[
    {id:"experiences-overview",label:"Welcome",icon:"●"},
    {id:"experiences-intro",label:"Story",icon:"✦"},
    {id:"experience-finder",label:"Experiences",icon:"◇"},
    {id:"experiences-seasons",label:"Seasons",icon:"◷"},
    {id:"experiences-day",label:"A day",icon:"☼"},
    {id:"experiences-closing",label:"Plan",icon:"➜"},
  ],
  gallery:[
    {id:"gallery-overview",label:"Welcome",icon:"●"},
    {id:"island-gallery-viewer",label:"Viewer",icon:"▧"},
    {id:"gallery-index",label:"Collections",icon:"◇"},
    {id:"gallery-journey",label:"Plan",icon:"➜"},
  ],
  "reach-us":[
    {id:"reach-enquiry",label:"Enquiry",icon:"✦"},
    {id:"reach-feedback",label:"Feedback",icon:"★"},
    {id:"reach-island-desk",label:"Island desk",icon:"⌖"},
  ],
}

export default function SectionNavigator({page}:{page:SitePage}){
  const items=pageSections[page]
  const alwaysVisible=page==="experiences"
  const [activeSection,setActiveSection]=useState(items[0].id)
  const [navigationReady,setNavigationReady]=useState(false)
  const [navigationVisible,setNavigationVisible]=useState(false)
  const hideTimer=useRef<number|null>(null)
  const activeIndex=Math.max(0,items.findIndex((item)=>item.id===activeSection))
  const isVisible=alwaysVisible||(navigationReady&&navigationVisible)

  useEffect(()=>{
    setActiveSection(items[0].id)
    setNavigationReady(false)
    setNavigationVisible(false)

    let animationFrame=0
    const syncNavigation=()=>{
      window.cancelAnimationFrame(animationFrame)
      animationFrame=window.requestAnimationFrame(()=>{
        const readingLine=window.scrollY+(window.innerHeight*.38)
        let currentSection=items[0].id
        for(const item of items){
          const section=document.getElementById(item.id)
          if(section&&window.scrollY+section.getBoundingClientRect().top<=readingLine) currentSection=item.id
        }
        setActiveSection(currentSection)
        if(alwaysVisible) return

        const isReady=window.scrollY>360
        setNavigationReady(isReady)
        if(hideTimer.current!==null) window.clearTimeout(hideTimer.current)
        if(isReady){
          setNavigationVisible(true)
          hideTimer.current=window.setTimeout(()=>setNavigationVisible(false),1400)
        }else{
          setNavigationVisible(false)
        }
      })
    }

    syncNavigation()
    window.addEventListener("scroll",syncNavigation,{passive:true})
    window.addEventListener("resize",syncNavigation)
    return ()=>{
      window.cancelAnimationFrame(animationFrame)
      if(hideTimer.current!==null) window.clearTimeout(hideTimer.current)
      window.removeEventListener("scroll",syncNavigation)
      window.removeEventListener("resize",syncNavigation)
    }
  },[items,alwaysVisible])

  const keepOpen=()=>{
    if(!navigationReady) return
    if(hideTimer.current!==null) window.clearTimeout(hideTimer.current)
    setNavigationVisible(true)
  }

  const release=()=>{
    if(alwaysVisible) return
    if(hideTimer.current!==null) window.clearTimeout(hideTimer.current)
    hideTimer.current=window.setTimeout(()=>setNavigationVisible(false),800)
  }

  const scrollToSection=(id:string)=>{
    document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"})
  }

  return <nav aria-label={`${page.replace("-"," ")} page sections`} aria-hidden={!isVisible} onMouseEnter={keepOpen} onMouseLeave={release} onFocus={keepOpen} onBlur={release} className={`fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 transition-all duration-500 lg:block ${isVisible?"visible translate-x-0 opacity-100":"pointer-events-none invisible translate-x-10 opacity-0"}`}>
    <div className="relative flex flex-col items-center gap-3 rounded-full border border-white/75 bg-white/55 px-2.5 py-4 shadow-[0_22px_60px_rgba(8,47,73,.22),inset_0_1px_0_rgba(255,255,255,.9)] ring-1 ring-sky-200/60 backdrop-blur-2xl">
      <span className="absolute bottom-8 left-1/2 top-8 w-[3px] -translate-x-1/2 overflow-hidden rounded-full bg-white/75 shadow-inner" aria-hidden="true">
        <span className="block w-full rounded-full bg-gradient-to-b from-sky-300 to-cyan-500 transition-[height] duration-500" style={{height:`${items.length>1?(activeIndex/(items.length-1))*100:100}%`}} />
      </span>
      {items.map((item,index)=><button type="button" key={item.id} onClick={()=>scrollToSection(item.id)} aria-label={`Go to ${item.label}`} aria-current={activeSection===item.id?"location":undefined} className={`group relative z-10 grid place-items-center rounded-full border text-[#082f49] outline-none transition-all duration-300 focus-visible:ring-4 focus-visible:ring-sky-200 ${activeSection===item.id?"h-11 w-11 border-white/90 bg-gradient-to-br from-sky-300 to-cyan-400 text-base shadow-[0_0_0_3px_rgba(255,255,255,.4),0_10px_28px_rgba(14,165,233,.4)]":"h-9 w-9 border-white/70 bg-sky-300/80 text-xs shadow-sm backdrop-blur hover:scale-110 hover:bg-sky-300"}`}>
        <span aria-hidden="true" className={index===0?"text-[9px]":"font-bold"}>{item.icon}</span>
        <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg border border-white/15 bg-[#0A2342]/90 px-3 py-2 text-xs font-bold text-white opacity-0 shadow-xl backdrop-blur-xl transition-all duration-200 group-hover:-translate-x-1 group-hover:opacity-100 group-focus-visible:-translate-x-1 group-focus-visible:opacity-100">{item.label}</span>
      </button>)}
    </div>
  </nav>
}
