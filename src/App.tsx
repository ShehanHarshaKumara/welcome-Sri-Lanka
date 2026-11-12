import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react"
import DestinationsPage from "./pages/DestinationsPage"
import ExperiencesPage from "./pages/ExperiencesPage"
import ReachUsPage from "./pages/ReachUsPage"
import ToursPage from "./pages/ToursPage"
import ScrollVanStory from "./components/ScrollVanStory"

// ─── Data ────────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: "Home", target: "home" },
  { label: "Destinations", target: "destinations" },
  { label: "Tours", target: "tours" },
  { label: "Experiences", target: "experiences" },
  { label: "Reach Us", target: "reach-us" },
]

const LANGUAGES = [
  { code: "en", flag: "🇬🇧", label: "English" },

  { code: "ja", flag: "🇯🇵", label: "日本語" },

  { code: "ko", flag: "🇰🇷", label: "한국어" },

  { code: "ru", flag: "🇷🇺", label: "Русский" },
]

const DESTINATIONS = [
  {
    name: "Sigiriya",

    type: "Ancient Fortress",

    img: "https://th.bing.com/th/id/R.141883ce9e6fd88f1071701dcdf2e4ac?rik=RMMnmYPoD6nAog&riu=http%3a%2f%2ftravellingclaus.com%2fwp-content%2fuploads%2f2018%2f02%2f1a22-1.jpg&ehk=fksnVD5daUgsXW%2b6HKdZfuU7go%2fkH6kMhY6xOVZWS3w%3d&risl=1&pid=ImgRaw&r=0",
    tag: "UNESCO Heritage",
  },

  {
    name: "Ella",

    type: "Hill Country",

    img: "https://www.cestujlevne.com/obrazky/17/89/1789-1840w.jpg",
    tag: "Most Loved",
  },

  {
    name: "Mirissa",

    type: "Beach & Whales",

    img: "https://img.traveltriangle.com/blog/wp-content/uploads/2019/09/Mirissa.jpg",
    tag: "Beach Paradise",
  },

  {
    name: "Kandy",

    type: "Cultural Capital",

    img: "https://media.istockphoto.com/id/502631824/photo/temple-of-the-tooth-kandy-sri-lanka.jpg?s=612x612&w=0&k=20&c=2ltjIh94gedLEJ0rgu8djEXhrfatIcVBZCH6WVr3z0k=",
    tag: "Sacred City",
  },

  {
    name: "Yala",

    type: "National Park",

    img: "https://storage.googleapis.com/ceybook_contents/uploads/blog_posts/media_content-1763453962.png",
    tag: "Wildlife Safari",
  },

  {
    name: "Galle",
    type: "Colonial Fort",

    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=1000&fit=crop&auto=format",
    tag: "Dutch Heritage",
  },
  {
    name: "Nuwara Eliya",
    type: "Tea Country",
    img: "https://tripjive.com/wp-content/uploads/2024/10/Nuwara-Eliya-attractions-5.jpg",
    tag: "Misty Highlands",
  },
  {
    name: "Unawatuna",
    type: "Tropical Beach",
    img: "https://media.istockphoto.com/photos/aerial-view-of-hiriketiya-beach-in-dikwella-blue-beach-in-sri-lanka-picture-id1371971078?k=20&m=1371971078&s=612x612&w=0&h=c-kNjpf62lRLUKtSP0U1GujvChSX1ISQo78cjEFMJdU=",
    tag: "Golden Sands",
  },
  {
    name: "Anuradhapura",
    type: "Ancient City",
    img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjmvikLUkB_5T7nvYrchBpucAuUWRRI5sQLgYcBTh4fJya76YkZWVJlbbeTzYZ2_q8Hur4_-Zh6XfulxwkJsefWUJeKhCRVflPRBQRk7zEyIRr1XRg5q1j-AhvxkbN3_CBCggI608KmHJcmgByG59ZWwfPZSq4yvaEOFqpmR_VUFdOkpVLbSHa8obGg/s1148/xl4muha3.png",
    tag: "Sacred Ruins",
  },
  {
    name: "Dambulla",
    type: "Cave Temples",
    img: "https://tse1.mm.bing.net/th/id/OIP.UuY8d36-b6PrRBNoqvJRGgHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    tag: "Golden Temple",
  },
  {
    name: "Bentota",
    type: "Coastal Escape",
    img: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=600&h=800&fit=crop&auto=format",
    tag: "Ocean Retreat",
  },
  {
    name: "Hikkaduwa",
    type: "Coral Coast",
    img: "https://www.cestujlevne.com/obrazky/17/83/1783-1200w.jpg",
    tag: "Surf & Sea",
  },
  {
    name: "Arugam Bay",
    type: "East Coast",
    img: "https://srilankatravelpages.com/my_content/uploads/2022/11/Elephant-Rock-beach-Arugam-Bay.jpg",
    tag: "Surf Paradise",
  },
  {
    name: "Trincomalee",
    type: "Harbour City",
    img: "https://tse2.mm.bing.net/th/id/OIP.P95QuNxZ1QNbQIJx2Uv42wHaHJ?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    tag: "Crystal Waters",
  },
  {
    name: "Jaffna",
    type: "Northern Heritage",
    img: "https://tse1.mm.bing.net/th/id/OIP.A3hQO3SczUYMzi5oNvOjfgHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    tag: "Cultural North",
  },
  {
    name: "Kalpitiya",
    type: "Kite &Dolphins",
    img: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/12/4e/2a/14/bay-of-bengal-resort.jpg?w=700&h=-1&s=1",
    tag: "Wild Coast",
  },
  {
    name: "Udawalawe",
    type: "Elephant Country",
    img: "https://cdn.forevervacation.com/uploads/digital/assets/udawalawe-national-park.webp",
    tag: "Safari Trails",
  },
  {
    name: "Minneriya",
    type: "Wildlife Park",
    img: "https://minneriyasafarisrilanka.com/wp-content/uploads/2023/09/IMG-20250920-WA0058.jpg",
    tag: "Elephant Gathering",
  },
  {
    name: "Polonnaruwa",
    type: "Royal Kingdom",
    img: "https://tse2.mm.bing.net/th/id/OIP.eh8hpZ_y49cLdVTbF7SHSQHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    tag: "Stone Kingdom",
  },
  {
    name: "Haputale",
    type: "Cloud Forest",
    img: "https://www.bluelankatours.com/wp-content/uploads/2020/06/Haputale-06.png",
    tag: "Hill Country",
  },
  {
    name: "Kithulgala",
    type: "Rainforest Adventure",
    img: "https://bestofceylon.com/images/best-day-tours/best-day-tours-from-colombo/kitulgala-adventure-day-tour-in-sri-lanka/kitulgala10.jpg",
    tag: "River Rapids",
  },
  {
    name: "Weligama",
    type: "Surf Town",
    img: "/assets/destinations/weligama-island.png",
    tag: "Easy Waves",
  },
  {
    name: "Tangalle",
    type: "Hidden Coast",
    img: "https://th.bing.com/th/id/R.b5a166ac11b0a20e9f192ce61a37a2e7?rik=LFWaYjOOXN1Nqg&pid=ImgRaw&r=0",
    tag: "Quiet Beaches",
  },
  {
    name: "Negombo",
    type: "Lagoon Town",
    img: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/33/fd/17/negombo.jpg?w=1800&h=1000&s=1",
    tag: "Seaside Welcome",
  },
  {
    name: "Colombo",
    type: "Capital Energy",
    img: "https://www.okvoyage.com/wp-content/uploads/2025/03/incontournables-a-visiter-a-colombo-au-sri-lanka.jpg",
    tag: "City & Coast",
  },
]

const DESTINATION_THEMES = [
  "#b95f3b",
  "#4f765f",
  "#287f88",
  "#9a6738",
  "#6f7042",
  "#486a84",
  "#7a607e",
  "#b87854",
]

const TOURS = [
  {
    title: "Cultural Triangle Trail",

    days: "7 Days",

    price: "$1,240",

    type: "Cultural",

    img: DESTINATIONS[0].img,

    highlights: ["Sigiriya", "Polonnaruwa", "Anuradhapura"],

    description: "Ancient capitals, cave temples, and Sigiriya's rock gardens across Sri Lanka's UNESCO-rich heartland.",

    bestFor: "History & architecture",

    rating: "4.9",

    reviews: 214,
  },

  {
    title: "Southern Coast Escape",

    days: "5 Days",

    price: "$890",

    type: "Beach",

    img: DESTINATIONS[2].img,

    highlights: ["Mirissa", "Galle", "Unawatuna"],

    description: "Whale-watching waters, Galle Fort, and palm-fringed beaches along the island's relaxed southern coast.",

    bestFor: "Ocean & heritage",

    rating: "4.8",

    reviews: 318,
  },

  {
    title: "Hill Country Immersion",

    days: "5 Days",

    price: "$980",

    type: "Adventure",

    img: DESTINATIONS[1].img,

    highlights: ["Nuwara Eliya", "Ella", "Adam's Peak"],

    description: "Tea estates, waterfalls, cool mountain towns, and the celebrated rail journey through the central highlands.",

    bestFor: "Scenery & slow travel",

    rating: "4.9",

    reviews: 176,
  },

  {
    title: "Wildlife & Wilderness",

    days: "6 Days",

    price: "$1,480",

    type: "Wildlife",

    img: DESTINATIONS[4].img,

    highlights: ["Yala", "Udawalawe", "Minneriya"],

    description: "Dawn safaris through leopard and elephant country, paired with quiet wilderness lodges and open landscapes.",

    bestFor: "Safaris & nature",

    rating: "5.0",

    reviews: 142,
  },

  {
    title: "Northern Heritage Passage",
    days: "7 Days",
    price: "$1,190",
    type: "Culture",
    img: DESTINATIONS[14].img,
    highlights: ["Anuradhapura", "Jaffna", "Trincomalee"],
    description: "Sacred ruins, Jaffna's distinctive Tamil culture, island temples, and the clear-water northeastern coast.",
    bestFor: "Living culture",
    rating: "4.8",
    reviews: 96,
  },

  {
    title: "East Coast Sunrise Trail",
    days: "6 Days",
    price: "$1,060",
    type: "Coastal",
    img: DESTINATIONS[13].img,
    highlights: ["Trincomalee", "Pasikudah", "Arugam Bay"],
    description: "Harbour history, calm beaches, colourful places of worship, and sunrise coastlines along Sri Lanka's east.",
    bestFor: "Sunrise & sea",
    rating: "4.9",
    reviews: 121,
  },

  {
    title: "Surf & River Adventure",
    days: "8 Days",
    price: "$1,340",
    type: "Active",
    img: DESTINATIONS[12].img,
    highlights: ["Arugam Bay", "Kithulgala", "Weligama"],
    description: "Surf breaks, rainforest rapids, and laid-back beach towns shaped for travellers who prefer to keep moving.",
    bestFor: "Surf & white water",
    rating: "4.8",
    reviews: 88,
  },

  {
    title: "Ayurveda & Coastal Calm",
    days: "5 Days",
    price: "$1,120",
    type: "Wellness",
    img: DESTINATIONS[10].img,
    highlights: ["Bentota", "Hikkaduwa", "Galle"],
    description: "Ayurvedic rituals, spa time, lagoon calm, and an unhurried southern-coast reset rooted in island wellness.",
    bestFor: "Rest & renewal",
    rating: "4.9",
    reviews: 109,
  },

  {
    title: "Grand Island Discovery",
    days: "10 Days",
    price: "$1,890",
    type: "Signature",
    img: DESTINATIONS[24].img,
    highlights: ["Colombo", "Sigiriya", "Kandy & Ella"],
    description: "A first-time visitor's sweep from Colombo to ancient kingdoms, sacred Kandy, and the tea-covered highlands.",
    bestFor: "First-time visitors",
    rating: "5.0",
    reviews: 204,
  },
]

const REVIEWS = [
  {
    name: "Yuki Tanaka",

    flag: "🇯🇵",

    origin: "Tokyo, Japan",

    text: "Sri Lanka exceeded every expectation. The train ride from Kandy to Ella was the most beautiful journey of my life — misty mountains, tea terraces, and waterfalls cascading from every cliff.",

    rating: 5,

    destination: "Ella & Hill Country",

    trip: "7-day highland escape",

    date: "April 2026",

    cover: DESTINATIONS[1].img,

    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&auto=format",
  },

  {
    name: "Marcus Weber",

    flag: "🇩🇪",

    origin: "Berlin, Germany",

    text: "Sigiriya at dawn is something that should be on every traveler's list. The sunrise over the ancient rock fortress, with the jungle stretching endlessly below — utterly transcendent.",

    rating: 5,

    destination: "Cultural Triangle",

    trip: "Ancient cities journey",

    date: "February 2026",

    cover: DESTINATIONS[0].img,

    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&auto=format",
  },

  {
    name: "Priya Mehta",

    flag: "🇮🇳",

    origin: "Mumbai, India",

    text: "The warmth of Sri Lankan people is unmatched. Every village we stopped in, someone offered tea and a smile. The food, the culture, the wildlife — a lifetime of memories in one small island.",

    rating: 5,

    destination: "Southern Coast",

    trip: "Coast & culture journey",

    date: "January 2026",

    cover: DESTINATIONS[5].img,

    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&auto=format",
  },
]

const STATS = [
  { value: "9", label: "Provinces" },

  { value: "25", label: "Districts" },

  { value: "8", label: "UNESCO Sites" },

  { value: "1,340+", label: "Attractions" },
]

// ─── Translations ─────────────────────────────────────────────────────────────

const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    hero_headline_1: "Beyond the horizon,",

    hero_headline_2: "lies the pearl of the",

    hero_headline_3: "Indian Ocean.",

    hero_desc:
      "Sri Lanka — an island where ancient kingdoms rise from jungle mist, cerulean waves meet golden sands, and every sunrise carries a thousand years of story.",

    cta: "Begin Journey",

    destinations_heading: "Legendary Destinations",

    destinations_sub: "From sacred summits to turquoise shores",

    tours_heading: "Curated Journeys",

    tours_sub: "Expertly crafted routes through paradise",

    activities_heading: "Extraordinary Experiences",

    reviews_heading: "Words from Wanderers",

    reviews_eyebrow: "Traveller stories",

    reviews_intro: "Real journeys, remembered in their own words.",

    reviews_verified: "Verified journey",

    newsletter_heading: "Travel dispatches from paradise",

    newsletter_sub: "Stories, guides, and hidden places — straight to you.",

    newsletter_placeholder: "Your email address",

    newsletter_btn: "Subscribe",

    search_placeholder: "Search destinations, hotels, experiences...",
  },

  ja: {
    hero_headline_1: "地平線の彼方に、",

    hero_headline_2: "インド洋の真珠が",

    hero_headline_3: "眠っている。",

    hero_desc:
      "スリランカ — ジャングルの霧から古代王国が浮かび上がる島。エメラルドの波が黄金の砂浜に出会い、すべての夜明けに千年の物語が宿る。",

    cta: "旅を始める",

    destinations_heading: "伝説の目的地",

    destinations_sub: "聖なる山頂からターコイズの岸辺まで",

    tours_heading: "厳選された旅",

    tours_sub: "楽園を巡る専門家が手がけたルート",

    activities_heading: "非凡な体験",

    reviews_heading: "旅人たちの声",

    reviews_eyebrow: "旅人のストーリー",

    reviews_intro: "心に残った本物の旅を、旅人自身の言葉で。",

    reviews_verified: "認証済みの旅",

    newsletter_heading: "楽園からの旅の便り",

    newsletter_sub: "物語、ガイド、隠れた場所をお届けします。",

    newsletter_placeholder: "メールアドレス",

    newsletter_btn: "登録する",

    search_placeholder: "目的地、ホテル、体験を検索...",
  },

  ko: {
    hero_headline_1: "지평선 너머에는",

    hero_headline_2: "인도양의 진주가",

    hero_headline_3: "기다린다.",

    hero_desc:
      "스리랑카 — 정글 안개 속에서 고대 왕국이 솟아오르는 섬. 청록빛 파도가 황금빛 모래사장을 만나고, 매 일출마다 천 년의 이야기가 깃들어 있다.",

    cta: "여정 시작하기",

    destinations_heading: "전설적인 여행지",

    destinations_sub: "신성한 정상에서 터키석 해안까지",

    tours_heading: "엄선된 여정",

    tours_sub: "전문가가 설계한 낙원 여행 루트",

    activities_heading: "특별한 경험",

    reviews_heading: "여행자들의 이야기",

    reviews_eyebrow: "여행자 이야기",

    reviews_intro: "오래도록 기억될 진짜 여정을 여행자의 목소리로 만나보세요.",

    reviews_verified: "인증된 여정",

    newsletter_heading: "낙원에서 보내는 여행 소식",

    newsletter_sub: "이야기, 가이드, 숨겨진 장소를 바로 전달합니다.",

    newsletter_placeholder: "이메일 주소",

    newsletter_btn: "구독하기",

    search_placeholder: "여행지, 호텔, 경험 검색...",
  },

  ru: {
    hero_headline_1: "За горизонтом",

    hero_headline_2: "скрывается жемчужина",

    hero_headline_3: "Индийского океана.",

    hero_desc:
      "Шри-Ланка — остров, где древние царства поднимаются из джунглевого тумана, лазурные волны встречают золотые пески, и каждый рассвет несёт в себе тысячу лет истории.",

    cta: "Начать путешествие",

    destinations_heading: "Легендарные места",

    destinations_sub: "От священных вершин до бирюзовых берегов",

    tours_heading: "Кураторские путешествия",

    tours_sub: "Мастерски составленные маршруты через рай",

    activities_heading: "Незабываемые впечатления",

    reviews_heading: "Слова путешественников",

    reviews_eyebrow: "Истории гостей",

    reviews_intro: "Настоящие путешествия, рассказанные своими словами.",

    reviews_verified: "Проверенное путешествие",

    newsletter_heading: "Путевые заметки из рая",

    newsletter_sub: "Истории, гиды и скрытые места — прямо вам.",

    newsletter_placeholder: "Ваш email",

    newsletter_btn: "Подписаться",

    search_placeholder: "Поиск направлений, отелей, впечатлений...",
  },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function t(lang: string, key: string): string {
  return TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS["en"][key] ?? key
}

function LetterReveal({ text }: { text: string }) {
  return (
    <span className="editorial-letters" aria-label={text}>
      {Array.from(text).map((character, index) => (
        <span
          key={`${character}-${index}`}
          aria-hidden="true"
          className={character === " " ? "editorial-space" : "editorial-letter"}
          style={{ "--letter-index": index } as CSSProperties}
        >
          {character === " " ? "\u00a0" : character}
        </span>
      ))}
    </span>
  )
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="text-amber-400 text-sm">
      {"★".repeat(rating)}
      {"☆".repeat(5 - rating)}
    </span>
  )
}

function TourCard({ tour, interactive = true }: { tour: typeof TOURS[0]; interactive?: boolean }) {
  return (
    <article
      className="tour-flip-card"
      tabIndex={interactive ? 0 : -1}
      aria-label={`${tour.title}. Flip card for journey details.`}
    >
      <div className="tour-flip-content">
        <div className="tour-flip-face tour-flip-front">
          <img src={tour.img} alt={tour.title} loading="lazy" />
          <div className="tour-flip-image-shade" aria-hidden="true" />
          <div className="tour-flip-topline">
            <span className="tour-flip-badge">{tour.type}</span>
            <span>{tour.days}</span>
          </div>
          <div className="tour-flip-description">
            <p>Best for · {tour.bestFor}</p>
            <div className="tour-flip-title-row">
              <h3>{tour.title}</h3>
              <span aria-hidden="true">↗</span>
            </div>
            <div className="tour-flip-footer">
              <span>★ {tour.rating} · {tour.reviews} reviews</span>
              <strong>From {tour.price}</strong>
            </div>
          </div>
        </div>

        <div className="tour-flip-face tour-flip-back">
          <div className="tour-flip-back-content">
            <div className="tour-flip-compass" aria-hidden="true">✦</div>
            <div>
              <p>{tour.type} · {tour.days}</p>
              <h3>{tour.title}</h3>
              <p className="tour-flip-summary">{tour.description}</p>
            </div>
            <div className="tour-flip-route" aria-label="Journey highlights">
              {tour.highlights.map((highlight, index) => (
                <span key={highlight}>
                  <b>{String(index + 1).padStart(2, "0")}</b>
                  {highlight}
                </span>
              ))}
            </div>
            <div className="tour-flip-back-footer">
              <span><strong>{tour.price}</strong> / person</span>
              <span>Explore journey →</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

function TransportShowcase({ onPlan }: { onPlan: () => void }) {
  return (
    <section className="transport-showcase experience-reveal" aria-labelledby="transport-showcase-title">
      <div
        className="transport-showcase-canvas"
        onPointerMove={(event) => {
          const scene = event.currentTarget
          const bounds = scene.getBoundingClientRect()
          const x = (event.clientX - bounds.left) / bounds.width
          const y = (event.clientY - bounds.top) / bounds.height
          const currentFrame = Number(scene.dataset.pointerFrame || 0)
          if (currentFrame) window.cancelAnimationFrame(currentFrame)
          const frame = window.requestAnimationFrame(() => {
            scene.style.setProperty("--scene-rx", `${(0.5 - y) * 4.5}deg`)
            scene.style.setProperty("--scene-ry", `${(x - 0.5) * 6}deg`)
            scene.style.setProperty("--pointer-x", `${x * 100}%`)
            scene.style.setProperty("--pointer-y", `${y * 100}%`)
          })
          scene.dataset.pointerFrame = String(frame)
        }}
        onPointerLeave={(event) => {
          const scene = event.currentTarget
          scene.style.setProperty("--scene-rx", "0deg")
          scene.style.setProperty("--scene-ry", "0deg")
          scene.style.setProperty("--pointer-x", "66%")
          scene.style.setProperty("--pointer-y", "35%")
        }}
      >
        <div className="transport-showcase-sky" aria-hidden="true">
          <span className="transport-showcase-sun" />
          <span className="transport-showcase-cloud transport-showcase-cloud-one" />
          <span className="transport-showcase-cloud transport-showcase-cloud-two" />
        </div>
        <div className="transport-showcase-mountains" aria-hidden="true"><i /><i /><i /></div>
        <div className="transport-showcase-palms" aria-hidden="true"><i /><i /><i /><i /></div>
        <div className="transport-showcase-road" aria-hidden="true">
          <div className="transport-road-lines"><i /><i /><i /><i /><i /></div>
        </div>

        <div className="transport-showcase-copy">
          <p className="transport-showcase-eyebrow"><i aria-hidden="true" /> Private island transfer</p>
          <h2 id="transport-showcase-title">Ride the island.<br /><em>Keep the freedom.</em></h2>
          <p className="transport-showcase-description">
            Your air-conditioned Suzuki Every, a trusted local driver, and a route that changes whenever curiosity calls.
          </p>
          <div className="transport-showcase-route" aria-label="Example route from Colombo to Ella">
            <span><b>01</b> Colombo</span><i><strong /></i><span><b>02</b> Ella</span>
          </div>
          <button type="button" className="transport-showcase-cta" onClick={onPlan}>
            Plan your ride <span aria-hidden="true">↗</span>
          </button>
        </div>

        <div className="transport-vehicle-stage" aria-label="Animated white Suzuki Every van">
          <div className="transport-vehicle-shadow" aria-hidden="true" />
          <div className="transport-vehicle-bob">
            <div className="transport-vehicle-asset">
              <img src="/suzuki-every-3d-cutout.png" alt="White Suzuki Every compact van" loading="lazy" />
              <span className="transport-vehicle-wheel transport-vehicle-wheel-front" aria-hidden="true"><i /></span>
              <span className="transport-vehicle-wheel transport-vehicle-wheel-rear" aria-hidden="true"><i /></span>
            </div>
          </div>
          <span className="transport-vehicle-speed transport-vehicle-speed-one" aria-hidden="true" />
          <span className="transport-vehicle-speed transport-vehicle-speed-two" aria-hidden="true" />
          <span className="transport-vehicle-speed transport-vehicle-speed-three" aria-hidden="true" />
        </div>

        <div className="transport-showcase-specs" aria-label="Vehicle features">
          <span><i>04</i><b>Travellers</b></span>
          <span><i>AC</i><b>Climate</b></span>
          <span><i>24/7</i><b>Pickup</b></span>
        </div>
        <div className="transport-showcase-status"><i aria-hidden="true" /> Suzuki Every · Ready now</div>
        <div className="transport-showcase-glare" aria-hidden="true" />
      </div>
    </section>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function App() {
  const [navScrolled, setNavScrolled] = useState(false)

  const [langOpen, setLangOpen] = useState(false)

  const [lang, setLang] = useState("en")

  const [email, setEmail] = useState("")

  const [subscribed, setSubscribed] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  type Page = "home" | "destinations" | "tours" | "experiences" | "reach-us"
  const getPageFromPath = (): Page => {
    const route = window.location.pathname.replace(/^\//, "") as Page
    return ["destinations", "tours", "experiences", "reach-us"].includes(route) ? route : "home"
  }
  const [page, setPage] = useState<Page>(getPageFromPath)
  const [experienceSlide, setExperienceSlide] = useState(0)
  const [experiencePaused, setExperiencePaused] = useState(false)
  const [experienceInView, setExperienceInView] = useState(false)
  const [destinationFocus, setDestinationFocus] = useState(0)
  const [toursInView, setToursInView] = useState(false)
  const [toursPaused, setToursPaused] = useState(false)
  const experienceDragStart = useRef<number | null>(null)
  const experiencesRef = useRef<HTMLElement | null>(null)
  const toursTrackRef = useRef<HTMLDivElement | null>(null)
  const toursSectionRef = useRef<HTMLElement | null>(null)

  // ── Video fade loop ──

  // ── Scroll detection ──

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40)

    window.addEventListener("scroll", onScroll, { passive: true })

    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const onPopState = () => {
      setPage(getPageFromPath())
      window.scrollTo({ top: 0 })
    }

    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [])

  useEffect(() => {
    const reveals = document.querySelectorAll<HTMLElement>(".experience-reveal")
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.28 },
    )

    reveals.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const section = experiencesRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => setExperienceInView(entry.isIntersecting),
      { threshold: 0.35 },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!experienceInView || experiencePaused || reducedMotion || experienceSlide === 2) return

    const timer = window.setTimeout(() => {
      setExperienceSlide((current) => (current + 1) % 3)
    }, 7000)

    return () => window.clearTimeout(timer)
  }, [experienceInView, experiencePaused, experienceSlide])

  useEffect(() => {
    if (experienceSlide === 2) setDestinationFocus(0)
  }, [experienceSlide])

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (experienceSlide !== 2 || !experienceInView || experiencePaused || reducedMotion) return

    const timer = window.setTimeout(() => {
      setDestinationFocus((current) => {
        if (current === DESTINATIONS.length - 1) {
          setExperienceSlide(0)
          return 0
        }
        return current + 1
      })
    }, 1800)

    return () => window.clearTimeout(timer)
  }, [destinationFocus, experienceInView, experiencePaused, experienceSlide])

  useEffect(() => {
    const section = toursSectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => setToursInView(entry.isIntersecting),
      { threshold: 0.3 },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!toursInView || toursPaused || reducedMotion) return

    const timer = window.setInterval(() => {
      const track = toursTrackRef.current
      if (!track) return
      track.scrollBy({
        left: track.clientWidth,
        behavior: "smooth",
      })
    }, 4500)

    return () => window.clearInterval(timer)
  }, [toursInView, toursPaused])

  useLayoutEffect(() => {
    const track = toursTrackRef.current
    if (!track) return

    const slides = Array.from(track.querySelectorAll<HTMLElement>("[data-tour-slide]"))
    const firstMiddleSlide = slides[TOURS.length]
    const firstSlide = slides[0]
    if (!firstSlide || !firstMiddleSlide) return

    const loopWidth = firstMiddleSlide.offsetLeft - firstSlide.offsetLeft
    track.scrollLeft = loopWidth

    let settleTimer = 0
    const wrapLoop = () => {
      window.clearTimeout(settleTimer)
      settleTimer = window.setTimeout(() => {
        const current = track.scrollLeft
        let wrapped = current

        if (current < loopWidth * 0.5) wrapped = current + loopWidth
        if (current > loopWidth * 1.5) wrapped = current - loopWidth
        if (wrapped === current) return

        track.style.scrollBehavior = "auto"
        track.scrollLeft = wrapped
        window.requestAnimationFrame(() => track.style.removeProperty("scroll-behavior"))
      }, 140)
    }

    track.addEventListener("scroll", wrapLoop, { passive: true })
    return () => {
      window.clearTimeout(settleTimer)
      track.removeEventListener("scroll", wrapLoop)
    }
  }, [])

  const showHomeSection = (target: string) => {
    setMenuOpen(false)
    setLangOpen(false)
    const scroll = () =>
      document.getElementById(target)?.scrollIntoView({ behavior: "smooth" })

    if (page === "home") {
      scroll()
      return
    }

    window.history.pushState({}, "", "/")
    setPage("home")
    window.setTimeout(scroll, 0)
  }

  const showDestinations = () => {
    setMenuOpen(false)
    setLangOpen(false)
    if (window.location.pathname !== "/destinations") {
      window.history.pushState({}, "", "/destinations")
    }
    setPage("destinations")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const showPage = (target: Page) => {
    setMenuOpen(false)
    setLangOpen(false)
    const path = target === "home" ? "/" : `/${target}`
    if (window.location.pathname !== path) window.history.pushState({}, "", path)
    setPage(target)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div
      className="motion-prompt-shell"
      style={{
        background: "#e7e3fb",
        minHeight: "100vh",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <ScrollVanStory hidden={page === "home"} />
      {/* ── Navigation ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          pointerEvents: "none",
        }}
      >
        <div
          className="w-full px-4 sm:px-6 lg:px-10 py-3 flex items-center justify-between transition-all duration-300"
          style={{
            pointerEvents: "auto",

            background: navScrolled
              ? "rgba(8,18,15,0.96)"
              : "rgba(8,18,15,0.86)",

            backdropFilter: "blur(18px) saturate(150%)",

            borderBottom: "1px solid rgba(255,255,255,0.1)",

            boxShadow: navScrolled
              ? "0 12px 34px rgba(0,0,0,0.28)"
              : "0 8px 28px rgba(0,0,0,0.18)",
          }}
        >
          {/* Logo */}
          <button
            type="button"
            className="flex items-center gap-2.5"
            onClick={() => showHomeSection("home")}
            aria-label="Wonder Lanka home"
          >
            <span
              className="grid place-items-center w-8 h-8 rounded-lg text-[1.35rem]"
              aria-hidden="true"
              style={{
                background: "rgba(255,255,255,0.1)",
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.52)",
              }}
            >
              <img
                src="https://flagcdn.com/w40/lk.png"
                alt=""
                className="w-6 h-auto rounded-[2px] shadow-sm"
              />
            </span>
            <span
              style={{
                fontFamily: "'Instrument Serif', serif",

                fontSize: "1.875rem",

                letterSpacing: "-0.02em",

                color: "#ffffff",

                lineHeight: 1,

                fontWeight: 400,
              }}
            >
              Wonder Lanka
              <sup style={{ fontSize: "0.5em", verticalAlign: "super" }}>®</sup>
            </span>
          </button>

          {/* Desktop nav */}
          <div
            className="hidden md:flex items-center gap-1 p-1 rounded-full"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {NAV_ITEMS.map((item) => {
              const isActive = item.target === page

              return (
                <button
                  type="button"
                  key={item.label}
                  onClick={() =>
                    showPage(item.target as Page)
                  }
                  aria-current={isActive ? "page" : undefined}
                  className="text-xs px-3.5 py-2 rounded-full transition-all duration-200"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    color: isActive ? "#071a15" : "rgba(255,255,255,0.68)",
                    background: isActive ? "#b8f5d8" : "transparent",
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {item.label}
                </button>
              )
            })}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            {/* Language switcher */}
            <div className="relative hidden md:block">
              <button
                className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-full transition-colors"
                style={{
                  color: "#ffffff",
                  fontFamily: "Inter, sans-serif",
                  background: "rgba(255,255,255,0.08)",
                }}
                onClick={() => setLangOpen((v) => !v)}
                aria-expanded={langOpen}
                aria-haspopup="menu"
                aria-label="Choose language"
              >
                🌐 {LANGUAGES.find((l) => l.code === lang)?.flag}
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                  <path
                    d="M1 1l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              {langOpen && (
                <div
                  className="absolute right-0 top-full mt-2 rounded-xl overflow-hidden shadow-lg"
                  style={{
                    background: "#fff",
                    border: "1px solid rgba(0,0,0,0.08)",
                    minWidth: "140px",
                  }}
                >
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-black/5 transition-colors"
                      style={{
                        fontFamily: "Inter, sans-serif",

                        color: lang === l.code ? "#000" : "#6f6f6f",

                        fontWeight: lang === l.code ? 500 : 400,
                      }}
                      onClick={() => {
                        setLang(l.code)
                        setLangOpen(false)
                      }}
                      role="menuitem"
                    >
                      {l.flag} {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* CTA */}
            <button
              className="hidden md:block text-xs font-semibold px-5 py-2.5 rounded-full transition-transform duration-200"
              style={{
                background: "#ffffff",

                color: "#071a15",

                fontFamily: "Inter, sans-serif",

                transform: "scale(1)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.03)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
              onClick={() => showPage("destinations")}
            >
              {t(lang, "cta")}
            </button>

            {/* Mobile menu */}
            <button
              className="md:hidden p-2 rounded-xl"
              style={{ background: "rgba(255,255,255,0.1)" }}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
            >
              <div className="w-5 h-0.5 bg-white mb-1.5" />
              <div className="w-5 h-0.5 bg-white mb-1.5" />
              <div className="w-5 h-0.5 bg-white" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            id="mobile-navigation"
            className="md:hidden px-5 py-3"
            style={{
              background: "rgba(8,18,15,0.98)",
              backdropFilter: "blur(18px)",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {NAV_ITEMS.map((item) => {
              const isActive = item.target === page

              return (
                <button
                  type="button"
                  key={item.label}
                  onClick={() =>
                    showPage(item.target as Page)
                  }
                  aria-current={isActive ? "page" : undefined}
                  className="block w-full py-3 text-left text-sm border-b"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    color: isActive ? "#b8f5d8" : "rgba(255,255,255,0.7)",
                    borderColor: "rgba(255,255,255,0.08)",
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {item.label}
                </button>
              )
            })}
          </div>
        )}
      </nav>

      {page === "destinations" ? (
        <DestinationsPage
          destinations={DESTINATIONS}
          onBack={() => showPage("home")}
        />
      ) : page === "tours" ? (
        <ToursPage tours={TOURS} onNavigate={showPage} />
      ) : page === "experiences" ? (
        <ExperiencesPage destinations={DESTINATIONS} onNavigate={showPage} />
      ) : page === "reach-us" ? (
        <ReachUsPage onNavigate={showPage} />
      ) : (
        <>
      {/* ── Hero ── */}
      <section
        id="home"
        className="relative w-full overflow-hidden"
        style={{ minHeight: "100vh" }}
      >
        {/* Video background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          style={{
            position: "absolute",

            top: "50%",

            left: "50%",

            width: "max(100%, 177.78vh)",

            height: "max(100%, 56.25vw)",

            transform: "translate(-50%, -50%)",

            objectFit: "cover",

            pointerEvents: "none",

            zIndex: 0,
          }}
        >
          <source src="/assets/videos/sri-lanka-hero.mp4" type="video/mp4" />
        </video>

        {/* Gradient overlays */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(4,78,59,0.62) 0%, rgba(21,151,191,0.24) 52%, rgba(4,78,59,0.7) 100%)",

            zIndex: 1,
          }}
        />

        {/* Hero content */}
        <div
          className="relative flex flex-col items-center justify-center text-center px-6"
          style={{ paddingTop: "6rem", paddingBottom: "10rem", zIndex: 10 }}
        >
          {/* Pill badge */}
          <div
            className="animate-fade-rise inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-xs font-medium"
            style={{
              background: "rgba(255,255,255,0.15)",

              color: "#ffffff",

              fontFamily: "Inter, sans-serif",

              border: "1px solid rgba(255,255,255,0.28)",
            }}
          >
            <span>🇱🇰</span> The Pearl of the Indian Ocean
          </div>

          {/* Headline */}
          <h1
            className="animate-fade-rise max-w-5xl"
            style={{
              fontFamily: "'Instrument Serif', serif",

              fontSize: "clamp(3rem, 8vw, 6rem)",

              fontWeight: 400,

              lineHeight: 0.95,

              letterSpacing: "-2.46px",

              color: "#ffffff",

              marginBottom: 0,
            }}
          >
            {t(lang, "hero_headline_1")}{" "}
            <em style={{ color: "rgba(255,255,255,0.8)", fontStyle: "italic" }}>
              {t(lang, "hero_headline_2")}
            </em>{" "}
            <span style={{ color: "#fff" }}>{t(lang, "hero_headline_3")}</span>
          </h1>

          {/* Description */}
          <p
            className="animate-fade-rise-delay max-w-2xl mt-8 leading-relaxed"
            style={{
              fontFamily: "Inter, sans-serif",

              fontSize: "clamp(0.9rem, 1.5vw, 1.125rem)",

              color: "rgba(255,255,255,0.85)",
            }}
          >
            {t(lang, "hero_desc")}
          </p>

          {/* Stats */}
          <div className="animate-fade-rise-delay-3 mt-16 flex flex-wrap justify-center gap-12">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div
                  style={{
                    fontFamily: "'Instrument Serif', serif",

                    fontSize: "2rem",

                    fontWeight: 400,

                    color: "#fff",

                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.75rem",
                    color: "rgba(255,255,255,0.75)",
                    marginTop: "4px",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Destinations ── */}
      <section id="destinations" className="py-24 overflow-hidden scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 mb-14 animate-fade-rise">
          <p
            className="text-sm mb-3"
            style={{
              fontFamily: "Inter, sans-serif",
              color: "#6f6f6f",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Explore
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h2
              style={{
                fontFamily: "'Instrument Serif', serif",

                fontSize: "clamp(2rem, 4vw, 3.5rem)",

                fontWeight: 400,

                color: "#064e3b",

                lineHeight: 1.05,
              }}
            >
              {t(lang, "destinations_heading")}
            </h2>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                color: "#6f6f6f",
                fontSize: "1rem",
                maxWidth: "260px",
                textAlign: "right",
              }}
            >
              {t(lang, "destinations_sub")}
            </p>
          </div>
        </div>

        <div className="destinations-slider" aria-label="Featured destinations">
          <div className="destinations-slider-list">
            {[...DESTINATIONS, ...DESTINATIONS].map((dest, index) => (
              <article
                key={`${dest.name}-${index}`}
                className="destinations-slider-item"
                aria-hidden={index >= DESTINATIONS.length}
              >
                <img
                  src={dest.img}
                  alt={index < DESTINATIONS.length ? dest.name : ""}
                  loading="lazy"
                />
                <div className="destinations-slider-shade" />
                <span className="destinations-slider-tag">{dest.tag}</span>
                <div className="destinations-slider-copy">
                  <p>{dest.type}</p>
                  <h3>{dest.name}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="px-6 mt-10 flex justify-center">
          <button
            type="button"
            onClick={showDestinations}
            className="rounded-full px-7 py-3.5 text-sm font-semibold transition-transform duration-200 hover:scale-[1.03]"
            style={{
              background: "#07856f",
              color: "#fff",
              fontFamily: "Inter, sans-serif",
              boxShadow: "0 12px 24px rgba(7,133,111,0.2)",
            }}
          >
            Explore More Destinations →
          </button>
        </div>
      </section>

      {/* ── Experiences ── */}
      <section
        ref={experiencesRef}
        id="experiences"
        className={`experiences-editorial scroll-mt-20${experiencePaused ? " is-autoplay-paused" : ""}`}
        style={{
          "--experience-duration": experienceSlide === 2
            ? `${DESTINATIONS.length * 1.8}s`
            : "7s",
        } as CSSProperties}
        aria-roledescription="carousel"
        aria-label="Extraordinary experiences"
        tabIndex={0}
        onMouseEnter={() => setExperiencePaused(true)}
        onMouseLeave={() => setExperiencePaused(false)}
        onFocusCapture={() => setExperiencePaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setExperiencePaused(false)
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            setExperienceSlide((current) => (current + 1) % 3)
          }
          if (event.key === "ArrowLeft") {
            setExperienceSlide((current) => (current + 2) % 3)
          }
        }}
      >
        <div className="experience-grain" aria-hidden="true" />

        <div
          className="experience-slider-window"
          onPointerDown={(event) => {
            if ((event.target as HTMLElement).closest("button, a")) return
            setExperiencePaused(true)
            experienceDragStart.current = event.clientX
            event.currentTarget.setPointerCapture(event.pointerId)
          }}
          onPointerUp={(event) => {
            if (experienceDragStart.current === null) return
            const distance = event.clientX - experienceDragStart.current
            if (distance < -55) {
              setExperienceSlide((current) => (current + 1) % 3)
            } else if (distance > 55) {
              setExperienceSlide((current) => (current + 2) % 3)
            }
            experienceDragStart.current = null
            setExperiencePaused(false)
          }}
          onPointerCancel={() => {
            experienceDragStart.current = null
            setExperiencePaused(false)
          }}
        >
          <div
            className="experience-slider-track"
            style={{ transform: `translate3d(-${experienceSlide * 100}%, 0, 0)` }}
          >

        <div
          className="experience-cover experience-reveal"
          aria-hidden={experienceSlide !== 0}
          inert={experienceSlide !== 0}
        >
          <img
            className="experience-cover-photo"
            src="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/934f4b51-d05b-4498-9c4a-8262f044da66.jpg"
            alt="Elephant crossing golden grassland"
            draggable={false}
          />
          <div className="experience-cover-title">
            <p>{t(lang, "activities_heading")}</p>
            <h2>
              <LetterReveal text="WILD" />
              <span className="experience-cover-title-space" aria-hidden="true"> </span>
              <br className="experience-cover-mobile-break" />
              <LetterReveal text="ENCOUNTERS" />
            </h2>
          </div>
          <button
            type="button"
            className="experience-cover-pill"
            onClick={() => setExperienceSlide(1)}
          >
            Enter the story <span aria-hidden="true">→</span>
          </button>
          <div className="experience-cover-melt" aria-hidden="true" />
        </div>

        <div
          id="experience-story"
          className="experience-statement experience-reveal"
          aria-hidden={experienceSlide !== 1}
          inert={experienceSlide !== 1}
        >
          <img
            className="experience-statement-background"
            src="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1800&h=1100&fit=crop&auto=format"
            alt="Safari landscape at golden hour"
            draggable={false}
          />
          <div className="experience-statement-shade" aria-hidden="true" />

          <div className="experience-statement-panel">
            <p className="experience-editorial-label">The island, fully alive</p>
            <div className="experience-statement-copy" aria-label="The wild is not watched, it is felt">
              <div><LetterReveal text="THE WILD" /></div>
              <div>
                <span className="experience-photo-pill">
                  <img
                    src="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/a6ea3433-41c4-46b8-aac3-faefa9ad7558.jpg"
                    alt="Elephant beneath acacia trees"
                    draggable={false}
                  />
                </span>
                <LetterReveal text="IS NOT" />
              </div>
              <div>
                <LetterReveal text="WATCHED" />
                <span className="experience-photo-pill">
                  <img
                    src="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/9152c213-6763-4147-83f3-b985e6c65a00.jpg"
                    alt="Elephants at sunset"
                    draggable={false}
                  />
                </span>
              </div>
              <div><LetterReveal text="IT IS FELT" /></div>
            </div>
            <div className="experience-emblem" aria-hidden="true"><span>✦</span></div>
          </div>

          <div className="experience-statement-gallery" aria-label="Wildlife moments">
            <figure className="experience-statement-photo experience-statement-photo-main">
              <img
                src="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/9152c213-6763-4147-83f3-b985e6c65a00.jpg"
                alt="Mother elephant and calf at sunset"
                draggable={false}
              />
              <figcaption><span>01</span> Golden-hour encounters</figcaption>
            </figure>
            <figure className="experience-statement-photo experience-statement-photo-small">
                <img
                  src="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/a6ea3433-41c4-46b8-aac3-faefa9ad7558.jpg"
                  alt="Elephant in a wide savanna"
                  draggable={false}
                />
              <figcaption><span>02</span> Into the open</figcaption>
            </figure>
            <div className="experience-statement-note">
              <span>Field note</span>
              <strong>Move slowly.<br />Notice everything.</strong>
            </div>
          </div>
        </div>

        <div
          className="experience-guide experience-reveal"
          aria-hidden={experienceSlide !== 2}
          inert={experienceSlide !== 2}
        >
          <div
            className="experience-guide-background-plane"
            style={{ backgroundImage: `url(${DESTINATIONS[destinationFocus].img})` }}
            aria-hidden="true"
          />
          <div className="experience-guide-background-shade" aria-hidden="true" />

          <div className="experience-guide-heading">
            <p className="experience-editorial-label">Choose your pace</p>
            <h3>
              <LetterReveal text="FIND YOUR" /><br />
              <LetterReveal text="OWN WAY" /><br />
              <LetterReveal text="INTO THE" /><br />
              <LetterReveal text="ISLAND" />
            </h3>
            <a href="#reach-us" className="experience-play-badge" aria-label="Plan an experience">
              <span className="experience-play-ticks" aria-hidden="true" />
              <span className="experience-play-icon" aria-hidden="true">→</span>
            </a>
            <span className="experience-play-caption">Plan your journey</span>
          </div>

          <div className="experience-destination-showcase">
            <div className="experience-destination-intro">
              <p>
                One island, many moods. Select a place and let the landscape
                take over the story.
              </p>
              <span><strong>{String(DESTINATIONS.length).padStart(2, "0")}</strong> curated places</span>
            </div>

            <div
              className="experience-destination-stage"
              style={{
                "--destination-tone": DESTINATION_THEMES[destinationFocus % DESTINATION_THEMES.length],
              } as CSSProperties}
            >
              <div className="experience-destination-visual">
                <img
                  key={DESTINATIONS[destinationFocus].name}
                  src={DESTINATIONS[destinationFocus].img}
                  alt={DESTINATIONS[destinationFocus].name}
                  draggable={false}
                />
                <div className="experience-destination-visual-shade" aria-hidden="true" />
                <span className="experience-destination-number">
                  {String(destinationFocus + 1).padStart(2, "0")}
                </span>
                <div className="experience-destination-feature-copy">
                  <p>{DESTINATIONS[destinationFocus].tag}</p>
                  <h4>{DESTINATIONS[destinationFocus].name}</h4>
                  <span>{DESTINATIONS[destinationFocus].type}</span>
                </div>
              </div>

              <div className="experience-destination-selector" role="tablist" aria-label="Choose a destination">
                {Array.from({ length: 6 }, (_, offset) => {
                  const index = (destinationFocus + offset) % DESTINATIONS.length
                  const destination = DESTINATIONS[index]
                  return (
                    <button
                      type="button"
                      role="tab"
                      aria-selected={offset === 0}
                      className={offset === 0 ? "is-active" : ""}
                      key={`${destination.name}-${index}`}
                      onClick={() => setDestinationFocus(index)}
                    >
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <strong>{destination.name}</strong>
                      <i aria-hidden="true">↗</i>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
          </div>
        </div>

        <div className="experience-slider-nav" aria-label="Experience slides">
          <button
            type="button"
            className="experience-slider-arrow"
            onClick={() => setExperienceSlide((current) => (current + 2) % 3)}
            aria-label="Previous experience slide"
          >
            ←
          </button>
          <div className="experience-slider-dots">
            {["Wild encounters", "The island alive", "Choose your pace"].map((label, index) => (
              <button
                type="button"
                key={label}
                className={experienceSlide === index ? "is-active" : ""}
                onClick={() => setExperienceSlide(index)}
                aria-label={`Show ${label}`}
                aria-current={experienceSlide === index ? "true" : undefined}
              />
            ))}
          </div>
          <span className="experience-slider-count" aria-live="polite">
            0{experienceSlide + 1} / 03
          </span>
          <button
            type="button"
            className="experience-slider-arrow"
            onClick={() => setExperienceSlide((current) => (current + 1) % 3)}
            aria-label="Next experience slide"
          >
            →
          </button>
        </div>
      </section>

      {/* ── Tours ── */}
      <section
        ref={toursSectionRef}
        id="tours"
        className="py-24 w-full overflow-hidden scroll-mt-20"
        onMouseEnter={() => setToursPaused(true)}
        onMouseLeave={() => setToursPaused(false)}
        onFocusCapture={() => setToursPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setToursPaused(false)
          }
        }}
      >
        <div className="mb-14 max-w-7xl mx-auto px-6">
          <p
            className="text-sm mb-3"
            style={{
              fontFamily: "Inter, sans-serif",
              color: "#6f6f6f",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Packages
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h2
              style={{
                fontFamily: "'Instrument Serif', serif",

                fontSize: "clamp(2rem, 4vw, 3.5rem)",

                fontWeight: 400,

                color: "#064e3b",

                lineHeight: 1.05,
              }}
            >
              {t(lang, "tours_heading")}
            </h2>
            <div className="tour-carousel-heading-actions">
              <p>{t(lang, "tours_sub")}</p>
              <div className="tour-carousel-controls" aria-label="Journey slider controls">
                <button
                  type="button"
                  aria-label="Previous journeys"
                  onClick={() => toursTrackRef.current?.scrollBy({
                    left: -toursTrackRef.current.clientWidth,
                    behavior: "smooth",
                  })}
                >
                  ←
                </button>
                <span>Swipe to explore</span>
                <button
                  type="button"
                  aria-label="Next journeys"
                  onClick={() => toursTrackRef.current?.scrollBy({
                    left: toursTrackRef.current.clientWidth,
                    behavior: "smooth",
                  })}
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          ref={toursTrackRef}
          className="tour-carousel-track"
          aria-label="Curated journey packages"
          onPointerDown={() => setToursPaused(true)}
          onPointerUp={() => setToursPaused(false)}
          onPointerCancel={() => setToursPaused(false)}
        >
          {[0, 1, 2].flatMap((loop) => TOURS.map((tour) => (
            <div
              className="tour-carousel-slide"
              data-tour-slide
              aria-hidden={loop === 1 ? undefined : true}
              key={`${loop}-${tour.title}`}
            >
              <TourCard tour={tour} interactive={loop === 1} />
            </div>
          )))}
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="wanderer-stories" aria-labelledby="wanderer-stories-title">
        <div className="wanderer-stories-orb wanderer-stories-orb-one" />
        <div className="wanderer-stories-orb wanderer-stories-orb-two" />

        <div className="wanderer-stories-inner">
          <header className="wanderer-stories-header">
            <div>
              <p className="wanderer-stories-eyebrow">
                <span aria-hidden="true">✦</span>
                {t(lang, "reviews_eyebrow")}
              </p>
              <h2 id="wanderer-stories-title">{t(lang, "reviews_heading")}</h2>
            </div>
            <div className="wanderer-stories-intro">
              <p>{t(lang, "reviews_intro")}</p>
              <div aria-label="Five out of five average rating">
                <strong>4.9</strong>
                <span><StarRating rating={5} /> 1,240+ stories</span>
              </div>
            </div>
          </header>

          <div className="wanderer-stories-grid">
            <article className="wanderer-feature-card">
              <img src={REVIEWS[0].cover} alt="Tea-covered hills around Ella" loading="lazy" />
              <div className="wanderer-feature-shade" />
              <div className="wanderer-feature-topline">
                <span>{REVIEWS[0].destination}</span>
                <span className="wanderer-verified">
                  <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7.7 13.2-3-3 1.4-1.4 1.6 1.6 5-5 1.4 1.4-6.4 6.4Z" /></svg>
                  {t(lang, "reviews_verified")}
                </span>
              </div>
              <div className="wanderer-feature-copy">
                <span className="wanderer-quote-mark" aria-hidden="true">“</span>
                <blockquote>{REVIEWS[0].text}</blockquote>
                <footer>
                  <div className="wanderer-person">
                    <img src={REVIEWS[0].img} alt="" loading="lazy" />
                    <div>
                      <strong>{REVIEWS[0].name} <span>{REVIEWS[0].flag}</span></strong>
                      <small>{REVIEWS[0].origin}</small>
                    </div>
                  </div>
                  <div className="wanderer-trip-meta">
                    <span>{REVIEWS[0].trip}</span>
                    <small>{REVIEWS[0].date}</small>
                  </div>
                </footer>
              </div>
            </article>

            <div className="wanderer-side-stories">
              {REVIEWS.slice(1).map((review, index) => (
                <article className="wanderer-story-card" key={review.name}>
                  <div className="wanderer-story-number">0{index + 2}</div>
                  <div className="wanderer-story-rating">
                    <StarRating rating={review.rating} />
                    <span>{t(lang, "reviews_verified")}</span>
                  </div>
                  <blockquote>“{review.text}”</blockquote>
                  <footer>
                    <div className="wanderer-person">
                      <img src={review.img} alt="" loading="lazy" />
                      <div>
                        <strong>{review.name} <span>{review.flag}</span></strong>
                        <small>{review.origin}</small>
                      </div>
                    </div>
                    <div className="wanderer-place-pill">
                      <span>{review.destination}</span>
                      <small>{review.date}</small>
                    </div>
                  </footer>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Private island transport ── */}
      <TransportShowcase onPlan={() => showHomeSection("reach-us")} />

      {/* ── Newsletter ── */}
      <section
        className="py-24 px-6"
        style={{
          background: "linear-gradient(135deg, #e8faed 0%, #c9f1d6 100%)",
        }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="mb-4"
            style={{
              fontFamily: "'Instrument Serif', serif",

              fontSize: "clamp(2rem, 4vw, 3rem)",

              fontWeight: 400,

              color: "#064e3b",

              lineHeight: 1.1,
            }}
          >
            {t(lang, "newsletter_heading")}
          </h2>
          <p
            className="mb-10"
            style={{
              fontFamily: "Inter, sans-serif",
              color: "rgba(6,78,59,0.72)",
              fontSize: "1rem",
            }}
          >
            {t(lang, "newsletter_sub")}
          </p>
          <form
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            onSubmit={(e) => {
              e.preventDefault()
              setSubscribed(true)
              setEmail("")
            }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t(lang, "newsletter_placeholder")}
              aria-label={t(lang, "newsletter_placeholder")}
              required
              className="flex-1 px-5 py-3 rounded-full text-sm outline-none"
              style={{
                background: "rgba(255,255,255,0.78)",

                border: "1px solid rgba(6,78,59,0.16)",

                color: "#064e3b",

                fontFamily: "Inter, sans-serif",
              }}
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-full text-sm font-medium transition-transform duration-200"
              style={{
                background: "#07856f",
                color: "#fff",
                fontFamily: "Inter, sans-serif",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.03)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              {t(lang, "newsletter_btn")}
            </button>
          </form>
          {subscribed && (
            <p
              className="mt-4 text-sm"
              style={{ color: "#064e3b" }}
              role="status"
            >
              Thank you! Your travel updates are ready to go.
            </p>
          )}
        </div>
      </section>

        </>
      )}

      {/* ── Footer ── */}
      <footer id="reach-us" className="site-footer">
        <div className="site-footer-glow" />
        <div className="site-footer-inner">
          <div className="site-footer-topline">
            <span className="site-footer-kicker">
              <i aria-hidden="true" /> Plan less. Feel more.
            </span>
            <button
              type="button"
              className="site-footer-top-button"
              onClick={() => showHomeSection("home")}
              aria-label="Back to the top"
            >
              Back to top <span aria-hidden="true">↑</span>
            </button>
          </div>

          <div className="site-footer-main">
            <div className="site-footer-brand">
              <button
                type="button"
                className="site-footer-wordmark"
                onClick={() => showHomeSection("home")}
                aria-label="Wonder Lanka home"
              >
                Wonder<br />Lanka<sup>®</sup>
              </button>
              <p>
                Thoughtful journeys through an island of ancient stories,
                wild landscapes, and generous welcomes.
              </p>
              <div className="site-footer-signal">
                <span aria-hidden="true" />
                <div>
                  <strong>Sri Lanka time · GMT+5:30</strong>
                  <small>Colombo, Sri Lanka</small>
                </div>
              </div>
            </div>

            <nav className="site-footer-nav" aria-label="Footer navigation">
              {[
                {
                  heading: "Discover",
                  links: [
                    { label: "Destinations", target: "destinations" },
                    { label: "Curated journeys", target: "tours" },
                    { label: "Experiences", target: "experiences" },
                  ],
                },
                {
                  heading: "Travel well",
                  links: [
                    { label: "Visa guide" },
                    { label: "Getting around" },
                    { label: "When to visit" },
                  ],
                },
                {
                  heading: "Wonder Lanka",
                  links: [
                    { label: "Our story" },
                    { label: "Travel journal" },
                    { label: "Reach us", target: "reach-us" },
                  ],
                },
              ].map((column) => (
                <div className="site-footer-column" key={column.heading}>
                  <p>{column.heading}</p>
                  <ul>
                    {column.links.map((link) => (
                      <li key={link.label}>
                        {link.target ? (
                          <button
                            type="button"
                            onClick={() =>
                              showPage(link.target as Page)
                            }
                          >
                            {link.label}<span aria-hidden="true">↗</span>
                          </button>
                        ) : (
                          <span>{link.label}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>

          <div className="site-footer-bottom">
            <p>© 2026 Wonder Lanka. Made with care for curious travellers.</p>
            <div className="site-footer-legal" aria-label="Legal information">
              <span>Privacy</span>
              <span>Terms</span>
              <span>Cookies</span>
            </div>
            <div className="site-footer-languages" aria-label="Choose language">
              {LANGUAGES.map((language) => (
                <button
                  type="button"
                  key={language.code}
                  className={lang === language.code ? "is-active" : ""}
                  onClick={() => setLang(language.code)}
                  title={language.label}
                  aria-label={language.label}
                >
                  {language.code.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
