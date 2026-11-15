import { useEffect, useMemo, useRef, useState } from "react"
import { type Destination } from "./DestinationsPage"

type GalleryPageProps = {
  destinations: Destination[]
  onNavigate: (page: "home" | "destinations" | "tours" | "experiences" | "reach-us") => void
}

const FILTERS = ["All", "Coast", "Heritage", "Highlands"] as const
type GalleryFilter = (typeof FILTERS)[number]

type GalleryImage = { src: string; title: string; detail: string }
type GalleryCollection = {
  id: string
  name: string
  category: Exclude<GalleryFilter, "All">
  location: string
  eyebrow: string
  description: string
  mapQuery: string
  images: GalleryImage[]
}

const KONESWARAM_GALLERY: GalleryImage[] = [
  { src: "/assets/koneswaram-01.png", title: "Painted sanctuary", detail: "Colour, sculpture and sacred detail inside the kovil." },
  { src: "/assets/koneswaram-02.png", title: "Sacred sculpture", detail: "Temple artistry shaped by Hindu stories and devotion." },
  { src: "/assets/koneswaram-03.png", title: "Shiva above the coast", detail: "A monumental figure watching over the Swami Rock headland." },
  { src: "/assets/koneswaram-04.png", title: "A place of worship", detail: "Sacred forms within the temple grounds." },
  { src: "/assets/koneswaram-05.png", title: "Cliffside shrine", detail: "A quiet sacred space sheltered by stone and old trees." },
  { src: "/assets/koneswaram-06.png", title: "Lover's Leap", detail: "The dramatic cleft in Swami Rock opening to the Indian Ocean." },
  { src: "/assets/koneswaram-07.png", title: "Rock and deep blue", detail: "Ancient stone meeting clear water beneath the temple cliffs." },
  { src: "/assets/koneswaram-08.png", title: "Guardian of the sea", detail: "A cliff-edge figure framed by Trincomalee's blue horizon." },
  { src: "/assets/koneswaram-09.png", title: "Shiva in detail", detail: "A close view of the temple's monumental Shiva statue." },
  { src: "/assets/koneswaram-10.png", title: "Ocean shrine", detail: "A peaceful viewpoint where worship and coastline meet." },
]

const HIKKADUWA_GALLERY: GalleryImage[] = [
  { src: "/assets/hikkaduwa-01.png", title: "Turtle country", detail: "A green sea turtle gliding above Hikkaduwa's shallow coral gardens." },
  { src: "/assets/hikkaduwa-02.png", title: "Palms by the shore", detail: "Golden sand beneath Hikkaduwa's leaning palms." },
  { src: "/assets/hikkaduwa-03.png", title: "The turquoise coast", detail: "Reef-blue water meeting a palm-fringed beach." },
  { src: "/assets/hikkaduwa-04.png", title: "West-coast sunset", detail: "Soft evening colour settling over the Indian Ocean." },
  { src: "/assets/hikkaduwa-05.png", title: "Stay by the sea", detail: "A tropical pool reflecting palms and coastal sunset." },
  { src: "/assets/hikkaduwa-06.png", title: "Coastal road", detail: "The Galle Road tracing a bright, wave-washed shoreline." },
]

const WELIGAMA_GALLERY: GalleryImage[] = [
  { src: "/assets/weligama-01.jpg", title: "Weligama Bay", detail: "Fishing boats resting in the clear turquoise shallows of the broad bay." },
  { src: "/assets/weligama-02.jpg", title: "Oceanfront pause", detail: "A relaxed lawn beside the rocks and rolling Indian Ocean." },
  { src: "/assets/weligama-03.jpg", title: "Bay at sunset", detail: "Fiery evening colour sweeping across Weligama's curved shoreline." },
  { src: "/assets/weligama-04.jpg", title: "Surf in motion", detail: "A surfer carving through the white water on Weligama's beginner-friendly waves." },
  { src: "/assets/weligama-05.jpg", title: "Fishing beach", detail: "Colourful boats and a surfboard waiting beneath the shade by the sea." },
  { src: "/assets/weligama-06.jpg", title: "Sunset session", detail: "A surfer carrying her board along the golden shoreline at day's end." },
]

const KALPITIYA_GALLERY: GalleryImage[] = [
  { src: "/assets/kalpitiya-01.jpg", title: "Sandbar and lagoon", detail: "Boats gathered where a sculpted sandbar meets calm blue water." },
  { src: "/assets/kalpitiya-02.jpg", title: "Lagoon sunset", detail: "A quiet canoe on the shore beneath Kalpitiya's warm evening sky." },
  { src: "/assets/kalpitiya-03.jpg", title: "Hammock over the water", detail: "A slow island moment above the clear shallows and rustic lagoon jetty." },
  { src: "/assets/kalpitiya-04.jpg", title: "Paddle into dusk", detail: "Stand-up paddling across still water as the sun drops toward the horizon." },
  { src: "/assets/kalpitiya-05.jpg", title: "Kitesurfing at sunset", detail: "A rider lifted above the sea against a deep orange sky." },
  { src: "/assets/kalpitiya-06.jpg", title: "Wind and water", detail: "A kitesurfer cutting above the lagoon in Kalpitiya's steady coastal wind." },
  { src: "/assets/kalpitiya-07.jpg", title: "Mangrove country", detail: "An aerial view of green wetland, winding water and a quiet coastal retreat." },
  { src: "/assets/kalpitiya-08.jpg", title: "Kites across the lagoon", detail: "Colourful sails moving over the wide, shallow waters of the peninsula." },
]

const YAPAHUWA_GALLERY: GalleryImage[] = [
  { src: "/assets/yapahuwa-01.jpg", title: "The ceremonial stairway", detail: "Yapahuwa's celebrated stone staircase rising into the forested rock fortress." },
  { src: "/assets/yapahuwa-02.jpg", title: "Stone gateway", detail: "Carved pillars, guardian lions and ancient steps in warm afternoon light." },
  { src: "/assets/yapahuwa-03.jpg", title: "Lion guardian", detail: "A close view of the monumental stone lion beside the palace stairway." },
  { src: "/assets/yapahuwa-04.jpg", title: "Fortress beneath the rock", detail: "The ornate staircase framed by forest and Yapahuwa's towering rock face." },
  { src: "/assets/yapahuwa-05.jpg", title: "View from the heights", detail: "A Buddhist monk looking across the green plains beyond the ancient citadel." },
  { src: "/assets/yapahuwa-06.jpg", title: "Carved devotion", detail: "Fine stone sculpture preserved beside the historic palace steps." },
]

const NEGOMBO_GALLERY: GalleryImage[] = [
  { src: "/assets/negombo-01.jpg", title: "Coastal cathedral", detail: "Negombo's church heritage beneath festival flags and a bright blue sky." },
  { src: "/assets/negombo-02.jpg", title: "Fishing boats", detail: "Colourful lagoon boats packed with nets before the next journey." },
  { src: "/assets/negombo-03.jpg", title: "Mangrove waterways", detail: "Boats gathering where narrow channels wind through vivid green mangroves." },
  { src: "/assets/negombo-04.jpg", title: "Sails on the shore", detail: "Traditional outrigger fishing craft meeting the surf on Negombo Beach." },
  { src: "/assets/negombo-05.jpg", title: "Catamaran sunset", detail: "A traditional sailboat resting against the colour of the evening sky." },
  { src: "/assets/negombo-06.jpg", title: "Palm-lined coast", detail: "An aerial view of waves, golden sand and dense tropical palms." },
  { src: "/assets/negombo-07.jpg", title: "City by the coast", detail: "Everyday street life moving through Negombo's busy centre." },
  { src: "/assets/negombo-08.jpg", title: "Traditional sails", detail: "A beach walk beside the distinctive sails of Negombo's fishing boats." },
  { src: "/assets/negombo-09.jpg", title: "The morning catch", detail: "Fishers carrying baskets from the shore after a day on the water." },
  { src: "/assets/negombo-10.jpg", title: "Beach at sundown", detail: "Families and travellers gathering beside the Indian Ocean at sunset." },
]

const BATTICALOA_GALLERY: GalleryImage[] = [
  { src: "/assets/batticaloa-01.jpg", title: "East-coast blue", detail: "Clear turquoise water meeting the long, quiet shore of Batticaloa." },
  { src: "/assets/batticaloa-02.jpg", title: "Lagoon passage", detail: "A speedboat tracing the narrow waterway between sand and palms." },
  { src: "/assets/batticaloa-03.jpg", title: "Endless shoreline", detail: "A broad aerial view of beach, reef and the coconut-covered coast." },
  { src: "/assets/batticaloa-04.jpg", title: "Palms by the beach", detail: "A tropical grove and quiet stays beside the pale eastern sand." },
  { src: "/assets/batticaloa-05.jpg", title: "A remarkable catch", detail: "A local fisher carrying a large billfish beside the sea." },
  { src: "/assets/batticaloa-06.jpg", title: "Old lighthouse", detail: "Batticaloa's weathered lighthouse rising above its garden walls." },
  { src: "/assets/batticaloa-07.jpg", title: "Town clock tower", detail: "A white landmark standing over the colourful streets of Batticaloa." },
  { src: "/assets/batticaloa-08.jpg", title: "Temple detail", detail: "A richly sculpted Hindu tower filled with colour and sacred figures." },
]

const NALLUR_GALLERY: GalleryImage[] = [
  { src: "/assets/nallur-kandaswamy-kovil-01.jpg", title: "Temple lights", detail: "The Nallur entrance glowing beneath its intricately carved tower." },
  { src: "/assets/nallur-kandaswamy-kovil-02.jpg", title: "Festival evening", detail: "Devotees gathering beneath the gopuram and a vivid northern sunset." },
  { src: "/assets/nallur-kandaswamy-kovil-03.jpg", title: "Golden gopuram", detail: "The monumental temple gateway shining above the streets of Jaffna." },
  { src: "/assets/nallur-kandaswamy-kovil-04.jpg", title: "Sacred sculpture", detail: "A close look at the detailed deities and musicians carved into the tower." },
  { src: "/assets/nallur-kandaswamy-kovil-05.jpg", title: "Nallur courtyard", detail: "The colourful temple entrance framed by trees and open northern light." },
]

const IDALGASHINNA_GALLERY: GalleryImage[] = [
  { src: "/assets/idalgashinna-01.jpg", title: "Idalgashinna station", detail: "The hill-country station sign framed by roses, mist and railway greenery." },
  { src: "/assets/idalgashinna-02.jpg", title: "Platform in the mist", detail: "Low cloud drifting through the pines beside one of Sri Lanka's most scenic stations." },
  { src: "/assets/idalgashinna-03.jpg", title: "Rails through the hills", detail: "The railway line curving through emerald slopes and tall mountain forest." },
  { src: "/assets/idalgashinna-04.jpg", title: "Tea-country patterns", detail: "Tea pickers moving between the bright, carefully shaped rows of the highlands." },
  { src: "/assets/idalgashinna-05.jpg", title: "Train above the valley", detail: "A hill-country train tracing the narrow ridge through cloud-wrapped forest." },
  { src: "/assets/idalgashinna-06.jpg", title: "Forest railway", detail: "A passenger train winding beneath the tall trees of the Uva highlands." },
]

const KALUPAHANA_GALLERY: GalleryImage[] = [
  { src: "/assets/kalupahana-01.jpg", title: "Road into Kalupahana", detail: "A quiet mountain road passing village homes beneath dense tropical trees." },
  { src: "/assets/kalupahana-02.jpg", title: "Pines in the cloud", detail: "A lone tuk-tuk travelling through a misty corridor of soaring hill-country pines." },
  { src: "/assets/kalupahana-03.jpg", title: "Mountain waters", detail: "Clear water rushing over rock beneath the green slopes around Kalupahana." },
  { src: "/assets/kalupahana-04.jpg", title: "Cottage in the hills", detail: "A small hillside retreat tucked into forest beneath the distant mountain ridges." },
  { src: "/assets/kalupahana-05.jpg", title: "Hidden waterfall", detail: "A cool forest cascade dropping into a natural rock pool." },
]

const UDUDUMBARA_GALLERY: GalleryImage[] = [
  { src: "/assets/ududumbara-01.jpg", title: "Mountain refuge", detail: "A simple shelter beneath the rugged, sunlit ridges of the Knuckles country." },
  { src: "/assets/ududumbara-02.jpg", title: "View from the trail", detail: "A hiker looking across the deep green valleys and layered eastern highlands." },
  { src: "/assets/ududumbara-03.jpg", title: "Forest cascade", detail: "A secluded waterfall flowing through the cool, boulder-filled forest." },
]

const SEMBUWATTA_LAKE_GALLERY: GalleryImage[] = [
  { src: "/assets/sembuwatta-lake-01.jpg", title: "Lake beneath the pines", detail: "Still water and forested hills disappearing into cool Matale mist." },
  { src: "/assets/sembuwatta-lake-02.jpg", title: "Pine canopy", detail: "Tall trunks reaching into the cloud above the green lakeside forest." },
  { src: "/assets/sembuwatta-lake-03.jpg", title: "Highland garden", detail: "Flowering terraces and mist-softened trees beside the lake." },
  { src: "/assets/sembuwatta-lake-04.jpg", title: "Bridge to the water", detail: "A wooden footbridge opening onto the calm blue-green lake." },
  { src: "/assets/sembuwatta-lake-05.jpg", title: "Forest in the fog", detail: "Mossy boulders and pine trees creating a quiet, otherworldly landscape." },
  { src: "/assets/sembuwatta-lake-06.jpg", title: "Flowers by the shore", detail: "Bright lakeside blooms beneath a veil of drifting mountain cloud." },
  { src: "/assets/sembuwatta-lake-07.jpg", title: "Lakeside retreat", detail: "A small pavilion sheltered by pines at the misty water's edge." },
]

const ARUGAM_BAY_GALLERY: GalleryImage[] = [
  { src: "/assets/arugam-bay-01.jpg", title: "The surf bay", detail: "An aerial view of turquoise waves peeling along Arugam Bay's sandy curve." },
  { src: "/assets/arugam-bay-02.jpg", title: "Air above the wave", detail: "A surfer launching from the bright blue water on Sri Lanka's east coast." },
  { src: "/assets/arugam-bay-03.jpg", title: "Lagoon meets the sea", detail: "Sand, rock and winding water shaping the wild coast around the bay." },
  { src: "/assets/arugam-bay-04.jpg", title: "Elephant Rock coast", detail: "Golden beach and sculpted headlands seen from high above the Indian Ocean." },
  { src: "/assets/arugam-bay-05.jpg", title: "East-coast evening", detail: "Palm silhouettes and warm sunset colour reflected along the shore." },
  { src: "/assets/arugam-bay-06.jpg", title: "Boards ready", detail: "A colourful row of surfboards waiting beneath the tropical shade." },
  { src: "/assets/arugam-bay-07.jpg", title: "Lagoon at sunset", detail: "Quiet water, sandbars and distant forest glowing in the final light." },
  { src: "/assets/arugam-bay-08.jpg", title: "Surf-day ritual", detail: "A surfer carrying her board across the bright sand beneath an open blue sky." },
]

const GALLE_FORT_GALLERY: GalleryImage[] = [
  { src: "/assets/galle-fort-01.jpg", title: "Lighthouse at golden hour", detail: "Galle's white lighthouse glowing above the palms and old ramparts." },
  { src: "/assets/galle-fort-02.jpg", title: "Fort beside the sea", detail: "An aerial panorama of the walled town reaching into turquoise water." },
  { src: "/assets/galle-fort-03.jpg", title: "Rampart landmark", detail: "The historic lighthouse and bastions seen from directly above the coast." },
  { src: "/assets/galle-fort-04.jpg", title: "Fort street at dusk", detail: "A tuk-tuk moving through the old town as shopfronts begin to glow." },
  { src: "/assets/galle-fort-05.jpg", title: "A taste of the fort", detail: "A lively seafood lane woven into Galle's walkable heritage quarter." },
  { src: "/assets/galle-fort-06.jpg", title: "Church Street", detail: "Colonial architecture lining a quiet road beneath a clear southern sky." },
  { src: "/assets/galle-fort-07.jpg", title: "Vintage colour", detail: "A classic car adding bright character to the fort's shaded verandas." },
  { src: "/assets/galle-fort-08.jpg", title: "Evening in the old town", detail: "Cafe lights and heritage facades creating a warm night-time atmosphere." },
  { src: "/assets/galle-fort-09.jpg", title: "Courtyard cafe", detail: "A relaxed table setting inside one of the fort's restored old buildings." },
  { src: "/assets/galle-fort-10.jpg", title: "Ocean beyond the walls", detail: "Blue surf breaking over the dark rocks below Galle's sea-facing ramparts." },
]

const MEEMURE_GALLERY: GalleryImage[] = [
  { src: "/assets/meemure-01.jpg", title: "Lakegala rising", detail: "Meemure's unmistakable mountain landmark above the village landscape." },
  { src: "/assets/meemure-02.jpg", title: "Mountain stream", detail: "Clear water moving through the boulders and forest of the Knuckles region." },
  { src: "/assets/meemure-03.jpg", title: "Mountain in the mist", detail: "Low cloud gathering around the green ridges above Meemure." },
  { src: "/assets/meemure-04.jpg", title: "Walking toward Lakegala", detail: "A forest trail opening toward the dramatic peak." },
  { src: "/assets/meemure-05.jpg", title: "Fields beneath the peak", detail: "Village paddy fields framed by palms and Lakegala." },
  { src: "/assets/meemure-06.jpg", title: "The green valley", detail: "A wide mountain landscape of forest, fields and brilliant blue sky." },
  { src: "/assets/meemure-07.jpg", title: "Village cultivation", detail: "Small cultivated plots woven into the foothills of the range." },
  { src: "/assets/meemure-08.jpg", title: "Terraced paddy", detail: "Curving green terraces stretching toward the mountain." },
  { src: "/assets/meemure-09.jpg", title: "Road through the highlands", detail: "A quiet ridge road crossing Meemure's remote mountain country." },
  { src: "/assets/meemure-10.jpg", title: "Forest cascade", detail: "A rocky stream and waterfall sheltered by dense green forest." },
]

const SANDAGIRI_MAHA_SEYA_GALLERY: GalleryImage[] = [
  { src: "/assets/sandagiri-maha-seya-01.jpg", title: "Steps at dusk", detail: "Warm lights trace the carved entrance wall beneath the evening sky." },
  { src: "/assets/sandagiri-maha-seya-02.jpg", title: "The white stupa", detail: "Sandagiri Maha Seya rising above its stone terrace in clear hill-country light." },
  { src: "/assets/sandagiri-maha-seya-03.jpg", title: "Meditation above the hills", detail: "A seated Buddha overlooking the green valleys around Hantana." },
  { src: "/assets/sandagiri-maha-seya-04.jpg", title: "Sacred stonework", detail: "A quiet Buddha image beside the stupa's layered stone base." },
  { src: "/assets/sandagiri-maha-seya-05.jpg", title: "Evening pilgrimage", detail: "Visitors climb the garden path as lanterns begin to glow." },
  { src: "/assets/sandagiri-maha-seya-06.jpg", title: "Golden-hour calm", detail: "A Buddha statue framed by trees, flags and the soft light of sunset." },
  { src: "/assets/sandagiri-maha-seya-07.jpg", title: "Stupa and shrine", detail: "The sweeping white dome and a small Buddha shrine in a peaceful courtyard." },
  { src: "/assets/sandagiri-maha-seya-08.jpg", title: "Sunset devotion", detail: "Warm evening colour settles over the sacred terrace and surrounding forest." },
  { src: "/assets/sandagiri-maha-seya-09.jpg", title: "Bell over Hantana", detail: "The temple bell opens toward layered mountains and distant valleys." },
  { src: "/assets/sandagiri-maha-seya-10.jpg", title: "Hilltop landmark", detail: "A full view of the stupa above the inscribed approach wall." },
]

export default function GalleryPage({ onNavigate }: GalleryPageProps) {
  const collections = useMemo<GalleryCollection[]>(() => {
    return [
      { id: "meemure", name: "Meemure", category: "Highlands", location: "Knuckles Mountain Range · Central Province", eyebrow: "Remote mountain village", description: "Lakegala, clear forest streams, terraced paddy fields and traditional village landscapes near the Kandy–Matale district border.", mapQuery: "Meemure, Sri Lanka", images: MEEMURE_GALLERY },
      { id: "sandagiri-maha-seya", name: "Sandagiri Maha Seya", category: "Heritage", location: "Hantana · Kandy", eyebrow: "Hilltop Buddhist sanctuary", description: "A serene white stupa, Buddha statues, evening pathways and wide views across Hantana's green hill country.", mapQuery: "Sandagiri Maha Seya, Hantana, Sri Lanka", images: SANDAGIRI_MAHA_SEYA_GALLERY },
      { id: "hikkaduwa", name: "Hikkaduwa", category: "Coast", location: "Galle District · Southern Province", eyebrow: "Reef, surf & sunsets", description: "Turtle encounters, coral shallows, palm-lined beaches and vivid west-coast evenings.", mapQuery: "Hikkaduwa, Sri Lanka", images: HIKKADUWA_GALLERY },
      { id: "weligama", name: "Weligama", category: "Coast", location: "Matara District · Southern Province", eyebrow: "Surf bay & fishing coast", description: "A wide turquoise bay shaped by surf culture, colourful fishing boats, relaxed oceanfront spaces and memorable sunsets.", mapQuery: "Weligama, Sri Lanka", images: WELIGAMA_GALLERY },
      { id: "kalpitiya", name: "Kalpitiya", category: "Coast", location: "Puttalam District · North Western Province", eyebrow: "Lagoon, sandbars & kites", description: "Shallow lagoons, sculpted sandbars, mangrove wetlands and steady coastal winds made for paddling and kitesurfing.", mapQuery: "Kalpitiya, Sri Lanka", images: KALPITIYA_GALLERY },
      { id: "yapahuwa", name: "Yapahuwa", category: "Heritage", location: "Kurunegala District · North Western Province", eyebrow: "Rock fortress & royal stairway", description: "A dramatic medieval citadel known for its carved stone staircase, guardian lions, sacred sculpture and far-reaching views.", mapQuery: "Yapahuwa Rock Fortress, Sri Lanka", images: YAPAHUWA_GALLERY },
      { id: "negombo", name: "Negombo", category: "Coast", location: "Gampaha District · Western Province", eyebrow: "Lagoon, faith & fishing life", description: "A lively coastal city of church spires, fishing boats, mangrove waterways, traditional sails and glowing sunsets.", mapQuery: "Negombo, Sri Lanka", images: NEGOMBO_GALLERY },
      { id: "batticaloa", name: "Batticaloa", category: "Coast", location: "Eastern Province", eyebrow: "Lagoon city & eastern shore", description: "Long palm-lined beaches, turquoise lagoons, fishing traditions and distinctive landmarks along Sri Lanka's east coast.", mapQuery: "Batticaloa, Sri Lanka", images: BATTICALOA_GALLERY },
      { id: "nallur-kandaswamy-kovil", name: "Nallur Kandaswamy Kovil", category: "Heritage", location: "Nallur · Jaffna", eyebrow: "Living Hindu heritage", description: "Golden towers, intricate sacred sculpture, festival gatherings and the enduring devotional culture of northern Sri Lanka.", mapQuery: "Nallur Kandaswamy Kovil, Jaffna, Sri Lanka", images: NALLUR_GALLERY },
      { id: "koneswaram-kovil", name: "Koneswaram Kovil", category: "Heritage", location: "Swami Rock · Trincomalee", eyebrow: "Sacred cliffside", description: "Colourful temple artistry, living Hindu traditions and wide Indian Ocean views.", mapQuery: "Koneswaram Temple, Trincomalee, Sri Lanka", images: KONESWARAM_GALLERY },
      { id: "idalgashinna", name: "Idalgashinna", category: "Highlands", location: "Badulla District · Uva Province", eyebrow: "Railway above the clouds", description: "A celebrated hill-country railway stop surrounded by tea estates, pine forest, cloud-wrapped ridges and sweeping mountain views.", mapQuery: "Idalgashinna Railway Station, Sri Lanka", images: IDALGASHINNA_GALLERY },
      { id: "kalupahana", name: "Kalupahana", category: "Highlands", location: "Badulla District · Uva Province", eyebrow: "Waterfalls & mountain roads", description: "A cool highland landscape of forest roads, clear streams, hidden cascades and cottages tucked beneath the hills.", mapQuery: "Kalupahana, Sri Lanka", images: KALUPAHANA_GALLERY },
      { id: "ududumbara", name: "Ududumbara", category: "Highlands", location: "Kandy District · Central Province", eyebrow: "Gateway to the Knuckles", description: "Rugged peaks, deep valleys, forest trails and secluded waterfalls on the eastern edge of the Knuckles mountain country.", mapQuery: "Ududumbara, Sri Lanka", images: UDUDUMBARA_GALLERY },
      { id: "sembuwatta-lake", name: "Sembuwatta Lake", category: "Highlands", location: "Elkaduwa · Matale District", eyebrow: "Misty lake & pine forest", description: "A tranquil man-made lake surrounded by tea country, flower gardens and tall pine forest in the cool Matale hills.", mapQuery: "Sembuwatta Lake, Elkaduwa, Sri Lanka", images: SEMBUWATTA_LAKE_GALLERY },
      { id: "arugam-bay", name: "Arugam Bay", category: "Coast", location: "Ampara District · Eastern Province", eyebrow: "Surf, lagoons & open coast", description: "World-famous waves, sweeping sandy bays, rock headlands and calm lagoons along Sri Lanka's sunlit eastern shore.", mapQuery: "Arugam Bay, Sri Lanka", images: ARUGAM_BAY_GALLERY },
      { id: "galle-fort", name: "Galle Fort", category: "Heritage", location: "Galle · Southern Province", eyebrow: "Ramparts, streets & sea", description: "A living fortified town of colonial streets, landmark ramparts, courtyard cafes and dramatic Indian Ocean views.", mapQuery: "Galle Fort, Sri Lanka", images: GALLE_FORT_GALLERY },
    ]
  }, [])

  const [filter, setFilter] = useState<GalleryFilter>("All")
  const [query, setQuery] = useState("")
  const [activeId, setActiveId] = useState("meemure")
  const [imageIndex, setImageIndex] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const [carouselPaused, setCarouselPaused] = useState(false)
  const [carouselHovered, setCarouselHovered] = useState(false)
  const swipeStart = useRef<number | null>(null)
  const didSwipe = useRef(false)

  const filteredCollections = useMemo(() => collections.filter((collection) => {
    const matchesFilter = filter === "All" || collection.category === filter
    const matchesQuery = collection.name.toLowerCase().includes(query.trim().toLowerCase())
    return matchesFilter && matchesQuery
  }), [collections, filter, query])

  const activeCollection = collections.find((collection) => collection.id === activeId) ?? collections[0]
  const activeImage = activeCollection.images[imageIndex] ?? activeCollection.images[0]
  const totalImages = collections.reduce((total, collection) => total + collection.images.length, 0)

  const selectCollection = (collection: GalleryCollection) => {
    setActiveId(collection.id)
    setImageIndex(0)
    setCarouselPaused(false)
    document.getElementById("island-gallery-viewer")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const showPrevious = () => setImageIndex((current) => (current + activeCollection.images.length - 1) % activeCollection.images.length)
  const showNext = () => setImageIndex((current) => (current + 1) % activeCollection.images.length)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") showPrevious()
      if (event.key === "ArrowRight") showNext()
      if (event.key === "Escape") setExpanded(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [activeCollection.images.length])

  useEffect(() => {
    if (carouselPaused || carouselHovered || expanded || activeCollection.images.length < 2) return
    const interval = window.setInterval(() => {
      setImageIndex((current) => (current + 1) % activeCollection.images.length)
    }, 5000)
    return () => window.clearInterval(interval)
  }, [activeCollection.images.length, activeId, carouselHovered, carouselPaused, expanded, imageIndex])

  useEffect(() => {
    if (!expanded) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = previousOverflow }
  }, [expanded])

  return (
    <main className="island-gallery">
      <section className="island-gallery__hero">
        <div className="island-gallery__hero-collage" aria-hidden="true">
          {collections.slice(0, 6).map((collection) => <img key={collection.id} src={collection.images[0].src} alt="" />)}
        </div>
        <div className="island-gallery__hero-shade" />
        <div className="island-gallery__hero-content">
          <p><span /> Wonder Lanka image library</p>
          <h1>See the island.<br /><em>One frame at a time.</em></h1>
          <div className="island-gallery__hero-bottom">
            <span>Choose a destination, move through every view, and open any image full screen.</span>
            <div><strong>{String(totalImages).padStart(3, "0")}</strong><small>island views</small></div>
            <div><strong>{String(collections.length).padStart(2, "0")}</strong><small>collections</small></div>
          </div>
        </div>
      </section>

      <section className="island-gallery__browser" id="island-gallery-viewer" aria-labelledby="gallery-browser-title">
        <header className="island-gallery__browser-head">
          <div><p>Destination selector</p><h2 id="gallery-browser-title">Choose a place.<br />Take in every view.</h2></div>
          <span>Use the destination list, thumbnails or arrow keys to explore images one by one.</span>
        </header>

        <div className="island-gallery__filters" role="group" aria-label="Filter gallery collections">
          {FILTERS.map((item) => <button type="button" key={item} className={filter === item ? "is-active" : ""} onClick={() => setFilter(item)} aria-pressed={filter === item}>{item}</button>)}
        </div>

        <div className="island-gallery__workspace">
          <aside className="island-gallery__navigator" aria-label="Destination collections">
            <label><span>Find a destination</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search places…" /><i aria-hidden="true">⌕</i></label>
            <div className="island-gallery__collection-list">
              {filteredCollections.map((collection, index) => (
                <button type="button" key={collection.id} className={activeCollection.id === collection.id ? "is-active" : ""} onClick={() => selectCollection(collection)}>
                  <img src={collection.images[0].src} alt="" loading="lazy" />
                  <span><small>{collection.category} · {collection.images.length} {collection.images.length === 1 ? "view" : "views"}</small><strong>{collection.name}</strong></span>
                  <em>{String(index + 1).padStart(2, "0")}</em>
                </button>
              ))}
              {filteredCollections.length === 0 && <p className="island-gallery__empty">No collections match that search.</p>}
            </div>
          </aside>

          <div className="island-gallery__stage">
            <div className="island-gallery__stage-topline"><div><p>{activeCollection.eyebrow}</p><h3>{activeCollection.name}</h3></div><span>{activeCollection.location}</span></div>

            <figure className="island-gallery__selected-view" onMouseEnter={() => setCarouselHovered(true)} onMouseLeave={() => setCarouselHovered(false)}>
              <div
                className="island-gallery__carousel-viewport"
                onPointerDown={(event) => { swipeStart.current = event.clientX; didSwipe.current = false }}
                onPointerUp={(event) => {
                  if (swipeStart.current === null) return
                  const distance = event.clientX - swipeStart.current
                  if (Math.abs(distance) > 45) {
                    didSwipe.current = true
                    if (distance < 0) showNext()
                    else showPrevious()
                  }
                  swipeStart.current = null
                }}
                onPointerCancel={() => { swipeStart.current = null }}
              >
                <div className="island-gallery__carousel-track" style={{ transform: `translate3d(-${imageIndex * 100}%,0,0)` }}>
                  {activeCollection.images.map((image) => (
                    <button type="button" className="island-gallery__image-button" key={image.src} onClick={() => { if (didSwipe.current) { didSwipe.current = false; return }; setExpanded(true) }} aria-label={`Open ${image.title} full screen`}>
                      <img src={image.src} alt={`${image.title}, ${activeCollection.name}`} />
                      <span className="island-gallery__image-shade" />
                    </button>
                  ))}
                </div>
                {activeCollection.images.length > 1 && <button type="button" className="island-gallery__carousel-toggle" onClick={() => setCarouselPaused((current) => !current)} aria-label={carouselPaused ? "Play image carousel" : "Pause image carousel"}>{carouselPaused ? "▶ Play" : "Ⅱ Pause"}</button>}
                <button type="button" className="island-gallery__expand" onClick={() => setExpanded(true)} aria-label={`Expand ${activeImage.title}`}>Expand <i aria-hidden="true">↗</i></button>
                {activeCollection.images.length > 1 && <div className="island-gallery__carousel-dots" aria-label="Carousel position">{activeCollection.images.map((image, index) => <button type="button" key={image.src} className={imageIndex === index ? "is-active" : ""} onClick={() => setImageIndex(index)} aria-label={`Show slide ${index + 1}`} />)}</div>}
              </div>
              <figcaption><span>{String(imageIndex + 1).padStart(2, "0")} <i /> {String(activeCollection.images.length).padStart(2, "0")}</span><div><strong>{activeImage.title}</strong><p>{activeImage.detail}</p></div></figcaption>
              <button type="button" className="island-gallery__arrow island-gallery__arrow--previous" onClick={showPrevious} aria-label="Previous image">←</button>
              <button type="button" className="island-gallery__arrow island-gallery__arrow--next" onClick={showNext} aria-label="Next image">→</button>
            </figure>

            <div className="island-gallery__thumbs" aria-label={`${activeCollection.name} image thumbnails`}>
              {activeCollection.images.map((image, index) => (
                <button type="button" key={image.src} className={imageIndex === index ? "is-active" : ""} onClick={() => setImageIndex(index)} aria-label={`View image ${index + 1}: ${image.title}`} aria-current={imageIndex === index ? "true" : undefined}>
                  <img src={image.src} alt="" /><span>{String(index + 1).padStart(2, "0")}</span>
                </button>
              ))}
            </div>

            <div className="island-gallery__details"><p>{activeCollection.description}</p><div><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeCollection.mapQuery)}`} target="_blank" rel="noreferrer">Open location ↗</a><button type="button" onClick={() => onNavigate("destinations")}>Destination guide</button></div></div>
          </div>
        </div>
      </section>

      <section className="island-gallery__index" aria-labelledby="gallery-index-title">
        <div className="island-gallery__index-heading"><div><p>Complete visual index</p><h2 id="gallery-index-title">Every collection,<br />ready to explore.</h2></div><span>{filteredCollections.length} places currently shown</span></div>
        <div className="island-gallery__index-grid">
          {filteredCollections.map((collection, index) => (
            <button type="button" key={collection.id} onClick={() => selectCollection(collection)}>
              <img src={collection.images[0].src} alt={`${collection.name} collection cover`} loading="lazy" /><span className="island-gallery__index-shade" /><span className="island-gallery__index-number">{String(index + 1).padStart(2, "0")}</span><span className="island-gallery__index-copy"><small>{collection.category} · {collection.images.length} views</small><strong>{collection.name}</strong></span><i aria-hidden="true">↗</i>
            </button>
          ))}
        </div>
      </section>

      <section className="island-gallery__cta"><div><p>Found your next place?</p><h2>Turn the view into a journey.</h2></div><div><button type="button" onClick={() => onNavigate("destinations")}>Explore destination guides</button><button type="button" onClick={() => onNavigate("reach-us")}>Plan my journey ↗</button></div></section>

      {expanded && (
        <div className="island-gallery__lightbox" role="dialog" aria-modal="true" aria-label={`${activeCollection.name} full-screen image viewer`} onClick={() => setExpanded(false)}>
          <button type="button" className="island-gallery__lightbox-close" onClick={() => setExpanded(false)} aria-label="Close full-screen viewer">×</button>
          <button type="button" className="island-gallery__lightbox-arrow island-gallery__lightbox-arrow--previous" onClick={(event) => { event.stopPropagation(); showPrevious() }} aria-label="Previous image">←</button>
          <figure onClick={(event) => event.stopPropagation()}><img src={activeImage.src} alt={`${activeImage.title}, ${activeCollection.name}`} /><figcaption><span>{String(imageIndex + 1).padStart(2, "0")} / {String(activeCollection.images.length).padStart(2, "0")}</span><div><small>{activeCollection.name}</small><strong>{activeImage.title}</strong></div></figcaption></figure>
          <button type="button" className="island-gallery__lightbox-arrow island-gallery__lightbox-arrow--next" onClick={(event) => { event.stopPropagation(); showNext() }} aria-label="Next image">→</button>
        </div>
      )}
    </main>
  )
}
