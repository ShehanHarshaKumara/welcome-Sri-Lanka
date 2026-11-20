import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react"
import interactiveTourMap from "../assets/sri-lanka-interactive-tour-map.png"
import toursHeroImage from "../assets/tours-hero-tea-country.jpg"
import "../styles/tours-about.css"

type Tour = { title:string; days:string; price:string; type:string; img:string; highlights:string[]; description:string; bestFor:string; rating:string; reviews:number }
type ToursPageProps = { tours:Tour[]; onNavigate:(page:"home"|"experiences"|"gallery"|"reach-us")=>void }

const filters=["All tours","Culture","Coast","Wildlife","Adventure"]
const aboutCards=[
  { id: "history", icon: "◉", title: "History & Culture", copy: "Sri Lanka boasts over 2,500 years of history, with Buddhist cultural heritage and ancient kingdom ruins across the island. Sigiriya Fortress, Dambulla Cave Temple and Kandy’s Temple of the Tooth are essential landmarks." },
  { id: "climate", icon: "☀", title: "Climate", copy: "Sri Lanka has a warm tropical climate throughout the year. Coastal areas stay warm, while the central highlands offer cooler air. Two monsoons make route planning important." },
  { id: "food", icon: "♨", title: "Food", copy: "Sri Lankan cuisine is famous for richly spiced curries. Coconut, rice and fresh seafood are key ingredients, while Ceylon tea is considered among the world’s finest." },
  { id: "location", icon: "⌖", title: "Location", copy: "Sri Lanka is an island nation in the Indian Ocean, south of India. Its area is approximately 65,610 km², making culture, wildlife, mountains and coast easy to combine." },
]
const destinations=[
  {icon:"🏙️",name:"Colombo",note:"Capital, casino and shopping",highlights:["Galle Face Green","Gangaramaya Temple","Pettah Market"]},
  {icon:"🛕",name:"Kandy",note:"Temple of the Tooth and gem traditions",highlights:["Kandy Lake","Royal Botanical Gardens","Cultural dance"]},
  {icon:"🏰",name:"Sigiriya",note:"Ancient rock fortress",highlights:["Lion’s Gate","Royal frescoes","Water gardens"]},
  {icon:"🍃",name:"Nuwara Eliya",note:"Tea plantations and waterfalls",highlights:["Gregory Lake","Tea factory","Victoria Park"]},
  {icon:"🌉",name:"Ella",note:"Nine Arch Bridge and mountain scenery",highlights:["Little Adam’s Peak","Ella Rock","Scenic railway"]},
  {icon:"🐆",name:"Yala National Park",note:"Leopards, elephants and safari",highlights:["Jeep safari","Birdlife","Coastal wilderness"]},
  {icon:"🐋",name:"Mirissa",note:"Whale watching and beach",highlights:["Golden beach","Coconut Tree Hill","Ocean excursions"]},
  {icon:"🏛️",name:"Galle",note:"Historic Dutch Fort",highlights:["Fort ramparts","Lighthouse","Colonial streets"]},
]
const mapPlaces=[
  {name:"Sigiriya",district:"Matale District",category:"Heritage",image:"/assets/sigiriya-01.jpg",x:47,y:28,color:"#ef4444",rating:"4.9",summary:"Climb the legendary rock citadel and explore royal gardens shaped more than 1,500 years ago.",tags:["Heritage","Hiking","History","Nature"]},
  {name:"Kandy",district:"Kandy District",category:"Culture",image:"https://media.istockphoto.com/id/502631824/photo/temple-of-the-tooth-kandy-sri-lanka.jpg?s=612x612&w=0&k=20&c=2ltjIh94gedLEJ0rgu8djEXhrfatIcVBZCH6WVr3z0k=",x:41,y:43,color:"#f59e0b",rating:"4.8",summary:"Experience Sri Lanka's sacred hill capital, lakeside calm and living cultural traditions.",tags:["Temple","Culture","Gardens","Dance"]},
  {name:"Nuwara Eliya",district:"Nuwara Eliya District",category:"Highlands",image:"/assets/nuwara-eliya-01.jpg",x:50,y:49,color:"#22c55e",rating:"4.8",summary:"Follow tea roads through cool mountain air, waterfalls and rolling emerald estates.",tags:["Tea","Scenery","Cool Air","Walks"]},
  {name:"Ella",district:"Badulla District",category:"Adventure",image:"/assets/nine-arch-bridge-main.png",x:61,y:54,color:"#8b5cf6",rating:"4.9",summary:"Ride the highland railway, cross Nine Arch Bridge and hike above cloud-filled valleys.",tags:["Rail","Hiking","Views","Waterfalls"]},
  {name:"Galle Fort",district:"Galle District",category:"Heritage",image:"/assets/galle-fort-01.jpg",x:36,y:75,color:"#3b82f6",rating:"4.8",summary:"Walk sunset ramparts, lighthouse lanes and beautifully preserved streets beside the sea.",tags:["Fort","Coast","History","Food"]},
  {name:"Mirissa",district:"Matara District",category:"Coast",image:"/assets/mirissa-01.jpg",x:50,y:80,color:"#ec4899",rating:"4.9",summary:"Slow down on a palm-fringed beach and head offshore for responsible whale watching.",tags:["Beach","Whales","Surf","Sunset"]},
  {name:"Yala National Park",district:"Hambantota District",category:"Wildlife",image:"/assets/kandalama-01.jpg",x:69,y:67,color:"#d97706",rating:"4.9",summary:"Search for leopards, elephants and brilliant birdlife across wild coastal landscapes.",tags:["Safari","Leopards","Birds","Nature"]},
  {name:"Trincomalee",district:"Trincomalee District",category:"Coast",image:"/assets/trincomalee-01.jpg",x:56,y:17,color:"#2563eb",rating:"4.8",summary:"Discover clear eastern water, cliff-top temples and calm beaches around a vast natural harbour.",tags:["Beach","Temple","Diving","Harbour"]},
]
const travelGuide=[
  {icon:"✈",title:"Visa Information",copy:"Entry requirements depend on nationality and can change.",items:["Check Sri Lanka’s official immigration guidance","Keep passport and onward-travel details available","Confirm your airport pickup before arrival"]},
  {icon:"☀",title:"Weather & Season",copy:"Two monsoons make Sri Lanka a year-round destination.",items:["December–April: west, south and hills","May–September: east coast and Cultural Triangle","Highland evenings can feel cool"]},
  {icon:"▣",title:"What to Pack",copy:"Light, comfortable and respectful clothing works best.",items:["Walking shoes, sun protection and repellent","A light rain layer and warm highland layer","Shoulders and knees covered at temples"]},
  {icon:"$",title:"Budget Planning",copy:"Choose the travel style that works for you.",items:["Value, comfort, boutique or premium stays","Entrance fees and activities listed clearly","Carry local currency for small purchases"]},
  {icon:"◎",title:"Safety Information",copy:"Simple preparation makes island travel straightforward.",items:["Use sealed or properly filtered water","Follow guides around wildlife and ocean conditions","Comprehensive travel insurance is recommended"]},
  {icon:"✦",title:"Culture & Etiquette",copy:"Small gestures create warmer local encounters.",items:["Remove shoes and hats at temples","Do not pose with your back to a Buddha image","Ask before photographing people"]},
]
const vehicleFleet=[
  {name:"Toyota Prius",type:"Hybrid sedan",image:"/assets/vehicles/toyota-prius.png",accent:"from-sky-400 to-cyan-300"},
  {name:"Honda Civic",type:"Sport sedan",image:"/assets/vehicles/honda-civic.png",accent:"from-rose-500 to-orange-400"},
  {name:"Toyota Corolla",type:"Comfort sedan",image:"/assets/vehicles/toyota-corolla.png",accent:"from-slate-300 to-white"},
  {name:"Toyota Hiace",type:"Tour van",image:"/assets/vehicles/toyota-hiace.png",accent:"from-amber-300 to-orange-300"},
  {name:"Suzuki Every",type:"Compact van",image:"/assets/vehicles/suzuki-every.png",accent:"from-emerald-300 to-teal-300"},
  {name:"Full Fleet",type:"Compare the range",image:"/assets/vehicles/full-fleet.png",accent:"from-violet-400 to-fuchsia-400"},
]
const sampleRoute=[
  {day:"1",title:"Arrival Colombo & Transfer to Kandy",theme:"Cultural Experience Begins",activities:[["08:00","Airport Arrival"],["10:00","Coconut Plantation Visit"],["12:30","Traditional Sri Lankan Lunch"],["14:00","Scenic Transfer to Kandy"],["19:00","Kandy Lake Walk"]],stay:"Kandy · 4-star hotel"},
  {day:"2",title:"Kandy Cultural Tour",theme:"Buddhist Culture & Gem Exploration",activities:[["08:30","Temple of the Tooth"],["11:00","Gem Museum & Workshop"],["13:00","Kandy Lunch"],["14:30","Royal Botanical Gardens"],["17:00","Cultural Performance"]],stay:"Kandy · 4-star hotel"},
  {day:"3",title:"Nuwara Eliya Tea Plantations",theme:"Highlands & Tea Culture",activities:[["08:30","Tea Plantation Tour"],["11:30","Ceylon Tea Tasting"],["13:00","Estate Lunch"],["14:30","Gregory Lake"],["16:30","Victoria Park"]],stay:"Nuwara Eliya · 4-star hotel"},
  {day:"4",title:"Ella & Yala National Park",theme:"Nature & Wildlife",activities:[["08:00","Nine Arch Bridge"],["10:00","Little Adam’s Peak"],["12:30","Ella Lunch"],["14:00","Transfer to Yala"],["16:00","Jeep Safari"]],stay:"Yala · safari lodge"},
  {day:"5",title:"Mirissa & Return to Colombo",theme:"Beach & Whale Watching",activities:[["05:00","Optional Whale Watching"],["10:30","Mirissa Beach"],["12:30","Seafood Lunch"],["14:00","Galle Fort Visit"],["16:30","Return to Colombo"]],stay:"Departure or optional Colombo stay"},
]
function categoryOf(tour:Tour){
  const value=`${tour.type} ${tour.title} ${tour.description}`.toLowerCase()
  if(/wild|safari|elephant|leopard/.test(value)) return "Wildlife"
  if(/beach|coast|ocean|surf|wellness/.test(value)) return "Coast"
  if(/hike|trek|adventure|rail|active/.test(value)) return "Adventure"
  return "Culture"
}

function AboutSriLanka() {
  const [activeTopic, setActiveTopic] = useState(0)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

  const handleTabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = aboutCards.length - 1
    let next: number
    switch (event.key) {
      case "ArrowLeft":
      case "ArrowUp":
        next = (index + last) % aboutCards.length
        break
      case "ArrowRight":
      case "ArrowDown":
        next = (index + 1) % aboutCards.length
        break
      case "Home":
        next = 0
        break
      case "End":
        next = last
        break
      default:
        return
    }
    event.preventDefault()
    setActiveTopic(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <section id="tour-overview" className="mb-20 scroll-mt-28" aria-labelledby="tour-overview-title">
      <header className="mb-8 text-center sm:mb-12">
        <h2 id="tour-overview-title" className="mb-4 text-4xl font-medium text-[#0A2342] md:text-5xl">About Sri Lanka</h2>
        <p className="mx-auto max-w-3xl text-lg text-gray-600">Discover the history, climate, food and location that make this compact island an extraordinary place to tour.</p>
      </header>

      <div className="tour-about-stage mx-auto grid max-w-5xl items-center gap-8 rounded-[1.75rem] px-4 py-6 sm:gap-12 sm:px-8 sm:py-10 md:grid-cols-[minmax(0,18rem)_minmax(0,22rem)] md:justify-center md:px-10">
        <div role="tablist" aria-label="About Sri Lanka topics" className="tour-about-topics mx-auto grid w-full max-w-md grid-cols-2 gap-2 md:grid-cols-1 md:gap-3">
          {aboutCards.map(({ id, icon, title }, index) => (
            <button
              key={id}
              ref={(element) => { tabRefs.current[index] = element }}
              type="button"
              role="tab"
              id={`tour-about-tab-${id}`}
              aria-controls={`tour-about-panel-${id}`}
              aria-selected={index === activeTopic}
              tabIndex={index === activeTopic ? 0 : -1}
              className="tour-about-tab"
              onClick={() => setActiveTopic(index)}
              onKeyDown={(event) => handleTabKey(event, index)}
            >
              <span className="tour-about-tab__icon" aria-hidden="true">{icon}</span>
              <span>{title}</span>
            </button>
          ))}
        </div>

        <div className="tour-about-watch">
          <div className="tour-about-watch__case">
            <span className="tour-about-watch__crown" aria-hidden="true" />
            <span className="tour-about-watch__button" aria-hidden="true" />
            <div className="tour-about-watch__screen">
              {aboutCards.map(({ id, icon, title, copy }, index) => (
                <div
                  key={id}
                  id={`tour-about-panel-${id}`}
                  role="tabpanel"
                  aria-labelledby={`tour-about-tab-${id}`}
                  aria-hidden={index !== activeTopic}
                  tabIndex={index === activeTopic ? 0 : -1}
                  className="tour-about-watch__panel"
                >
                  <span className="tour-about-watch__icon" aria-hidden="true">{icon}</span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              ))}
              <div className="tour-about-watch__dots" aria-hidden="true">
                {aboutCards.map(({ id }, index) => <span key={id} className={index === activeTopic ? "is-active" : ""} />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function ToursPage({tours,onNavigate}:ToursPageProps){
  const [filter,setFilter]=useState("All tours")
  const [showAll,setShowAll]=useState(false)
  const [selectedMapPlace,setSelectedMapPlace]=useState<string|null>(null)
  const [mapZoom,setMapZoom]=useState(1)
  const [selectedVehicle,setSelectedVehicle]=useState(0)
  const fleetVideoRef=useRef<HTMLVideoElement>(null)
  const filtered=useMemo(()=>filter==="All tours"?tours:tours.filter((tour)=>categoryOf(tour)===filter),[filter,tours])
  const visible=showAll?filtered:filtered.slice(0,6)
  const activeMapPlace=mapPlaces.find((place)=>place.name===selectedMapPlace)??mapPlaces[0]
  const activeVehicle=vehicleFleet[selectedVehicle]

  const focusMapPlace=(name:string)=>{
    setSelectedMapPlace(name)
    setMapZoom(1.45)
  }

  useEffect(()=>{
    const video=fleetVideoRef.current
    if(!video) return
    video.muted=true
    const startPlayback=()=>{ void video.play().catch(()=>undefined) }
    startPlayback()
    video.addEventListener("canplay",startPlayback,{once:true})
    return ()=>video.removeEventListener("canplay",startPlayback)
  },[])

  return <main className="tours-page-responsive min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-800">
    <section className="relative isolate flex min-h-[34rem] items-center justify-center overflow-hidden bg-[#071b2c] px-1 pb-10 pt-28 text-center sm:min-h-[28rem] sm:pb-8 sm:pt-24 md:h-[clamp(30rem,42vw,42rem)]">
      <img src={toursHeroImage} alt="" fetchPriority="high" className="absolute inset-0 h-full! w-full object-cover object-[64%_center] md:object-[center_12%]"/>
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-[#071b2c]/40 via-[#071b2c]/60 to-[#071b2c]/30"/>
      <div className="relative z-10 mx-auto max-w-3xl px-4 text-white">
        <h1 className="mb-4 text-4xl font-medium leading-tight sm:text-5xl md:text-6xl">Sri Lanka Tour Packages</h1>
        <p className="mx-auto max-w-2xl text-base leading-7 text-white/90 sm:text-lg md:text-xl">Sri Lanka, known as the Pearl of the Indian Ocean, is a beautiful island where rich history, diverse culture and stunning natural landscapes come together.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <span className="rounded-full bg-[#FFD700] px-4 py-2 text-sm font-semibold text-[#0A2342]">◷ 5–14 Days</span>
          <span className="rounded-full bg-[#FFD700] px-4 py-2 text-sm font-semibold text-[#0A2342]">♟ Private Travel</span>
          <span className="rounded-full bg-[#FFD700] px-4 py-2 text-sm font-semibold text-[#0A2342]">★ 4.9/5</span>
        </div>
      </div>
    </section>

    <section className="py-12 sm:py-20">
      <div className="container mx-auto max-w-7xl px-4">
        <AboutSriLanka />

        <div id="tour-options" className="mb-10 scroll-mt-28 text-center"><h2 className="mb-4 text-4xl font-medium text-[#0A2342] md:text-5xl">Choose Your Tour</h2><p className="text-lg text-gray-600">Our most-loved routes across the island</p></div>
        <div className="mb-8 flex flex-wrap justify-center gap-3">
          {filters.map((item)=><button type="button" key={item} onClick={()=>{setFilter(item);setShowAll(false)}} className={`rounded-full px-5 py-2 text-sm font-semibold transition ${filter===item?"bg-[#0A2342] text-white shadow-lg":"border border-gray-200 bg-white text-gray-600 hover:border-[#FFD700]"}`}>{item}</button>)}
        </div>

        <div className="mx-auto max-w-6xl space-y-8">
          {visible.map((tour,index)=><article key={tour.title} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition hover:shadow-xl">
            <div className="grid md:grid-cols-3">
              <div className="relative h-64 md:h-auto"><img src={tour.img} alt={tour.title} loading="lazy" className="h-full w-full object-cover"/><div className="absolute left-4 top-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFD700] text-xl font-semibold text-[#0A2342]">{String(index+1).padStart(2,"0")}</div></div>
              <div className="p-5 sm:p-7 md:col-span-2 md:p-8">
                <div className="mb-3 flex flex-wrap items-center gap-2"><span className="rounded-full bg-[#0A2342] px-3 py-1 text-xs font-semibold text-white">{categoryOf(tour)}</span><span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">◷ {tour.days}</span><span className="text-sm text-amber-500">★ {tour.rating} ({tour.reviews})</span></div>
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><h3 className="mb-3 text-3xl font-medium text-[#0A2342]">{tour.title}</h3><p className="max-w-2xl leading-7 text-gray-600">{tour.description}</p></div><strong className="whitespace-nowrap text-2xl text-[#0A2342]">{tour.price}<small className="block text-right text-xs font-normal text-gray-500">starting price</small></strong></div>
                <div className="my-5 flex flex-wrap gap-2">{tour.highlights.map((place)=><span key={place} className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">⌖ {place}</span>)}</div>
                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-5"><p className="text-sm text-gray-500">Best for <strong className="text-gray-700">{tour.bestFor}</strong></p><button type="button" onClick={()=>onNavigate("reach-us")} className="rounded-lg bg-[#FFD700] px-5 py-2.5 font-semibold text-[#0A2342] transition hover:bg-[#FFA500]">View Tour →</button></div>
              </div>
            </div>
          </article>)}
        </div>
        {!showAll&&filtered.length>6&&<div className="mt-10 text-center"><button type="button" onClick={()=>setShowAll(true)} className="rounded-lg bg-[#0A2342] px-7 py-3 font-semibold text-white shadow-lg">Show All Tours</button></div>}

        <section id="tour-map" className="relative left-1/2 my-20 w-screen -translate-x-1/2 scroll-mt-24 overflow-hidden bg-[#021d31] text-white shadow-[0_35px_100px_rgba(3,29,50,.35)]" aria-labelledby="tour-route-map-title">
          <div className="mobile-map-shell relative min-h-[62rem] overflow-hidden lg:aspect-[16/9] lg:min-h-0">
            <div className="mobile-map-canvas absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)]" style={{transform:`scale(${mapZoom})`,transformOrigin:`${activeMapPlace.x}% ${activeMapPlace.y}%`}}>
              <img src={interactiveTourMap} alt="Illustrated Sri Lanka tourist map with major destinations" className="h-full w-full object-cover object-center" />
              <div className="absolute inset-0 bg-[#00182a]/5" />
              {mapPlaces.map((place)=><button type="button" key={place.name} onClick={()=>focusMapPlace(place.name)} aria-label={`Show ${place.name} details`} className="absolute z-10 hidden h-14 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-transparent outline-none focus-visible:ring-4 focus-visible:ring-white/70 lg:block" style={{left:`${place.x}%`,top:`${place.y}%`}}><span className="sr-only">{place.name}</span></button>)}
            </div>

            <div className="mobile-map-swipe-hint" aria-hidden="true"><span>↔</span> Swipe to explore the full map</div>

            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#021725]/95 to-transparent lg:hidden" />
            <div className="mobile-map-ui relative z-30 grid min-h-[62rem] content-between gap-5 p-4 sm:p-6 lg:absolute lg:inset-0 lg:block lg:min-h-0 lg:p-0">
              <aside className="rounded-2xl border border-white/20 bg-[#031c2f]/88 p-4 shadow-2xl backdrop-blur-xl lg:absolute lg:left-[1.4%] lg:top-[9%] lg:w-[18.5%] lg:p-3 xl:p-4">
                <p className="text-xs font-semibold text-white/80 sm:text-sm">Explore Sri Lanka</p>
                <h2 id="tour-route-map-title" className="mt-1 text-3xl font-black leading-none sm:text-4xl lg:text-[clamp(1.3rem,2.1vw,2.2rem)]">Tourist Map</h2>
                <p className="mt-2 text-xs leading-5 text-white/65 lg:text-[10px] lg:leading-4 xl:text-xs xl:leading-5">Click a destination to reveal its travel details.</p>
                <div className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
                  {mapPlaces.map((place)=><button type="button" key={place.name} onClick={()=>focusMapPlace(place.name)} aria-pressed={selectedMapPlace===place.name} className={`flex min-w-[12rem] shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-left transition lg:min-w-0 ${selectedMapPlace===place.name?"border-[#ffc25a] bg-[#173950] shadow-[0_0_18px_rgba(255,194,90,.6)]":"border-white/20 bg-[#08253a]/90 hover:border-white/45"}`}>
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-xs font-black text-white" style={{background:place.color}}>⌖</span>
                    <span className="min-w-0 flex-1 truncate text-xs font-bold xl:text-sm">{place.name}</span><span>›</span>
                  </button>)}
                </div>
              </aside>

              {selectedMapPlace ? <article className="tour-map-detail-card relative self-end overflow-hidden rounded-2xl border border-white/25 bg-[#04243a]/94 p-3 text-white shadow-2xl backdrop-blur-xl lg:absolute lg:right-[1.2%] lg:top-[9%] lg:w-[21.5%] lg:p-3 xl:p-4" aria-live="polite">
                <button type="button" onClick={()=>{setSelectedMapPlace(null);setMapZoom(1)}} className="absolute right-5 top-5 z-10 grid h-8 w-8 place-items-center rounded-full border border-white/25 bg-[#021827]/75 text-sm text-white backdrop-blur hover:bg-white hover:text-[#06223a]" aria-label="Close destination details">×</button>
                <img key={activeMapPlace.image} src={activeMapPlace.image} alt={activeMapPlace.name} className="h-40 w-full rounded-xl object-cover lg:h-[clamp(6.5rem,11vw,10rem)]" />
                <div className="mt-3 flex items-center gap-2"><span className="text-xl" style={{color:activeMapPlace.color}}>⌖</span><h3 className="min-w-0 truncate text-2xl font-black lg:text-[clamp(1.1rem,1.7vw,1.8rem)]">{activeMapPlace.name}</h3></div>
                <p className="mt-1 text-xs text-white/55">⌖ {activeMapPlace.district}</p>
                <p className="mt-2 text-xs font-bold text-[#ffd05e]">★ {activeMapPlace.rating} <span className="font-normal text-white/60">traveller rating</span></p>
                <p className="mt-3 text-xs leading-5 text-white/75 lg:text-[10px] lg:leading-4 xl:text-xs xl:leading-5">{activeMapPlace.summary}</p>
                <div className="mt-3 grid grid-cols-4 gap-1">{activeMapPlace.tags.map((tag)=><span key={tag} className="grid min-h-11 place-items-center rounded-lg border border-white/15 bg-white/[.04] px-1 text-center text-[8px] font-bold text-white/75">{tag}</span>)}</div>
                <button type="button" onClick={()=>onNavigate("reach-us")} className="mt-4 w-full rounded-full bg-gradient-to-r from-[#ffad19] to-[#f23f6d] px-4 py-3 text-xs font-black text-white shadow-lg">Explore tours →</button>
              </article> : <div className="self-end rounded-2xl border border-white/20 bg-[#032139]/80 p-4 shadow-xl backdrop-blur-xl lg:absolute lg:right-[1.5%] lg:top-[10%] lg:w-[18rem]">
                <p className="text-[9px] font-black uppercase tracking-[.2em] text-[#60bdf3]">Interactive map</p>
                <p className="mt-2 text-sm leading-6 text-white/75">Choose a destination from the list or tap a coloured map pin to open its details.</p>
              </div>}

              <div className="absolute bottom-4 right-4 hidden flex-col overflow-hidden rounded-xl border border-white/25 bg-[#031b2d]/90 shadow-xl backdrop-blur lg:flex">
                <button type="button" onClick={()=>{setSelectedMapPlace(null);setMapZoom(1)}} className="grid h-10 w-10 place-items-center border-b border-white/15 text-xs hover:bg-white/10" aria-label="Show the full island map">⌂</button>
                <button type="button" onClick={()=>setMapZoom((zoom)=>Math.min(1.55,Number((zoom+.12).toFixed(2))))} className="grid h-10 w-10 place-items-center border-b border-white/15 text-lg hover:bg-white/10" aria-label="Zoom map in">+</button>
                <button type="button" onClick={()=>setMapZoom((zoom)=>Math.max(1,Number((zoom-.12).toFixed(2))))} className="grid h-10 w-10 place-items-center text-lg hover:bg-white/10" aria-label="Zoom map out">−</button>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-20">
          <div className="mb-12 text-center"><span className="inline-block rounded-full border border-[#FFD700]/40 bg-white px-6 py-2 text-sm uppercase tracking-wider text-[#0A2342]">Location Guide</span><h2 className="mt-4 text-4xl font-medium text-[#0A2342] md:text-5xl">Places to Experience</h2><p className="mx-auto mt-3 max-w-2xl text-lg text-gray-600">Eight essential destinations from the original About Sri Lanka guide</p></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">{destinations.map((destination)=><article key={destination.name} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl"><div className="bg-gradient-to-br from-[#0A2342] to-[#1a4a7a] p-6 text-white"><span className="text-4xl">{destination.icon}</span><h3 className="mt-4 text-2xl font-medium">{destination.name}</h3><p className="mt-1 text-sm text-white/70">{destination.note}</p></div><div className="p-5"><h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-amber-600">Highlights</h4><ul className="space-y-2">{destination.highlights.map((item)=><li key={item} className="flex gap-2 text-sm text-gray-600"><span className="text-amber-500">✓</span>{item}</li>)}</ul></div></article>)}</div>
        </section>

        <section id="travel-guide" className="mb-20 scroll-mt-28">
          <div className="mb-12 text-center"><span className="inline-block rounded-full border border-[#FFD700]/40 bg-white px-6 py-2 text-sm uppercase tracking-wider text-[#0A2342]">Good to Know</span><h2 className="mt-4 text-4xl font-medium text-[#0A2342] md:text-5xl">Sri Lanka Travel Guide</h2><p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">Practical essentials for a smoother, more confident journey around the island.</p></div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{travelGuide.map((guide)=><article key={guide.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition hover:border-[#FFD700] hover:shadow-xl"><div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#FFD700] to-[#FFA500] text-xl text-[#0A2342]">{guide.icon}</div><h3 className="mb-2 text-xl font-medium text-[#0A2342]">{guide.title}</h3><p className="mb-4 text-sm leading-6 text-gray-600">{guide.copy}</p><ul className="space-y-2">{guide.items.map((item)=><li key={item} className="flex gap-2 text-sm text-gray-600"><span className="font-bold text-amber-500">✓</span>{item}</li>)}</ul></article>)}</div>
        </section>

        <section id="vehicle-fleet" className="relative left-1/2 mb-20 w-screen -translate-x-1/2 scroll-mt-24 overflow-hidden bg-[#07131f] py-16 text-white sm:py-20" aria-labelledby="fleet-title">
          <div className="pointer-events-none absolute -left-28 top-12 h-80 w-80 rounded-full bg-cyan-400/10 blur-[100px]" aria-hidden="true" />
          <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-amber-400/10 blur-[120px]" aria-hidden="true" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[.2em] text-cyan-200"><span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" />Your ride, your route</span>
                <h2 id="fleet-title" className="mt-5 text-4xl font-medium leading-tight sm:text-5xl lg:text-6xl">Meet the fleet for your Sri Lanka journey</h2>
                <p className="mt-5 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">Preview each vehicle style and choose the one that feels right for your route.</p>
              </div>
              <button type="button" onClick={()=>onNavigate("reach-us")} className="w-fit rounded-full bg-[#FFD700] px-6 py-3 text-sm font-bold text-[#07131f] shadow-[0_12px_35px_rgba(255,215,0,.22)] transition hover:-translate-y-0.5 hover:bg-[#ffe34d]">Ask about a vehicle →</button>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1.35fr_.85fr]">
              <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[.04] p-2 shadow-[0_24px_60px_rgba(0,0,0,.28)] sm:p-3">
                <div className="relative overflow-hidden rounded-[1.5rem] bg-black">
                  <video ref={fleetVideoRef} className="pointer-events-none aspect-video w-full object-cover" src="/assets/vehicles/fleet-showcase.mp4" autoPlay muted loop playsInline preload="auto" aria-label="Vehicle fleet showcase" />
                  <div className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/45 px-3 py-2 text-[10px] font-bold uppercase tracking-[.18em] text-white backdrop-blur-md sm:left-6 sm:top-6 sm:text-xs"><span className="h-2 w-2 rounded-full bg-emerald-400" />Auto loop</div>
                </div>
                <div className="flex flex-col gap-2 px-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                  <div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-cyan-300">Fleet in motion</p><p className="mt-1 text-sm text-white/70">A quick look before you choose.</p></div>
                  <span className="text-xs text-white/40">No controls · Seamless playback</span>
                </div>
              </article>

              <article className="group relative min-h-[24rem] overflow-hidden rounded-[2rem] border border-white/10 bg-[#0d1e2c] shadow-[0_30px_80px_rgba(0,0,0,.28)]">
                <img key={activeVehicle.image} src={activeVehicle.image} alt={activeVehicle.name} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06101a] via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <div className={`mb-4 h-1 w-16 rounded-full bg-gradient-to-r ${activeVehicle.accent}`} />
                  <p className="text-xs font-bold uppercase tracking-[.22em] text-white/55">Selected vehicle · {String(selectedVehicle+1).padStart(2,"0")}</p>
                  <h3 className="mt-2 text-3xl font-medium sm:text-4xl">{activeVehicle.name}</h3>
                  <p className="mt-2 text-sm text-white/65">{activeVehicle.type}</p>
                </div>
              </article>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6" aria-label="Choose a vehicle to preview">
              {vehicleFleet.map((vehicle,index)=><button type="button" key={vehicle.name} onClick={()=>setSelectedVehicle(index)} aria-label={`Preview ${vehicle.name}`} aria-pressed={selectedVehicle===index} className={`group overflow-hidden rounded-2xl border p-1.5 text-left transition duration-300 ${selectedVehicle===index?"border-[#FFD700] bg-white/10 shadow-[0_0_0_1px_rgba(255,215,0,.25),0_15px_35px_rgba(0,0,0,.25)]":"border-white/10 bg-white/[.035] hover:-translate-y-1 hover:border-white/30"}`}>
                <img src={vehicle.image} alt="" className="aspect-[4/3] w-full rounded-xl object-cover" />
                <div className="px-2 pb-2 pt-3"><p className="truncate text-sm font-semibold text-white">{vehicle.name}</p><p className="mt-0.5 truncate text-[11px] text-white/45">{vehicle.type}</p></div>
              </button>)}
            </div>
          </div>
        </section>

        <section id="sample-journey" className="mb-20 scroll-mt-28">
          <div className="mb-12 text-center"><span className="inline-block rounded-full border border-[#FFD700]/40 bg-white px-6 py-2 text-sm uppercase tracking-wider text-[#0A2342]">Day by Day</span><h2 className="mt-4 text-4xl font-medium text-[#0A2342] md:text-5xl">Sample 5-Day Journey</h2></div>
          <div className="space-y-8">{sampleRoute.map((day)=><article key={day.day} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xl sm:p-6 md:p-8"><div className="mb-7 flex flex-col gap-4 md:flex-row md:items-center"><div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFD700] to-[#FFA500] text-2xl font-semibold text-[#0A2342] shadow-lg">{day.day}</div><div><span className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-3 py-1 text-xs font-semibold text-white">{day.theme}</span><h3 className="mt-2 text-2xl font-medium text-[#0A2342]">{day.title}</h3></div></div><div className="ml-2 space-y-3 border-l-4 border-[#FFD700]/30 pl-5 sm:ml-5 sm:pl-7">{day.activities.map(([time,activity])=><div key={time} className="relative rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-3 sm:p-4"><span className="absolute -left-[35px] top-4 flex h-7 w-7 items-center justify-center rounded-full bg-[#FFD700] text-xs text-[#0A2342] sm:-left-[45px]">●</span><div className="flex flex-wrap items-center gap-3"><span className="rounded-md bg-[#0A2342] px-2.5 py-1 text-xs text-white">{time}</span><strong className="font-medium text-[#0A2342]">{activity}</strong></div></div>)}</div><div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-gray-600"><strong className="text-[#0A2342]">Accommodation:</strong> {day.stay}</div></article>)}</div>
        </section>

      </div>
    </section>
  </main>
}
