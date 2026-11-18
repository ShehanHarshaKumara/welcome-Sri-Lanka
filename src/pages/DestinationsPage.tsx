import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react"
import destinationAdventureMap from "../assets/sri-lanka-destination-adventure-map.png"

export type Destination = {
  name: string
  type: string
  img: string
  tag: string
}

type DestinationsPageProps = {
  destinations: Destination[]
  onBack: () => void
}

const FILTERS = ["All", "Heritage", "Coast", "Highlands", "Wildlife", "Cities"] as const
type Filter = (typeof FILTERS)[number]

const DESTINATION_TOURIST_MAP_POINTS = [
  { label: "Jaffna", destination: "Jaffna", x: 28, y: 7, color: "#ef4444" },
  { label: "Trincomalee", destination: "Trincomalee", x: 64, y: 17, color: "#2563eb" },
  { label: "Anuradhapura", destination: "Anuradhapura", x: 35, y: 21, color: "#ef4444" },
  { label: "Sigiriya", destination: "Sigiriya", x: 46, y: 27, color: "#ef4444" },
  { label: "Polonnaruwa", destination: "Polonnaruwa", x: 56, y: 25, color: "#ef4444" },
  { label: "Dambulla", destination: "Dambulla", x: 53, y: 38, color: "#ef4444" },
  { label: "Kandy", destination: "Kandy", x: 37, y: 37, color: "#f59e0b" },
  { label: "Nuwara Eliya", destination: "Nuwara Eliya", x: 48, y: 45, color: "#22c55e" },
  { label: "Ella", destination: "Ella", x: 67, y: 47, color: "#8b5cf6" },
  { label: "Arugam Bay", destination: "Arugam Bay", x: 80, y: 48, color: "#ef4444" },
  { label: "Yala National Park", destination: "Yala", x: 72, y: 60, color: "#d97706" },
  { label: "Udawalawe National Park", destination: "Udawalawe", x: 53, y: 64, color: "#d97706" },
  { label: "Haputale", destination: "Haputale", x: 56, y: 55, color: "#ef4444" },
  { label: "Mirissa", destination: "Mirissa", x: 47, y: 81, color: "#ec4899" },
  { label: "Weligama", destination: "Weligama", x: 53, y: 84, color: "#ef4444" },
  { label: "Tangalle", destination: "Tangalle", x: 61, y: 82, color: "#ef4444" },
  { label: "Galle Fort", destination: "Galle", x: 32, y: 78, color: "#3b82f6" },
  { label: "Unawatuna", destination: "Unawatuna", x: 35, y: 85, color: "#ef4444" },
  { label: "Hikkaduwa", destination: "Hikkaduwa", x: 20, y: 72, color: "#ef4444" },
  { label: "Bentota", destination: "Bentota", x: 18, y: 65, color: "#ef4444" },
  { label: "Negombo", destination: "Negombo", x: 17, y: 40, color: "#ef4444" },
  { label: "Colombo", destination: "Colombo", x: 18, y: 49, color: "#ef4444" },
  { label: "Kalpitiya", destination: "Kalpitiya", x: 17, y: 31, color: "#ef4444" },
  { label: "Kithulgala", destination: "Kithulgala", x: 29, y: 49, color: "#ef4444" },
] as const

const DESTINATION_GUIDES: Record<Exclude<Filter, "All">, { intro: string; bestTime: string; stay: string; highlights: string[] }> = {
  Heritage: {
    intro: "Walk through centuries of living history, sacred architecture and stories carved into stone across Sri Lanka's cultural heartland.",
    bestTime: "Jan — Apr",
    stay: "2 — 3 days",
    highlights: ["Sunrise heritage walk", "Local temple rituals", "Ancient art and architecture"],
  },
  Coast: {
    intro: "Follow warm Indian Ocean water to palm-framed beaches, characterful fishing towns and unforgettable golden-hour horizons.",
    bestTime: "Nov — Apr",
    stay: "3 — 5 days",
    highlights: ["Sunrise on the shore", "Fresh coastal flavours", "Swimming and ocean adventures"],
  },
  Highlands: {
    intro: "Slow down among cloud forests, emerald tea gardens and cool mountain air, where every railway bend reveals another view.",
    bestTime: "Dec — May",
    stay: "2 — 4 days",
    highlights: ["Scenic train journeys", "Tea estate walks", "Waterfalls and mountain trails"],
  },
  Wildlife: {
    intro: "Enter Sri Lanka's wild landscapes for quiet encounters with elephants, leopards, birds and untamed tropical nature.",
    bestTime: "Feb — Sep",
    stay: "2 — 3 days",
    highlights: ["Dawn wildlife safari", "Expert naturalist stories", "Golden-hour nature photography"],
  },
  Cities: {
    intro: "Discover the island's contemporary rhythm through colourful markets, regional cuisine, local craft and layered neighbourhoods.",
    bestTime: "Year round",
    stay: "1 — 3 days",
    highlights: ["Local market discoveries", "Regional food experiences", "Architecture and everyday culture"],
  },
}

type PlaceIntelligence = {
  district: string
  nearby: string[]
  bestFor: string
  routeNote: string
}

type NearbyPlaceSelection = {
  parent: Destination
  place: string
}

type NearbyPlaceStory = {
  kind: string
  intro: string
  bestMoment: string
  visitTime: string
  highlights: string[]
  travelTip: string
}

function getNearbyPlaceStory(place: string, parent: Destination): NearbyPlaceStory {
  const words = place.toLowerCase()
  if (/temple|devalaya|vihara|bodhi|fort|monastery|tomb|museum|palace|heritage|archae|isurumuniya|ruwanwelisaya|kushtarajagala/.test(words)) {
    return { kind: "Culture & heritage", intro: `${place} adds another layer to ${parent.name}'s story through sacred traditions, architecture and local history. Move slowly, observe respectfully and leave space for the details that make the site meaningful.`, bestMoment: "Early morning", visitTime: "1 — 2 hours", highlights: ["Historic architecture and details", "Living traditions and local stories", "Quiet photography opportunities"], travelTip: "Dress respectfully at religious sites and carry easy-to-remove footwear." }
  }
  if (/national park|sanctuary|forest|eco park|wetland|transit home|wildlife|bar reef/.test(words)) {
    return { kind: "Nature & wildlife", intro: `${place} opens a wilder side of the region around ${parent.name}, with protected habitats and opportunities to understand Sri Lanka's biodiversity beyond the main attraction.`, bestMoment: "Dawn or late afternoon", visitTime: "3 — 5 hours", highlights: ["Wild landscapes and habitats", "Birdlife and seasonal wildlife", "Guided nature interpretation"], travelTip: "Use an authorised local guide, keep a respectful distance and never feed wildlife." }
  }
  if (/beach|bay|island|coast|lagoon|lake|river|reservoir|canal|reef|harbour|polhena|nilaveli|midigama|hikkaduwa/.test(words)) {
    return { kind: "Coast & water", intro: `${place} is a refreshing extension of ${parent.name}, shaped by water, local livelihoods and an unhurried tropical rhythm. It works especially well as a sunrise, sunset or half-day escape.`, bestMoment: "Morning or golden hour", visitTime: "2 — 4 hours", highlights: ["Waterfront scenery", "Local coastal life", "Swimming, boating or relaxed walks"], travelTip: "Check local sea conditions and follow lifeguard or community advice before entering the water." }
  }
  if (/falls|peak|rock|plains|seat|garden|view|mount|loop|tea|gap|peak|hakgala|pidurangala/.test(words)) {
    return { kind: "Scenic highlands", intro: `${place} reveals the landscape around ${parent.name} from a different angle—through trails, viewpoints, gardens or cool-climate scenery that rewards a slower visit.`, bestMoment: "Morning light", visitTime: "2 — 3 hours", highlights: ["Panoramic viewpoints", "Short trails and fresh air", "Landscape photography"], travelTip: "Start early, carry water and bring a light rain layer in the highlands." }
  }
  return { kind: "Local discovery", intro: `${place} is a worthwhile addition around ${parent.name}, offering a closer look at the region's everyday character, community, food and lesser-known stories.`, bestMoment: "Morning to afternoon", visitTime: "1 — 3 hours", highlights: ["Local atmosphere", "Regional stories and culture", "A quieter alternative to headline sights"], travelTip: "Ask before photographing people and support locally owned guides, cafés and craft makers." }
}

const PLACE_INTELLIGENCE: Record<string, PlaceIntelligence> = {
  Sigiriya: { district: "Matale", nearby: ["Pidurangala Rock", "Dambulla Cave Temple", "Ritigala Monastery", "Minneriya National Park"], bestFor: "History & sunrise", routeNote: "Anchor a two-day Cultural Triangle loop here." },
  Ella: { district: "Badulla", nearby: ["Nine Arch Bridge", "Little Adam's Peak", "Ravana Falls", "Demodara Loop"], bestFor: "Hikes & rail journeys", routeNote: "Pair the train journey with two slow mountain mornings." },
  Mirissa: { district: "Matara", nearby: ["Coconut Tree Hill", "Weligama Bay", "Dondra Head", "Polhena Beach"], bestFor: "Ocean & whale watching", routeNote: "Follow the south coast west to east over three days." },
  Kandy: { district: "Kandy", nearby: ["Temple of the Tooth", "Peradeniya Gardens", "Udawattakele", "Embekke Devalaya"], bestFor: "Living culture", routeNote: "Allow an evening for the lake and sacred-city rituals." },
  Yala: { district: "Hambantota", nearby: ["Sithulpawwa", "Kataragama", "Bundala National Park", "Kirinda"], bestFor: "Safari & wilderness", routeNote: "Combine a dawn safari with the quieter Bundala wetlands." },
  Galle: { district: "Galle", nearby: ["Galle Fort", "Unawatuna", "Rumassala", "Koggala Lake"], bestFor: "Fort streets & coast", routeNote: "Walk the ramparts at sunset, then explore the nearby coves." },
  "Nuwara Eliya": { district: "Nuwara Eliya", nearby: ["Horton Plains", "Gregory Lake", "Hakgala Gardens", "St. Clair's Falls"], bestFor: "Tea & cool climate", routeNote: "Build a highland loop through tea country and cloud forest." },
  Unawatuna: { district: "Galle", nearby: ["Jungle Beach", "Japanese Peace Pagoda", "Galle Fort", "Dalawella Beach"], bestFor: "Easy beach days", routeNote: "Use Unawatuna as a relaxed base for the Galle coast." },
  Anuradhapura: { district: "Anuradhapura", nearby: ["Sri Maha Bodhi", "Ruwanwelisaya", "Mihintale", "Isurumuniya"], bestFor: "Sacred history", routeNote: "Explore by bicycle, then climb Mihintale near sunset." },
  Dambulla: { district: "Matale", nearby: ["Rangiri Cave Temple", "Ibbankatuwa Tombs", "Namal Uyana", "Sigiriya"], bestFor: "Caves & archaeology", routeNote: "A natural gateway between Kandy and the ancient cities." },
  Bentota: { district: "Galle", nearby: ["Lunuganga Estate", "Brief Garden", "Madu River", "Kosgoda Turtle Coast"], bestFor: "Wellness & water", routeNote: "Mix river landscapes, design heritage and beach time." },
  Hikkaduwa: { district: "Galle", nearby: ["Coral Sanctuary", "Seenigama Temple", "Tsunami Museum", "Dodanduwa Lagoon"], bestFor: "Reef & surf", routeNote: "Best explored as a compact coastal stop north of Galle." },
  "Arugam Bay": { district: "Ampara", nearby: ["Elephant Rock", "Kumana National Park", "Muhudu Maha Viharaya", "Okanda Devalaya"], bestFor: "Surf & east-coast nature", routeNote: "Add lagoon wildlife and sacred sites beyond the surf breaks." },
  Trincomalee: { district: "Trincomalee", nearby: ["Koneswaram Temple", "Nilaveli", "Pigeon Island", "Fort Frederick"], bestFor: "Temples & clear water", routeNote: "Split time between harbour history and the Nilaveli coast." },
  Jaffna: { district: "Jaffna", nearby: ["Nallur Kandaswamy", "Jaffna Fort", "Delft Island", "Nagadeepa"], bestFor: "Northern culture", routeNote: "Give the peninsula time for food, islands and layered history." },
  Kalpitiya: { district: "Puttalam", nearby: ["Bar Reef", "Dutch Fort", "Wilpattu National Park", "Alankuda Coast"], bestFor: "Kitesurfing & dolphins", routeNote: "Connect the peninsula with Wilpattu for coast-to-wild travel." },
  Udawalawe: { district: "Ratnapura", nearby: ["Elephant Transit Home", "Udawalawe Reservoir", "Sankhapala Temple", "Wavulpane Cave"], bestFor: "Elephant encounters", routeNote: "Plan a responsible safari and visit the transit home." },
  Minneriya: { district: "Polonnaruwa", nearby: ["Kaudulla National Park", "Habarana", "Polonnaruwa", "Hurulu Eco Park"], bestFor: "Seasonal elephant gathering", routeNote: "Choose the park with current wildlife movement in mind." },
  Polonnaruwa: { district: "Polonnaruwa", nearby: ["Gal Vihara", "Parakrama Samudra", "Medirigiriya", "Minneriya"], bestFor: "Ancient architecture", routeNote: "Cycle the royal city and continue into elephant country." },
  Haputale: { district: "Badulla", nearby: ["Lipton's Seat", "Dambatenne Tea Factory", "Adisham Bungalow", "Bambarakanda Falls"], bestFor: "Tea views & quiet trails", routeNote: "A slower alternative to Ella with extraordinary ridge views." },
  Kithulgala: { district: "Kegalle", nearby: ["Kelani River", "Belilena Cave", "Makandawa Forest", "Laxapana Falls"], bestFor: "Rafting & rainforest", routeNote: "Break the Colombo-to-highlands drive with active adventure." },
  Weligama: { district: "Matara", nearby: ["Kushtarajagala", "Midigama", "Mirissa", "Taprobane Island"], bestFor: "Beginner surf", routeNote: "Use the bay as a friendly base for the south-coast surf belt." },
  Tangalle: { district: "Hambantota", nearby: ["Hiriketiya", "Rekawa Lagoon", "Mulkirigala Temple", "Kalametiya Sanctuary"], bestFor: "Quiet coast & lagoons", routeNote: "Balance hidden beaches with wetlands and rock-temple heritage." },
  Negombo: { district: "Gampaha", nearby: ["Negombo Lagoon", "Dutch Canal", "Fish Market", "Muthurajawela Wetland"], bestFor: "First or final night", routeNote: "An easy airport-side introduction to coastal life." },
  Colombo: { district: "Colombo", nearby: ["National Museum", "Pettah Market", "Gangaramaya Temple", "Mount Lavinia"], bestFor: "Food, design & city life", routeNote: "Explore by neighbourhood rather than treating it as a transit stop." },
}

export const PLACE_IMAGE_GALLERIES: Record<string, string[]> = {
  "Coconut Tree Hill": [
    "/assets/coconut-tree-hill-main.png",
    "/assets/coconut-tree-hill-view-2.png",
    "/assets/coconut-tree-hill-view-3.png",
    "/assets/coconut-tree-hill-view-4.png",
    "/assets/coconut-tree-hill-view-5.png",
  ],
  "Weligama Bay": [
    "/assets/weligama-bay-main.png",
    "/assets/weligama-bay-view-2.png",
    "/assets/weligama-bay-view-3.png",
    "/assets/weligama-bay-view-4.png",
    "/assets/weligama-bay-view-5.png",
  ],
  "Dondra Head": [
    "/assets/dondra-head-main.png",
    "/assets/dondra-head-view-2.png",
    "/assets/dondra-head-view-3.png",
    "/assets/dondra-head-view-4.png",
    "/assets/dondra-head-view-5.png",
  ],
  "Polhena Beach": [
    "/assets/polhena-beach-main.png",
    "/assets/polhena-beach-view-2.png",
    "/assets/polhena-beach-view-3.png",
    "/assets/polhena-beach-view-4.png",
    "/assets/polhena-beach-view-5.png",
  ],
  "Local flavours of Mirissa": [
    "/assets/local-flavours-mirissa-main.png",
    "/assets/local-flavours-mirissa-view-2.png",
    "/assets/local-flavours-mirissa-view-3.png",
    "/assets/local-flavours-mirissa-view-4.png",
    "/assets/local-flavours-mirissa-view-5.png",
  ],
  "Mirissa market & café trail": [
    "/assets/mirissa-market-cafe-trail-main.png",
    "/assets/mirissa-market-cafe-trail-view-2.png",
    "/assets/mirissa-market-cafe-trail-view-3.png",
    "/assets/mirissa-market-cafe-trail-view-4.png",
    "/assets/mirissa-market-cafe-trail-view-5.png",
  ],
  "Boutique stays near Mirissa": [
    "/assets/boutique-stays-mirissa-main.png",
    "/assets/boutique-stays-mirissa-view-2.png",
    "/assets/boutique-stays-mirissa-view-3.png",
    "/assets/boutique-stays-mirissa-view-4.png",
    "/assets/boutique-stays-mirissa-view-5.png",
  ],
  "Mirissa guesthouses & nature lodges": [
    "/assets/mirissa-guesthouses-nature-lodges-main.png",
    "/assets/mirissa-guesthouses-nature-lodges-view-2.png",
    "/assets/mirissa-guesthouses-nature-lodges-view-3.png",
    "/assets/mirissa-guesthouses-nature-lodges-view-4.png",
    "/assets/mirissa-guesthouses-nature-lodges-view-5.png",
  ],
  "Nine Arch Bridge": [
    "/assets/nine-arch-bridge-main.png",
    "/assets/nine-arch-bridge-view-2.png",
    "/assets/nine-arch-bridge-view-3.png",
    "/assets/nine-arch-bridge-view-4.png",
    "/assets/nine-arch-bridge-view-5.png",
  ],
  "Little Adam's Peak": [
    "/assets/little-adams-peak-main.png",
    "/assets/little-adams-peak-view-2.png",
    "/assets/little-adams-peak-view-3.png",
    "/assets/little-adams-peak-view-4.png",
    "/assets/little-adams-peak-view-5.png",
  ],
  "Ravana Falls": [
    "/assets/ravana-falls-main.png",
    "/assets/ravana-falls-view-2.png",
    "/assets/ravana-falls-view-3.png",
    "/assets/ravana-falls-view-4.png",
    "/assets/ravana-falls-view-5.png",
  ],
  "Demodara Loop": [
    "/assets/demodara-loop-main.png",
    "/assets/demodara-loop-view-2.png",
    "/assets/demodara-loop-view-3.png",
    "/assets/demodara-loop-view-4.png",
    "/assets/demodara-loop-view-5.png",
  ],
  "Local flavours of Ella": [
    "/assets/local-flavours-ella-main.png",
    "/assets/local-flavours-ella-view-2.png",
    "/assets/local-flavours-ella-view-3.png",
    "/assets/local-flavours-ella-view-4.png",
    "/assets/local-flavours-ella-view-5.png",
  ],
  "Ella market & café trail": [
    "/assets/ella-market-cafe-main.png",
    "/assets/ella-market-cafe-view-2.png",
    "/assets/ella-market-cafe-view-3.png",
    "/assets/ella-market-cafe-view-4.png",
    "/assets/ella-market-cafe-view-5.png",
  ],
  "Boutique stays near Ella": [
    "/assets/boutique-stays-ella-main.png",
    "/assets/boutique-stays-ella-view-2.png",
    "/assets/boutique-stays-ella-view-3.png",
    "/assets/boutique-stays-ella-view-4.png",
    "/assets/boutique-stays-ella-view-5.png",
  ],
  "Ella guesthouses & nature lodges": [
    "/assets/ella-guesthouses-lodges-main.png",
    "/assets/ella-guesthouses-lodges-view-2.png",
    "/assets/ella-guesthouses-lodges-view-3.png",
    "/assets/ella-guesthouses-lodges-view-4.png",
    "/assets/ella-guesthouses-lodges-view-5.png",
  ],
  "Pidurangala Rock": [
    "/assets/pidurangala-main.png",
    "/assets/pidurangala-view-2.png",
    "/assets/pidurangala-view-3.png",
    "/assets/pidurangala-view-4.png",
    "/assets/pidurangala-view-5.png",
  ],
  "Dambulla Cave Temple": [
    "/assets/dambulla-cave-temple-main.png",
    "/assets/dambulla-cave-temple-view-2.png",
    "/assets/dambulla-cave-temple-view-3.png",
    "/assets/dambulla-cave-temple-view-4.png",
    "/assets/dambulla-cave-temple-view-5.png",
  ],
  "Ritigala Monastery": [
    "/assets/ritigala-monastery-main.png",
    "/assets/ritigala-monastery-view-2.png",
    "/assets/ritigala-monastery-view-3.png",
    "/assets/ritigala-monastery-view-4.png",
    "/assets/ritigala-monastery-view-5.png",
  ],
  "Minneriya National Park": [
    "/assets/minneriya-national-park-main.png",
    "/assets/minneriya-national-park-view-2.png",
    "/assets/minneriya-national-park-view-3.png",
    "/assets/minneriya-national-park-view-4.png",
    "/assets/minneriya-national-park-view-5.png",
  ],
  "Local flavours of Sigiriya": [
    "/assets/local-flavours-sigiriya-main.png",
    "/assets/local-flavours-sigiriya-view-2.png",
    "/assets/local-flavours-sigiriya-view-3.png",
    "/assets/local-flavours-sigiriya-view-4.png",
    "/assets/local-flavours-sigiriya-view-5.png",
  ],
  "Sigiriya market & café trail": [
    "/assets/sigiriya-market-cafe-main.png",
    "/assets/sigiriya-market-cafe-view-2.png",
    "/assets/sigiriya-market-cafe-view-3.png",
    "/assets/sigiriya-market-cafe-view-4.png",
    "/assets/sigiriya-market-cafe-view-5.png",
  ],
  "Boutique stays near Sigiriya": [
    "/assets/boutique-stays-sigiriya-main.png",
    "/assets/boutique-stays-sigiriya-view-2.png",
    "/assets/boutique-stays-sigiriya-view-3.png",
    "/assets/boutique-stays-sigiriya-view-4.png",
    "/assets/boutique-stays-sigiriya-view-5.png",
  ],
}

const POPULAR_MAP_NAMES = [
  "Sigiriya",
  "Kandy",
  "Ella",
  "Yala",
  "Galle",
  "Mirissa",
  "Anuradhapura",
  "Trincomalee",
  "Arugam Bay",
  "Colombo",
]

const SMART_TRIP_FACTS: Record<string, { distance: string; drive: string; mood: string }> = {
  Sigiriya: { distance: "174 km", drive: "4h 05m", mood: "Ancient wonder" },
  Kandy: { distance: "116 km", drive: "3h 20m", mood: "Sacred city" },
  Ella: { distance: "205 km", drive: "5h 40m", mood: "Mountain air" },
  Yala: { distance: "260 km", drive: "5h 10m", mood: "Wild country" },
  Galle: { distance: "126 km", drive: "2h 10m", mood: "Fort & coast" },
  Mirissa: { distance: "151 km", drive: "2h 45m", mood: "Ocean calm" },
  Anuradhapura: { distance: "205 km", drive: "4h 15m", mood: "Living history" },
  Trincomalee: { distance: "267 km", drive: "5h 30m", mood: "East coast blue" },
  "Arugam Bay": { distance: "320 km", drive: "6h 45m", mood: "Surf sunrise" },
  Colombo: { distance: "0 km", drive: "Ready now", mood: "City energy" },
}

function getCategory(destination: Destination): Exclude<Filter, "All"> {
  const words = `${destination.type} ${destination.tag}`.toLowerCase()
  if (/wildlife|elephant|safari|national park|dolphin/.test(words)) return "Wildlife"
  if (/beach|coast|surf|sea|harbour|lagoon|kite|ocean/.test(words)) return "Coast"
  if (/hill|tea|cloud|highland|rainforest|mountain/.test(words)) return "Highlands"
  if (/ancient|fort|temple|kingdom|heritage|sacred|colonial|ruin/.test(words)) return "Heritage"
  return "Cities"
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

type AroundCategory = "All" | "Culture & history" | "Nature" | "Restaurants" | "Hotels"

function AroundPlacesPage({ destination, destinations, onBack }: { destination: Destination; destinations: Destination[]; onBack: () => void }) {
  useEffect(() => {
    document.documentElement.dataset.aroundPlaces = "true"
    return () => { delete document.documentElement.dataset.aroundPlaces }
  }, [])

  const [category, setCategory] = useState<AroundCategory>("All")
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [])
  const intelligence = PLACE_INTELLIGENCE[destination.name]
  const district = intelligence?.district ?? destination.name
  const parentIndex = Math.max(0, destinations.findIndex((item) => item.name === destination.name))
  const imagePool = [destination, ...destinations.slice(parentIndex + 1), ...destinations.slice(0, parentIndex)].map((item) => item.img)

  const attractionPlaces = (intelligence?.nearby ?? []).map((place, index) => {
    const story = getNearbyPlaceStory(place, destination)
    const placeCategory: AroundCategory = story.kind === "Culture & heritage" ? "Culture & history" : "Nature"
    const suppliedGallery = PLACE_IMAGE_GALLERIES[place]
    return { name: place, category: placeCategory, description: story.intro, best: story.bestMoment, time: story.visitTime, tip: story.travelTip, image: suppliedGallery?.[0] ?? destinations.find((item) => item.name === place)?.img ?? imagePool[index % imagePool.length], mapQuery: `${place}, ${district}, Sri Lanka` }
  })

  const servicePlaces = [
    { name: `Local flavours of ${destination.name}`, category: "Restaurants" as AroundCategory, description: `Discover the food culture around ${destination.name} through locally owned rice-and-curry kitchens, family restaurants and regional specialities prepared with seasonal Sri Lankan ingredients.`, best: "Lunch or early dinner", time: "1 — 2 hours", tip: "Ask for the day's vegetable curries and confirm spice levels when ordering.", image: imagePool[4 % imagePool.length], mapQuery: `local restaurants near ${destination.name}, Sri Lanka` },
    { name: `${destination.name} market & café trail`, category: "Restaurants" as AroundCategory, description: `Combine a local market visit with small cafés, fresh fruit, tea and street-side snacks for an easy introduction to the everyday tastes and social rhythm of the area.`, best: "Morning", time: "2 — 3 hours", tip: "Carry small cash and choose busy food stalls with freshly prepared dishes.", image: imagePool[5 % imagePool.length], mapQuery: `cafes and markets near ${destination.name}, Sri Lanka` },
    { name: `Boutique stays near ${destination.name}`, category: "Hotels" as AroundCategory, description: `Characterful boutique hotels and locally designed villas provide a comfortable base close to the main sights while keeping the experience connected to the landscape and community.`, best: "Two-night base", time: "Check-in from afternoon", tip: "Choose a licensed stay with recent reviews and confirm transport before arrival.", image: imagePool[6 % imagePool.length], mapQuery: `boutique hotels near ${destination.name}, Sri Lanka` },
    { name: `${destination.name} guesthouses & nature lodges`, category: "Hotels" as AroundCategory, description: `Smaller guesthouses and nature lodges offer a more personal stay, often with home-cooked meals, local hosts and easy access to sunrise walks or quieter surrounding places.`, best: "Slow travel", time: "Two to three nights", tip: "Check room access, meal options and sustainability practices before booking.", image: imagePool[7 % imagePool.length], mapQuery: `guest houses and nature lodges near ${destination.name}, Sri Lanka` },
  ]

  const places = [...attractionPlaces, ...servicePlaces].map((place) => ({
    ...place,
    image: PLACE_IMAGE_GALLERIES[place.name]?.[0] ?? place.image,
  }))
  const visiblePlaces = category === "All" ? places : places.filter((place) => place.category === category)

  return (
    <main className="min-h-screen bg-[#e9e5fb] pb-24 text-[#123f35]">
      <header className="relative isolate min-h-[68vh] overflow-hidden pt-24 text-white">
        <img src={destination.img} alt={`Landscape around ${destination.name}`} className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(2,29,24,.94),rgba(2,29,24,.64)_52%,rgba(2,29,24,.2)),linear-gradient(0deg,rgba(2,29,24,.75),transparent_55%)]" />
        <figure className="around-hero-vehicle" aria-label="Private Suzuki Every travel van">
          <span aria-hidden="true" />
          <img src="/suzuki-every-3d-cutout.png" alt="White Suzuki Every travel van" />
        </figure>
        <div className="relative z-10 mx-auto flex min-h-[calc(68vh-6rem)] max-w-[1600px] flex-col justify-between px-5 pb-10 sm:px-8 lg:px-12">
          <button type="button" onClick={onBack} className="w-fit rounded-full border border-white/25 bg-black/15 px-5 py-2.5 text-[10px] font-bold uppercase tracking-[.16em] backdrop-blur-xl transition hover:bg-white hover:text-[#063e34]">← Back to {destination.name}</button>
          <div className="max-w-5xl">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[.24em] text-[#b9ffd5]">Complete area guide · {district} District</p>
            <h1 className="font-['Instrument_Serif'] text-[clamp(4.5rem,9vw,9rem)] font-normal leading-[.76] tracking-[-.05em]">More around<br /><em className="text-[#b9ffd5]">{destination.name}.</em></h1>
            <p className="mt-7 max-w-2xl text-base leading-7 text-white/70">Explore cultural and historical places, nature, local dining areas and recommended stay styles—all organised with practical details and compact location maps.</p>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <div className="sticky top-16 z-30 mb-10 flex flex-col gap-3 rounded-[1.5rem] border border-[#0a5b49]/10 bg-[#f8fbf6]/92 p-3 shadow-[0_18px_60px_rgba(8,61,50,.12)] backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <button type="button" onClick={onBack} aria-label={`Back to ${destination.name} destination guide`} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#074d3f] text-lg text-white shadow-md transition hover:-translate-x-0.5 hover:bg-[#08715d]">←</button>
            <div><p className="text-[9px] font-bold uppercase tracking-[.2em] text-[#07856f]">Area directory</p><strong className="mt-1 block text-sm">{visiblePlaces.length} detailed places and services</strong></div>
          </div>
          <div className="flex gap-1 overflow-x-auto">
            {(["All", "Culture & history", "Nature", "Restaurants", "Hotels"] as AroundCategory[]).map((item) => <button type="button" key={item} onClick={() => setCategory(item)} aria-pressed={category === item} className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-semibold transition ${category === item ? "bg-[#074d3f] text-white shadow-lg" : "text-[#4f6e65] hover:bg-[#e5f1e8]"}`}>{item}</button>)}
          </div>
        </div>

        <div className="space-y-5">
          {visiblePlaces.map((place, index) => {
            const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(place.mapQuery)}&z=13&output=embed`
            const suppliedGallery = PLACE_IMAGE_GALLERIES[place.name]
            const additionalImages = suppliedGallery?.slice(1, 5) ?? [...imagePool.slice(index + 1), ...imagePool.slice(0, index + 1)]
              .filter((image, imageIndex, list) => image !== place.image && list.indexOf(image) === imageIndex)
              .slice(0, 4)
            return (
              <article key={place.name} className="grid overflow-hidden rounded-[2rem] border border-[#0a5b49]/10 bg-white shadow-[0_18px_55px_rgba(8,61,50,.08)] md:grid-cols-[12rem_minmax(0,1fr)_13rem] xl:grid-cols-[18rem_minmax(0,1fr)_17rem]">
                <div className="relative min-h-64 overflow-hidden bg-[#123f35] md:min-h-[23rem]"><img src={place.image} alt={`Regional view for ${place.name}`} className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#032a23]/80 via-transparent to-transparent" /><span className="absolute left-5 top-5 rounded-full border border-white/25 bg-black/20 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[.15em] text-white backdrop-blur-xl">{place.category}</span><strong className="absolute bottom-5 right-5 font-['Instrument_Serif'] text-4xl font-normal text-white/80">{String(index + 1).padStart(2, "0")}</strong></div>
                <div className="flex flex-col justify-between p-6 sm:p-7 xl:p-10">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[.2em] text-[#07856f]">Around {destination.name}</p><h2 className="mt-3 font-['Instrument_Serif'] text-[clamp(2.7rem,4vw,4.8rem)] font-normal leading-[.86] tracking-[-.04em]">{place.name}</h2><p className="mt-5 max-w-2xl text-sm leading-7 text-[#5b746c]">{place.description}</p>
                    <div className="mt-5"><div className="mb-2 flex items-center justify-between"><span className="text-[8px] font-bold uppercase tracking-[.16em] text-[#07856f]">More original views</span><span className="text-[8px] font-semibold text-[#80948d]">+4 images</span></div><div className="grid grid-cols-4 gap-1.5">{additionalImages.map((image, galleryIndex) => <figure key={`${place.name}-gallery-${galleryIndex}`} className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#dce8df]"><img src={image} alt={`${place.name} travel view ${galleryIndex + 2}`} className="absolute inset-0 h-full w-full object-cover transition duration-500 hover:scale-110" loading="lazy" /></figure>)}</div></div>
                  </div>
                  <div className="mt-7 grid grid-cols-2 gap-2 border-t border-[#0a5b49]/10 pt-5 sm:grid-cols-3"><div><span className="block text-[8px] font-bold uppercase tracking-[.15em] text-[#80948d]">Best moment</span><strong className="mt-1 block text-xs">{place.best}</strong></div><div><span className="block text-[8px] font-bold uppercase tracking-[.15em] text-[#80948d]">Allow</span><strong className="mt-1 block text-xs">{place.time}</strong></div><div className="col-span-2 sm:col-span-1"><span className="block text-[8px] font-bold uppercase tracking-[.15em] text-[#80948d]">Travel note</span><strong className="mt-1 line-clamp-2 block text-xs font-medium">{place.tip}</strong></div></div>
                </div>
                <aside className="border-t border-[#0a5b49]/10 bg-[#e1ece2] p-3 md:border-l md:border-t-0"><div className="flex h-full min-h-64 flex-col overflow-hidden rounded-[1.25rem] bg-[#0a493e]"><div className="flex items-center justify-between gap-3 px-4 py-3 text-white"><div><span className="block text-[7px] font-bold uppercase tracking-[.15em] text-[#9cebc8]">Location</span><strong className="mt-1 block line-clamp-1 text-xs">{place.name}</strong></div><span className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-xs">⌖</span></div><div className="relative flex-1 min-h-52"><iframe src={mapUrl} title={`Map of ${place.name}`} className="absolute inset-0 h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /></div></div></aside>
              </article>
            )
          })}
        </div>
      </section>
    </main>
  )
}

export default function DestinationsPage({ destinations, onBack }: DestinationsPageProps) {
  const [activeFilter, setActiveFilter] = useState<Filter>("All")
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<Destination | null>(null)
  const [aroundPageDestination, setAroundPageDestination] = useState<Destination | null>(null)
  const [nearbySelection, setNearbySelection] = useState<NearbyPlaceSelection | null>(null)
  const [mapSelectionName, setMapSelectionName] = useState(destinations[0]?.name ?? "Sri Lanka")
  const [touristMapOpen, setTouristMapOpen] = useState(false)
  const [touristMapZoom, setTouristMapZoom] = useState(1)
  const [mobileMapZoom, setMobileMapZoom] = useState(1)
  const [touristMapDrag, setTouristMapDrag] = useState({ x: 0, y: 0 })
  const [isTouristMapDragging, setIsTouristMapDragging] = useState(false)
  const touristMapDragRef = useRef({ active: false, startX: 0, startY: 0, startPanX: 0, startPanY: 0 })
  const touristMapCanvasRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const focusMobileMap = () => {
      const canvas = touristMapCanvasRef.current
      if (!canvas || !window.matchMedia("(max-width: 767px)").matches) return
      const point = touristMapOpen
        ? DESTINATION_TOURIST_MAP_POINTS.find((item) => item.destination === mapSelectionName)
        : null
      const x = point?.x ?? 50
      const y = point?.y ?? 50
      canvas.scrollTo({
        left: Math.max(0, (canvas.scrollWidth * x) / 100 - canvas.clientWidth / 2),
        top: Math.max(0, (canvas.scrollHeight * y) / 100 - canvas.clientHeight / 2),
        behavior: "smooth",
      })
    }

    const frame = window.requestAnimationFrame(focusMobileMap)
    window.addEventListener("resize", focusMobileMap)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener("resize", focusMobileMap)
    }
  }, [mapSelectionName, mobileMapZoom, touristMapOpen])

  useEffect(() => {
    if (!selected) return

    const previousOverflow = document.body.style.overflow
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null)
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", closeOnEscape)
    }
  }, [selected])

  const filteredDestinations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return destinations.filter((destination) => {
      const matchesFilter = activeFilter === "All" || getCategory(destination) === activeFilter
      const intelligence = PLACE_INTELLIGENCE[destination.name]
      const matchesQuery = !normalizedQuery ||
        `${destination.name} ${destination.type} ${destination.tag} ${intelligence?.district ?? ""} ${intelligence?.bestFor ?? ""} ${intelligence?.nearby.join(" ") ?? ""}`.toLowerCase().includes(normalizedQuery)
      return matchesFilter && matchesQuery
    })
  }, [activeFilter, destinations, query])

  const hero = destinations[0]
  const popularMapDestinations = POPULAR_MAP_NAMES
    .map((name) => destinations.find((destination) => destination.name === name))
    .filter((destination): destination is Destination => Boolean(destination))
  const mapSelection = destinations.find((destination) => destination.name === mapSelectionName) ?? hero
  const googleMapUrl = `https://www.google.com/maps?q=${encodeURIComponent(`${mapSelection.name}, Sri Lanka`)}&z=${mapSelection.name === "Sri Lanka" ? 8 : 11}&t=k&output=embed`
  const selectedCategory = selected ? getCategory(selected) : null
  const selectedGuide = selectedCategory ? DESTINATION_GUIDES[selectedCategory] : null
  const selectedIntel = selected ? PLACE_INTELLIGENCE[selected.name] : null
  const nearbyStory = nearbySelection ? getNearbyPlaceStory(nearbySelection.place, nearbySelection.parent) : null
  const nearbyParentIntel = nearbySelection ? PLACE_INTELLIGENCE[nearbySelection.parent.name] : null
  const nearbyHero = nearbySelection
    ? destinations.find((destination) => destination.name === nearbySelection.place)?.img ?? nearbySelection.parent.img
    : ""
  const nearbyMapUrl = nearbySelection
    ? `https://www.google.com/maps?q=${encodeURIComponent(`${nearbySelection.place}, ${nearbyParentIntel?.district ?? ""}, Sri Lanka`)}&z=13&t=k&output=embed`
    : ""
  const nearbyGallery = useMemo(() => {
    if (!nearbySelection) return []
    const parentCategory = getCategory(nearbySelection.parent)
    const exact = destinations.find((destination) => destination.name === nearbySelection.place)
    return [exact, nearbySelection.parent, ...destinations.filter((destination) => getCategory(destination) === parentCategory && destination.name !== nearbySelection.parent.name)]
      .filter((destination, index, list): destination is Destination => Boolean(destination) && list.findIndex((item) => item?.img === destination?.img) === index)
      .slice(0, 4)
  }, [destinations, nearbySelection])
  const relatedDestinations = selected
    ? destinations
      .filter((destination) => destination.name !== selected.name)
      .sort((a, b) => Number(getCategory(b) === selectedCategory) - Number(getCategory(a) === selectedCategory))
      .slice(0, 4)
    : []
  const smartTrip = SMART_TRIP_FACTS[mapSelection.name] ?? { distance: "Flexible", drive: "Your pace", mood: mapSelection.tag }
  const mapGuide = DESTINATION_GUIDES[getCategory(mapSelection)]
  const mapIntel = PLACE_INTELLIGENCE[mapSelection.name]
  const mapSelectionIndex = Math.max(0, popularMapDestinations.findIndex((destination) => destination.name === mapSelection.name))
  const selectedTouristMapPoint = DESTINATION_TOURIST_MAP_POINTS.find((point) => point.destination === mapSelection.name)
  const touristMapPanLimit = Math.max(0, (touristMapZoom - 1) * 50)
  const touristMapAutoTranslateX = touristMapOpen && selectedTouristMapPoint
    ? Math.max(-touristMapPanLimit, Math.min(touristMapPanLimit, touristMapZoom * (50 - selectedTouristMapPoint.x)))
    : 0
  const touristMapAutoTranslateY = touristMapOpen && selectedTouristMapPoint
    ? Math.max(-touristMapPanLimit, Math.min(touristMapPanLimit, touristMapZoom * (50 - selectedTouristMapPoint.y)))
    : 0
  const touristMapTranslateX = Math.max(-touristMapPanLimit, Math.min(touristMapPanLimit, touristMapAutoTranslateX + touristMapDrag.x))
  const touristMapTranslateY = Math.max(-touristMapPanLimit, Math.min(touristMapPanLimit, touristMapAutoTranslateY + touristMapDrag.y))

  const selectRelativeDestination = (direction: number) => {
    if (!popularMapDestinations.length) return
    const nextIndex = (mapSelectionIndex + direction + popularMapDestinations.length) % popularMapDestinations.length
    setMapSelectionName(popularMapDestinations[nextIndex].name)
  }

  const openSmartDestination = () => {
    setActiveFilter("All")
    setQuery(mapSelection.name)
    document.getElementById("destination-gallery")?.scrollIntoView({ behavior: "smooth" })
  }

  const focusTouristMapPlace = (destinationName: string) => {
    setTouristMapDrag({ x: 0, y: 0 })
    setMapSelectionName(destinationName)
    setTouristMapOpen(true)
    setTouristMapZoom(1.4)
    setMobileMapZoom((zoom) => Math.max(1.5, zoom))
  }

  const resetTouristMap = () => {
    setTouristMapDrag({ x: 0, y: 0 })
    setTouristMapOpen(false)
    setTouristMapZoom(1)
    setMobileMapZoom(1)
  }

  const beginTouristMapDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (window.matchMedia("(max-width: 767px)").matches) return
    if (touristMapZoom <= 1) return
    if (event.pointerType === "mouse" && event.button !== 0) return
    if ((event.target as HTMLElement).closest("button, aside, article, [data-map-ui]")) return
    event.currentTarget.setPointerCapture(event.pointerId)
    touristMapDragRef.current = {
      active: true,
      startX: event.clientX,
      startY: event.clientY,
      startPanX: touristMapDrag.x,
      startPanY: touristMapDrag.y,
    }
    setIsTouristMapDragging(true)
  }

  const moveTouristMapDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = touristMapDragRef.current
    if (!drag.active || touristMapZoom <= 1) return
    const bounds = event.currentTarget.getBoundingClientRect()
    const deltaX = ((event.clientX - drag.startX) / bounds.width) * 100
    const deltaY = ((event.clientY - drag.startY) / bounds.height) * 100
    const minX = -touristMapPanLimit - touristMapAutoTranslateX
    const maxX = touristMapPanLimit - touristMapAutoTranslateX
    const minY = -touristMapPanLimit - touristMapAutoTranslateY
    const maxY = touristMapPanLimit - touristMapAutoTranslateY
    setTouristMapDrag({
      x: Math.max(minX, Math.min(maxX, drag.startPanX + deltaX)),
      y: Math.max(minY, Math.min(maxY, drag.startPanY + deltaY)),
    })
  }

  const endTouristMapDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (touristMapDragRef.current.active && event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    touristMapDragRef.current.active = false
    setIsTouristMapDragging(false)
  }

  if (aroundPageDestination) {
    return <AroundPlacesPage destination={aroundPageDestination} destinations={destinations} onBack={() => { setAroundPageDestination(null); setSelected(aroundPageDestination) }} />
  }

  return (
    <main className="destinations-page min-h-screen bg-[#e7e3fb] text-[#0d0b1a]">
      <section id="destination-overview" className="destination-hero-v2 relative isolate min-h-screen scroll-mt-20 overflow-hidden pt-20 text-white">
        <img src={hero.img} alt="Sigiriya rock fortress rising above Sri Lanka's forest" className="absolute inset-0 -z-30 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-20 bg-[#031f1b]/65" />

        <div className="destination-hero-layout relative mx-auto grid min-h-[calc(100svh-5rem)] max-w-7xl grid-cols-1 px-5 pb-8 pt-6 sm:px-8 sm:pt-8 lg:grid-cols-[1.08fr_.92fr] lg:px-12">
          <div className="destination-hero-main flex min-w-0 flex-col justify-between">
            <button type="button" onClick={onBack} className="group flex w-fit items-center gap-3 rounded-full border border-white/20 bg-black/15 px-4 py-2 text-xs font-medium text-white backdrop-blur-xl transition hover:bg-white hover:text-[#064e3b]">
              <span className="transition-transform group-hover:-translate-x-1">←</span> Back to home
            </button>

            <div className="destination-hero-copy max-w-[48rem] py-9 sm:py-12 lg:py-8">
              <div className="mb-5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[#b9ffd5]">
                <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8ff1ba] opacity-60" /><span className="relative h-2 w-2 rounded-full bg-[#8ff1ba]" /></span>
                Your Sri Lanka begins here
              </div>
              <h1 className="max-w-4xl font-['Instrument_Serif'] text-[clamp(3.35rem,16vw,5.25rem)] font-normal leading-[.8] tracking-[-.052em] sm:text-[clamp(4.2rem,8.1vw,8.4rem)]">
                Come for a place.<br /><em className="text-[#c9f5d5]">Leave with a story.</em>
              </h1>
              <p className="mt-6 max-w-xl text-sm leading-6 text-white/72 sm:mt-8 sm:text-lg sm:leading-7">
                Wake above ancient kingdoms, follow elephants through golden grass, and end the day barefoot beside the Indian Ocean. This is not a list of places—it is the trip you will still talk about years from now.
              </p>

              <figure className="destination-mobile-vehicle" aria-label="Private Suzuki Every island travel vehicle">
                <div className="destination-mobile-vehicle__topline"><span>✦ Private island rides</span><small>Ready in Colombo</small></div>
                <div className="destination-mobile-vehicle__stage">
                  <img className="destination-mobile-vehicle__scenery" src="/assets/destination-mobile-road-art.png" alt="" aria-hidden="true" />
                  <span className="destination-mobile-vehicle__route">Colombo <i /> Anywhere</span>
                  <img className="destination-mobile-vehicle__model" src="/suzuki-every-3d-cutout.png" alt="Suzuki Every travel van" />
                  <span className="destination-mobile-vehicle__shadow" aria-hidden="true" />
                </div>
                <figcaption><strong>Your route. Your pace.</strong><span>Air-conditioned · Local driver · Flexible stops</span></figcaption>
              </figure>

              <div className="mt-8">
                <p className="mb-3 text-[9px] font-bold uppercase tracking-[.22em] text-white/45">Start with the feeling you want</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    ["Heritage", "Ancient wonder", "✦"],
                    ["Coast", "Ocean freedom", "≈"],
                    ["Highlands", "Mountain calm", "⌁"],
                    ["Wildlife", "Wild encounters", "◉"],
                  ].map(([filter, label, icon]) => (
                    <button
                      type="button"
                      key={filter}
                      onClick={() => {
                        setActiveFilter(filter as Filter)
                        document.getElementById("destination-gallery")?.scrollIntoView({ behavior: "smooth" })
                      }}
                      className="group flex items-center gap-2 rounded-full border border-white/18 bg-white/[.08] px-4 py-2.5 text-xs font-semibold text-white/78 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-[#b9ffd5]/70 hover:bg-[#b9ffd5] hover:text-[#063e34]"
                    >
                      <span className="text-[#b9ffd5] transition group-hover:text-[#063e34]">{icon}</span>{label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex max-w-2xl flex-col items-start justify-between gap-3 border-t border-white/18 py-5 text-[9px] font-bold uppercase tracking-[.2em] text-white/45 sm:flex-row sm:items-center sm:gap-5">
              <span>6.9271° N · 79.8612° E</span>
              <button type="button" onClick={() => document.getElementById("key-destinations-guide")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="flex items-center gap-3 text-white/75 transition hover:text-[#b9ffd5]">Explore destinations <span className="grid h-8 w-8 place-items-center rounded-full border border-white/20">↓</span></button>
            </div>
          </div>

          <div className="destination-hero-postcards pointer-events-none relative hidden lg:block" aria-hidden="true">
            {[destinations[1], destinations[2], destinations[4]].map((destination, index) => (
              <figure key={destination.name} className={`destination-hero-postcard destination-hero-postcard-${index + 1}`}>
                <img src={destination.img} alt="" />
                <div />
                <figcaption><small>0{index + 1} · {getCategory(destination)}</small><strong>{destination.name}</strong><span>{destination.tag}</span></figcaption>
              </figure>
            ))}
            <div className="destination-hero-note"><span>25</span><p>places.<br />One small island.</p></div>
          </div>
        </div>
      </section>

      <section id="destination-tourist-map" className="relative w-full scroll-mt-20 overflow-hidden bg-[#021d31] text-white shadow-[0_35px_100px_rgba(3,29,50,.35)]" aria-labelledby="destination-tourist-map-title">
        <div
          className={`mobile-map-shell destination-map-desktop relative min-h-[62rem] touch-pan-y overflow-hidden ${touristMapZoom > 1 ? (isTouristMapDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-default"}`}
          style={{ "--mobile-map-width": `${50 * mobileMapZoom}rem` } as CSSProperties}
          onPointerDown={beginTouristMapDrag}
          onPointerMove={moveTouristMapDrag}
          onPointerUp={endTouristMapDrag}
          onPointerCancel={endTouristMapDrag}
        >
          <div ref={touristMapCanvasRef} className={`mobile-map-canvas absolute inset-0 ${isTouristMapDragging ? "transition-none" : "transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)]"}`} style={{ transform: `translate3d(${touristMapTranslateX}%, ${touristMapTranslateY}%, 0) scale(${touristMapZoom})`, transformOrigin: "50% 50%" }}>
            <div className="mobile-map-image-stage">
              <img src={destinationAdventureMap} alt="Detailed illustrated Sri Lanka adventure map with destinations across the island" className="h-full w-full object-contain object-center" />
              <div className="absolute inset-0 bg-[#00182a]/5" />
              {DESTINATION_TOURIST_MAP_POINTS.map((point) => <button type="button" key={point.label} onClick={() => focusTouristMapPlace(point.destination)} aria-label={`Zoom to ${point.label} and show details`} className="map-hotspot absolute z-10 h-14 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-transparent outline-none focus-visible:ring-4 focus-visible:ring-white/70" style={{ left: `${point.x}%`, top: `${point.y}%` }}><span className="sr-only">{point.label}</span></button>)}
            </div>
          </div>

          <div className="mobile-map-swipe-hint" aria-hidden="true"><span>↔</span> Swipe to explore the full map</div>

          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#021725]/95 to-transparent lg:hidden" />
          <div className="mobile-map-ui relative z-30 grid min-h-[62rem] content-between gap-5 p-4 sm:p-6 lg:absolute lg:inset-0 lg:block lg:min-h-0 lg:p-0">
            <div className="mobile-map-controls" data-map-ui aria-label="Map zoom controls">
              <button type="button" onClick={() => setMobileMapZoom((zoom) => Math.max(1, Number((zoom - .25).toFixed(2))))} disabled={mobileMapZoom <= 1} aria-label="Zoom map out">−</button>
              <output aria-live="polite">{Math.round(mobileMapZoom * 100)}%</output>
              <button type="button" onClick={() => setMobileMapZoom((zoom) => Math.min(2, Number((zoom + .25).toFixed(2))))} disabled={mobileMapZoom >= 2} aria-label="Zoom map in">+</button>
              <button type="button" onClick={() => { setMobileMapZoom(1); setTouristMapOpen(false) }} aria-label="Fit the complete map on screen">Fit</button>
            </div>
            <aside className="destination-map-menu rounded-2xl border border-white/20 bg-[#031c2f]/88 p-4 shadow-2xl backdrop-blur-xl lg:absolute lg:p-4">
              <p className="text-xs font-semibold text-white/80 sm:text-sm">Explore Sri Lanka</p>
              <h2 id="destination-tourist-map-title" className="mt-1 text-3xl font-black leading-none sm:text-4xl lg:text-[clamp(1.3rem,2.1vw,2.2rem)]">Tourist Map</h2>
              <p className="mt-2 text-xs leading-5 text-white/65 lg:text-[10px] lg:leading-4 xl:text-xs xl:leading-5">Choose a destination to zoom into the island and reveal its travel details.</p>
              <div className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:max-h-[36rem] lg:flex-col lg:overflow-y-auto lg:pr-1">
                {DESTINATION_TOURIST_MAP_POINTS.map((point) => {
                  const isActive = touristMapOpen && mapSelection.name === point.destination
                  return <button type="button" key={point.label} onClick={() => focusTouristMapPlace(point.destination)} aria-pressed={isActive} className={`flex min-w-[12rem] shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-left transition lg:min-w-0 ${isActive ? "border-[#ffc25a] bg-[#173950] shadow-[0_0_18px_rgba(255,194,90,.6)]" : "border-white/20 bg-[#08253a]/90 hover:border-white/45"}`}>
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-xs font-black text-white" style={{ background: point.color }}>⌖</span>
                    <span className="min-w-0 flex-1 truncate text-xs font-bold xl:text-sm">{point.label}</span><span aria-hidden="true">›</span>
                  </button>
                })}
              </div>
            </aside>

            {touristMapOpen ? <article className="destination-map-details relative self-end overflow-hidden rounded-2xl border border-white/25 bg-[#04243a]/94 p-3 shadow-2xl backdrop-blur-xl lg:absolute lg:p-4" aria-live="polite">
              <button type="button" onClick={resetTouristMap} className="absolute right-5 top-5 z-10 grid h-8 w-8 place-items-center rounded-full border border-white/25 bg-[#021827]/75 text-sm text-white backdrop-blur hover:bg-white hover:text-[#06223a]" aria-label="Close destination details">×</button>
              <img key={mapSelection.img} src={mapSelection.img} alt={mapSelection.name} className="h-40 w-full rounded-xl object-cover lg:h-[clamp(6.5rem,11vw,10rem)]" />
              <div className="mt-3 flex items-center gap-2"><span className="text-xl text-[#ffbf4a]">⌖</span><h3 className="min-w-0 truncate text-2xl font-black lg:text-[clamp(1.1rem,1.7vw,1.8rem)]">{mapSelection.name}</h3></div>
              <p className="mt-1 text-xs text-white/55">⌖ {mapIntel?.district ?? "Sri Lanka"} District</p>
              <p className="mt-2 text-xs font-bold text-[#ffd05e]">★ 4.9 <span className="font-normal text-white/60">traveller rating</span></p>
              <p className="mt-3 text-xs leading-5 text-white/75 lg:text-[10px] lg:leading-4 xl:text-xs xl:leading-5">{mapGuide.intro}</p>
              <div className="mt-3 grid grid-cols-2 gap-1"><span className="rounded-lg border border-white/15 bg-white/[.04] px-2 py-2 text-center text-[9px] font-bold">{getCategory(mapSelection)}</span><span className="rounded-lg border border-white/15 bg-white/[.04] px-2 py-2 text-center text-[9px] font-bold">{mapIntel?.bestFor ?? mapSelection.tag}</span></div>
              <button type="button" onClick={openSmartDestination} className="mt-4 w-full rounded-full bg-gradient-to-r from-[#ffad19] to-[#f23f6d] px-4 py-3 text-xs font-black text-white shadow-lg">Explore {mapSelection.name} →</button>
            </article> : <div className="destination-map-welcome self-end rounded-2xl border border-white/20 bg-[#032139]/80 p-4 shadow-xl backdrop-blur-xl lg:absolute"><p className="text-[9px] font-black uppercase tracking-[.2em] text-[#60bdf3]">Interactive map</p><p className="mt-2 text-sm leading-6 text-white/75">Choose a destination from the list or select a marker on the island to see its travel details.</p></div>}

            <div data-map-ui className="destination-map-help pointer-events-none absolute hidden items-center gap-2 rounded-full border border-white/20 bg-[#031b2d]/80 px-4 py-2 text-[10px] font-bold uppercase tracking-[.16em] text-white/75 shadow-xl backdrop-blur lg:flex">
              <span className="text-base text-[#60bdf3]">↔</span> Drag map to move
            </div>

            <div className="destination-map-zoom absolute hidden overflow-hidden rounded-xl border border-white/25 bg-[#031b2d]/90 shadow-xl backdrop-blur lg:flex">
              <button type="button" onClick={resetTouristMap} className="map-fit-button" aria-label="Fit the complete island map on screen"><span aria-hidden="true">⌖</span> Fit map</button>
              <button type="button" onClick={() => setTouristMapZoom((zoom) => Math.max(.82, Number((zoom - .12).toFixed(2))))} aria-label="Zoom map out">−</button>
              <output aria-live="polite" aria-label="Current map zoom">{Math.round(touristMapZoom * 100)}%</output>
              <button type="button" onClick={() => setTouristMapZoom((zoom) => Math.min(2, Number((zoom + .12).toFixed(2))))} aria-label="Zoom map in">+</button>
            </div>
          </div>
        </div>
      </section>

      <section id="key-destinations-guide" className="scroll-mt-20 bg-gradient-to-b from-white to-gray-50 px-4 py-20 sm:px-8 lg:px-12" aria-labelledby="key-destinations-guide-title">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 space-y-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/75 px-6 py-2 shadow-[0_8px_32px_rgba(31,38,135,.12)] backdrop-blur-xl">
              <span className="text-xl text-[#FFD700]">⌖</span><span className="text-sm uppercase tracking-wider text-[#0A2342]">Travel Destinations</span>
            </div>
            <h2 id="key-destinations-guide-title" className="bg-gradient-to-r from-[#0A2342] via-[#1a4a7a] to-[#0A2342] bg-clip-text text-4xl font-medium text-transparent md:text-6xl">
              Find your next <em className="not-italic">unforgettable place.</em>
            </h2>
            <p className="mx-auto max-w-2xl text-base text-gray-600 md:text-xl">Key Destinations Guide · Explore the beautiful places of Sri Lanka</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
            <aside className="lg:col-span-1">
              <div className="rounded-2xl border-2 border-gray-200 bg-white p-4 shadow-xl md:p-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-medium text-[#0A2342] md:text-xl"><span className="text-[#FFD700]">✦</span>Select Destination</h3>
                <div className="flex gap-3 overflow-x-auto pb-3 lg:block lg:max-h-[720px] lg:space-y-2 lg:overflow-y-auto lg:pr-2">
                  {popularMapDestinations.map((destination,index)=>{
                    const isActive=destination.name===mapSelection.name
                    return <button type="button" key={destination.name} onClick={()=>setMapSelectionName(destination.name)} className={`w-[11rem] shrink-0 rounded-xl p-3 text-left transition duration-300 lg:w-full lg:p-4 ${isActive?"bg-gradient-to-br from-[#FFD700] to-[#FFA500] shadow-lg lg:scale-[1.02]":"bg-gray-50 hover:bg-gray-100"}`}>
                      <div className="flex items-center gap-3"><span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl"><img src={destination.img} alt="" className="h-full w-full object-cover"/></span><span className="min-w-0"><small className={`block text-[9px] font-bold uppercase tracking-wider ${isActive?"text-[#0A2342]/60":"text-gray-400"}`}>{String(index+1).padStart(2,"0")} · {getCategory(destination)}</small><strong className={`mt-1 block truncate text-sm ${isActive?"text-[#0A2342]":"text-gray-700"}`}>{destination.name}</strong><span className={`block truncate text-xs ${isActive?"text-[#0A2342]/70":"text-gray-500"}`}>{destination.tag}</span></span></div>
                    </button>
                  })}
                </div>
              </div>
            </aside>

            <article className="overflow-hidden rounded-2xl border-2 border-[#FFD700]/30 bg-white shadow-2xl lg:col-span-2">
              <div className="group relative h-72 overflow-hidden md:h-96">
                <img key={mapSelection.name} src={mapSelection.img} alt={mapSelection.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"/>
                <div className="absolute inset-x-0 bottom-0 p-5 text-white md:p-8">
                  <div className="mb-3 flex flex-wrap items-center gap-2"><span className="rounded-full bg-[#FFD700] px-3 py-1 text-xs font-bold text-[#0A2342]">{mapSelection.tag}</span><span className="rounded-full border border-white/25 bg-black/20 px-3 py-1 text-xs backdrop-blur-xl">{getCategory(mapSelection)}</span></div>
                  <h3 className="text-4xl font-medium md:text-5xl">{mapSelection.name}</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-white/85 md:text-base">{mapGuide.intro}</p>
                </div>
              </div>

              <div className="space-y-7 p-5 md:p-8">
                <div className="grid gap-3 sm:grid-cols-3 md:gap-4">
                  <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-4"><span className="text-blue-600">◷</span><div><small className="block text-xs text-gray-500">Best Time</small><strong className="text-sm font-medium text-gray-900">{mapGuide.bestTime}</strong></div></div>
                  <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-white p-4"><span className="text-green-600">◴</span><div><small className="block text-xs text-gray-500">Duration</small><strong className="text-sm font-medium text-gray-900">{mapGuide.stay}</strong></div></div>
                  <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-4"><span className="text-amber-600">⌖</span><div><small className="block text-xs text-gray-500">From Colombo</small><strong className="text-sm font-medium text-gray-900">{smartTrip.distance} · {smartTrip.drive}</strong></div></div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div><h4 className="mb-3 flex items-center gap-2 text-lg font-medium text-[#0A2342]"><span className="text-[#FFD700]">★</span>Highlights</h4><div className="space-y-2">{mapGuide.highlights.map((highlight)=><div key={highlight} className="flex items-start gap-2 rounded-lg p-2 text-sm text-gray-700 transition hover:bg-gray-50"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#FFD700]"/>{highlight}</div>)}</div></div>
                  <div><h4 className="mb-3 flex items-center gap-2 text-lg font-medium text-[#0A2342]"><span className="text-[#FFD700]">◎</span>Nearby Places</h4><div className="flex flex-wrap gap-2">{(mapIntel?.nearby??[mapSelection.type,mapSelection.tag]).map((place)=><button type="button" key={place} onClick={()=>setNearbySelection({parent:mapSelection,place})} className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-0.5">{place}</button>)}</div></div>
                </div>

                <div className="rounded-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-white p-5"><h4 className="mb-2 flex items-center gap-2 text-lg font-medium text-green-800"><span>ⓘ</span>Travel Tip</h4><p className="text-sm leading-6 text-gray-700">{mapIntel?.routeNote??`Allow enough time to experience ${mapSelection.name} at a relaxed pace.`}</p></div>

                <div className="overflow-hidden rounded-2xl border-2 border-[#FFD700]/30 bg-white shadow-xl">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-gradient-to-r from-[#0A2342] to-[#1a4a7a] px-5 py-4 text-white">
                    <div><p className="text-[9px] font-bold uppercase tracking-[.2em] text-[#FFD700]">Satellite location map</p><h4 className="mt-1 text-xl font-medium">{mapSelection.name}, Sri Lanka</h4></div>
                    <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white/80">⌖ Live location</span>
                  </div>
                  <div className="relative h-72 bg-[#dce9e4] sm:h-[22rem]">
                    <iframe key={`guide-map-${mapSelection.name}`} src={googleMapUrl} title={`Satellite map of ${mapSelection.name}, Sri Lanka`} className="absolute inset-0 h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen/>
                    <div className="pointer-events-none absolute bottom-4 left-4 rounded-full border border-white/30 bg-[#041f1d]/75 px-4 py-2 text-[10px] font-bold uppercase tracking-[.16em] text-white shadow-lg backdrop-blur-xl">Satellite view · {mapSelection.name}</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-5"><p className="text-sm text-gray-500">Best for <strong className="text-gray-700">{mapIntel?.bestFor??smartTrip.mood}</strong></p><button type="button" onClick={openSmartDestination} className="rounded-lg bg-[#FFD700] px-6 py-3 font-semibold text-[#0A2342] shadow-lg transition hover:bg-[#FFA500]">Explore {mapSelection.name} →</button></div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="living-map-section relative isolate hidden min-h-[calc(100svh-4rem)] scroll-mt-16 overflow-hidden bg-[#041d1b] text-white lg:h-[calc(100svh-4rem)] lg:min-h-0">
        <img
          key={`background-${mapSelection.name}`}
          src={mapSelection.img}
          alt=""
          aria-hidden="true"
          className="living-map-backdrop pointer-events-none absolute inset-0 h-full w-full scale-105 object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,rgba(2,20,19,.96)_0%,rgba(2,25,23,.87)_38%,rgba(3,23,22,.48)_72%,rgba(3,20,19,.65)_100%),linear-gradient(0deg,rgba(2,17,16,.94)_0%,transparent_62%)]" />

        <div className="relative min-h-[calc(100svh-4rem)] w-full lg:h-full lg:min-h-0">
          <div className="grid min-h-[calc(100svh-4rem)] w-full lg:h-full lg:min-h-0 lg:grid-cols-[minmax(21rem,37%)_minmax(0,63%)] lg:items-stretch">
            <aside className="flex min-h-[calc(100svh-4rem)] flex-col overflow-hidden border-b border-white/15 bg-[#052724]/84 shadow-[0_35px_90px_rgba(0,0,0,.34)] backdrop-blur-2xl lg:h-full lg:min-h-0 lg:border-b-0 lg:border-r">
              <div className="border-b border-white/10 p-6 sm:p-8">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <p className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.28em] text-[#a5f3cf]">
                    <span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#62e9ad] opacity-60" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#62e9ad]" /></span>
                    Island intelligence
                  </p>
                  <span className="rounded-full border border-[#7af0bd]/20 bg-[#7af0bd]/10 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.16em] text-[#b9ffd5]">Live explorer</span>
                </div>
                <h2 className="font-['Instrument_Serif'] text-[clamp(3rem,4.4vw,5rem)] font-normal leading-[.86] tracking-[-0.045em]">
                  Find your next<br /><em className="bg-gradient-to-r from-[#baffdc] via-[#8eeec9] to-[#8ecfff] bg-clip-text text-transparent">unforgettable place.</em>
                </h2>
                <div className="mt-5 flex items-center gap-3">
                  <span className="text-[9px] font-bold uppercase tracking-[.2em] text-white/35">Explore</span>
                  <span className="h-px flex-1 bg-white/10"><span className="block h-px bg-gradient-to-r from-[#7af0bd] to-transparent" style={{ width: `${((mapSelectionIndex + 1) / popularMapDestinations.length) * 100}%` }} /></span>
                  <span className="text-[10px] font-semibold tabular-nums text-white/60">{String(mapSelectionIndex + 1).padStart(2, "0")} / {String(popularMapDestinations.length).padStart(2, "0")}</span>
                </div>
              </div>

              <div className="relative mx-3 mt-3 min-h-[13.5rem] overflow-hidden rounded-[1.5rem] border border-white/15 bg-[#072c28] shadow-[0_20px_55px_rgba(0,0,0,.24)]" aria-live="polite">
                <img key={`spotlight-${mapSelection.name}`} src={mapSelection.img} alt="" className="living-map-spotlight absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,26,24,.04),rgba(3,26,24,.94))]" />
                <div className="relative flex min-h-[13.5rem] flex-col justify-between p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="w-fit rounded-full border border-white/20 bg-black/20 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-xl">Smart pick</span>
                    <span className="rounded-full border border-white/15 bg-black/20 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[.16em] text-[#b9ffd5] backdrop-blur-xl">{smartTrip.mood}</span>
                  </div>
                  <div>
                    <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.2em] text-[#a9f1d0]">{getCategory(mapSelection)} · Selected scene</p>
                    <h3 className="font-['Instrument_Serif'] text-4xl leading-none">{mapSelection.name}</h3>
                    <p className="mt-2 line-clamp-1 text-xs text-white/62">{mapSelection.tag} · {mapSelection.type}</p>
                    <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/12 pt-3">
                      <div><span className="block text-[8px] font-bold uppercase tracking-[.15em] text-white/35">From Colombo</span><strong className="mt-1 block text-xs text-white/90">{smartTrip.distance}</strong></div>
                      <div><span className="block text-[8px] font-bold uppercase tracking-[.15em] text-white/35">Drive</span><strong className="mt-1 block text-xs text-white/90">{smartTrip.drive}</strong></div>
                      <div><span className="block text-[8px] font-bold uppercase tracking-[.15em] text-white/35">Travel style</span><strong className="mt-1 block truncate text-xs text-white/90">Private</strong></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between px-5 pb-1 pt-5">
                <p className="text-[9px] font-bold uppercase tracking-[.22em] text-white/45">Recommended places</p>
                <span className="text-[9px] font-semibold text-white/30">Tap to explore</span>
              </div>
              <div className="destination-map-list flex-1 overflow-y-auto p-3">
                {popularMapDestinations.map((destination, index) => {
                  const isActive = destination.name === mapSelection.name
                  return (
                    <button
                      type="button"
                      key={destination.name}
                      onClick={() => setMapSelectionName(destination.name)}
                      aria-pressed={isActive}
                      className={`group relative flex w-full items-center gap-3 rounded-2xl border p-2.5 text-left transition duration-300 ${isActive ? "border-[#b9ffd5]/70 bg-white text-[#073d33] shadow-[0_14px_35px_rgba(0,0,0,.22)]" : "border-transparent text-white hover:translate-x-1 hover:border-white/10 hover:bg-white/8"}`}
                    >
                      {isActive && <span className="absolute -left-px top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-[#4ee5a3]" />}
                      <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                        <img src={destination.img} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                        <span className="absolute inset-0 bg-black/10" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={`block text-[8px] font-bold uppercase tracking-[0.16em] ${isActive ? "text-[#07856f]" : "text-white/40"}`}>{String(index + 1).padStart(2, "0")} · {getCategory(destination)}</span>
                        <strong className="mt-1 block truncate text-sm font-semibold">{destination.name}</strong>
                        <small className={`block truncate text-[11px] ${isActive ? "text-[#55736b]" : "text-white/45"}`}>{destination.type}</small>
                      </span>
                      <span className={`transition group-hover:translate-x-1 ${isActive ? "rounded-full bg-[#dff7e8] px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-[#07856f]" : "text-lg text-white/30"}`}>{isActive ? "Viewing" : "→"}</span>
                    </button>
                  )
                })}
              </div>
            </aside>

            <div className="relative min-h-[calc(100svh-4rem)] overflow-hidden bg-[#153f38] shadow-[0_40px_110px_rgba(0,0,0,.38)] lg:h-full lg:min-h-0">
              <iframe
                key={mapSelection.name}
                src={googleMapUrl}
                title={`Google satellite map of ${mapSelection.name}`}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <div className="pointer-events-none absolute inset-x-5 top-5 flex items-center justify-between gap-4 sm:inset-x-6">
                <div className="flex items-center gap-3 rounded-full border border-white/25 bg-[#041f1d]/72 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white shadow-[0_12px_30px_rgba(0,0,0,.22)] backdrop-blur-2xl">
                  <span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8ff0aa] opacity-60" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#8ff0aa]" /></span>
                  Satellite intelligence
                </div>
                <div className="hidden items-center gap-2 rounded-full border border-white/15 bg-[#041f1d]/60 px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/60 backdrop-blur-2xl sm:flex">
                  <span>{getCategory(mapSelection)}</span><span className="h-1 w-1 rounded-full bg-[#6ee7b7]" /><span>Sri Lanka</span>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(1,18,17,.12)_0%,transparent_28%,transparent_60%,rgba(1,18,17,.5)_100%)]" />
              <div className="pointer-events-auto absolute inset-x-4 bottom-4 overflow-hidden rounded-[1.5rem] border border-white/18 bg-[#031c1a]/72 p-5 shadow-[0_24px_65px_rgba(0,0,0,.4)] backdrop-blur-2xl sm:inset-x-6 sm:bottom-6 sm:p-6">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                  <div>
                    <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.22em] text-[#a7e7c3]">Smart destination · {getCategory(mapSelection)}</p>
                    <h3 className="font-['Instrument_Serif'] text-5xl leading-none sm:text-6xl">{mapSelection.name}</h3>
                    <p className="mt-2 text-xs text-white/55 sm:text-sm">{mapSelection.tag} · {mapSelection.type}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="mr-2 hidden gap-5 border-r border-white/12 pr-5 md:flex">
                      <div><span className="block text-[8px] font-bold uppercase tracking-[.16em] text-white/35">Distance</span><strong className="mt-1 block text-sm">{smartTrip.distance}</strong></div>
                      <div><span className="block text-[8px] font-bold uppercase tracking-[.16em] text-white/35">Drive</span><strong className="mt-1 block text-sm">{smartTrip.drive}</strong></div>
                    </div>
                    <button type="button" onClick={() => selectRelativeDestination(-1)} aria-label="Previous destination" className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/[.07] text-white transition hover:bg-white hover:text-[#063e34]">←</button>
                    <button type="button" onClick={() => selectRelativeDestination(1)} aria-label="Next destination" className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/[.07] text-white transition hover:bg-white hover:text-[#063e34]">→</button>
                    <button type="button" onClick={openSmartDestination} className="ml-1 flex h-11 items-center gap-3 rounded-full bg-[#b9ffd5] px-5 text-[10px] font-bold uppercase tracking-[.16em] text-[#063e34] transition hover:-translate-y-0.5 hover:bg-white">Open travel guide <span>↗</span></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="destination-smart-ride" className="transport-showcase is-visible destination-smart-ride scroll-mt-20" aria-labelledby="destination-smart-ride-title">
        <div
          className="transport-showcase-canvas"
          onPointerMove={(event) => {
            const scene = event.currentTarget
            const bounds = scene.getBoundingClientRect()
            const x = (event.clientX - bounds.left) / bounds.width
            const y = (event.clientY - bounds.top) / bounds.height
            scene.style.setProperty("--scene-ry", `${(x - 0.5) * 7}deg`)
            scene.style.setProperty("--scene-rx", `${(0.5 - y) * 4}deg`)
            scene.style.setProperty("--pointer-x", `${x * 100}%`)
            scene.style.setProperty("--pointer-y", `${y * 100}%`)
          }}
          onPointerLeave={(event) => {
            event.currentTarget.style.setProperty("--scene-rx", "0deg")
            event.currentTarget.style.setProperty("--scene-ry", "0deg")
            event.currentTarget.style.setProperty("--pointer-x", "66%")
            event.currentTarget.style.setProperty("--pointer-y", "35%")
          }}
        >
          <div className="transport-showcase-sky" aria-hidden="true">
            <span className="transport-showcase-sun" />
            <span className="transport-showcase-cloud transport-showcase-cloud-one" />
            <span className="transport-showcase-cloud transport-showcase-cloud-two" />
          </div>
          <div className="transport-showcase-mountains" aria-hidden="true"><i /><i /><i /></div>
          <div className="transport-showcase-palms" aria-hidden="true"><i /><i /><i /><i /></div>
          <div className="transport-showcase-road" aria-hidden="true"><div className="transport-road-lines"><i /><i /><i /><i /><i /></div></div>

          <div className="transport-showcase-copy">
            <p className="transport-showcase-eyebrow"><i aria-hidden="true" /> Smart destination ride</p>
            <h2 id="destination-smart-ride-title">Plan your tour.<br /><em>With us.</em></h2>
            <p className="transport-showcase-description">
              Meet your private Suzuki Every—air-conditioned, locally driven, and ready to turn the road to {mapSelection.name} into part of the story.
            </p>
            <div className="smart-route-chips" aria-label="Choose a smart route">
              {popularMapDestinations.slice(0, 5).map((destination) => (
                <button type="button" key={destination.name} className={destination.name === mapSelection.name ? "is-active" : ""} onClick={() => setMapSelectionName(destination.name)}>
                  {destination.name}
                </button>
              ))}
            </div>
            <div className="transport-showcase-route" aria-label={`Example route from Colombo to ${mapSelection.name}`}>
              <span><b>01</b> Colombo</span><i><strong /></i><span><b>02</b> {mapSelection.name}</span>
            </div>
            <button type="button" className="transport-showcase-cta" onClick={openSmartDestination}>
              Explore {mapSelection.name} <span aria-hidden="true">↗</span>
            </button>
          </div>

          <div className="transport-vehicle-stage" aria-label="Animated white Suzuki Every van">
            <div className="transport-vehicle-shadow" aria-hidden="true" />
            <div className="transport-vehicle-bob">
              <div className="transport-vehicle-asset">
                <img src="/suzuki-every-3d-cutout.png" alt="White Suzuki Every compact travel van" loading="lazy" />
                <span className="transport-vehicle-wheel transport-vehicle-wheel-front" aria-hidden="true"><i /></span>
                <span className="transport-vehicle-wheel transport-vehicle-wheel-rear" aria-hidden="true"><i /></span>
              </div>
            </div>
            <span className="transport-vehicle-speed transport-vehicle-speed-one" aria-hidden="true" />
            <span className="transport-vehicle-speed transport-vehicle-speed-two" aria-hidden="true" />
            <span className="transport-vehicle-speed transport-vehicle-speed-three" aria-hidden="true" />
          </div>

          <div className="transport-showcase-specs" aria-label="Smart route information">
            <span><i>{smartTrip.distance}</i><b>Distance</b></span>
            <span><i>{smartTrip.drive}</i><b>Drive</b></span>
            <span><i>AC</i><b>{smartTrip.mood}</b></span>
          </div>
          <div className="transport-showcase-status"><i aria-hidden="true" /> Live route · {mapSelection.name}</div>
          <div className="transport-showcase-glare" aria-hidden="true" />
        </div>
      </section>

      <section id="destination-gallery" className="relative z-10 mx-auto max-w-[1600px] scroll-mt-20 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <header className="mb-12 grid gap-8 lg:grid-cols-[1fr_23rem] lg:items-end">
          <div>
            <p className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-[#07856f]"><span className="h-px w-10 bg-[#07856f]/45" /> Curated island gallery</p>
            <h2 className="max-w-3xl font-['Instrument_Serif'] text-[clamp(3rem,6vw,6rem)] font-normal leading-[.88] tracking-[-0.035em]">
              Go where the island <em className="text-[#07856f]">moves you.</em>
            </h2>
          </div>
          <div className="border-l border-[#0a5b49]/20 pl-5">
            <p className="text-sm leading-6 text-[#47675f]">Browse the gallery and open any destination for its best season, signature experiences and nearby places worth adding to your route.</p>
            <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#07856f]">Select a photograph to explore ↗</p>
          </div>
        </header>

        <div className="mb-8 grid grid-cols-2 gap-2 lg:grid-cols-4">
          {[
            ["8", "UNESCO properties", "Culture + nature"],
            ["25", "Island districts", "North to south"],
            ["100+", "Places connected", "Main + nearby"],
            ["5", "Travel moods", "Find your rhythm"],
          ].map(([value, label, note]) => (
            <div key={label} className="group rounded-[1.35rem] border border-[#0a5b49]/10 bg-white/65 p-4 shadow-[0_10px_35px_rgba(8,61,50,.05)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white sm:p-5">
              <div className="flex items-start justify-between gap-3"><strong className="font-['Instrument_Serif'] text-4xl font-normal leading-none text-[#0a5b49] sm:text-5xl">{value}</strong><span className="mt-1 h-2 w-2 rounded-full bg-[#ef956c] ring-4 ring-[#ef956c]/12" /></div>
              <p className="mt-3 text-[10px] font-bold uppercase tracking-[.16em] text-[#204f44]">{label}</p>
              <p className="mt-1 text-[10px] text-[#71877f]">{note}</p>
            </div>
          ))}
        </div>

        <div className="sticky top-[64px] z-30 mb-12 rounded-[1.4rem] border border-[#0a5b49]/10 bg-[#f8fbf6]/90 p-2 shadow-[0_18px_60px_rgba(8,61,50,.1)] backdrop-blur-xl">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
            <label className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl bg-white px-4 py-3 text-[#55736b] shadow-sm">
              <SearchIcon />
              <span className="sr-only">Search destinations</span>
              <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a place, mood or landscape..." className="w-full bg-transparent text-sm text-[#083d32] outline-none placeholder:text-[#708a83]" />
              {query && <button type="button" onClick={() => setQuery("")} className="text-xs font-bold">✕</button>}
            </label>
            <div className="flex gap-1 overflow-x-auto p-1" aria-label="Filter destinations">
              {FILTERS.map((filter) => (
                <button type="button" key={filter} onClick={() => setActiveFilter(filter)} aria-pressed={activeFilter === filter} className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-semibold transition ${activeFilter === filter ? "bg-[#074d3f] text-white shadow-lg" : "text-[#4f6e65] hover:bg-[#e5f1e8]"}`}>
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#668078]">{String(filteredDestinations.length).padStart(2, "0")} places in the gallery</p>
          <span className="ml-5 h-px flex-1 bg-[#0a5b49]/10" />
        </div>

        {filteredDestinations.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {filteredDestinations.map((destination, index) => {
              const category = getCategory(destination)
              const guide = DESTINATION_GUIDES[category]
              const intelligence = PLACE_INTELLIGENCE[destination.name]
              return (
                <button type="button" key={destination.name} onClick={() => setSelected(destination)} aria-label={`Open full guide to ${destination.name}`} className="group flex min-h-[37rem] w-full flex-col overflow-hidden rounded-[1.8rem] border border-[#0a5b49]/10 bg-white text-left shadow-[0_16px_45px_rgba(8,61,50,.07)] outline-none ring-[#ff9a6c] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_70px_rgba(8,61,50,.14)] focus-visible:ring-4">
                  <div className="relative min-h-[18rem] overflow-hidden bg-[#16483e]">
                    <img src={destination.img} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,35,29,.02),rgba(3,35,29,.58))]" />
                    <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5">
                      <span className="rounded-full border border-white/35 bg-[#062f28]/25 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-xl">{destination.tag}</span>
                      <span className="font-['Instrument_Serif'] text-2xl text-white/80">{String(index + 1).padStart(2, "0")}</span>
                    </div>
                    <div className="absolute inset-x-5 bottom-5 flex items-center justify-between gap-3 text-[9px] font-bold uppercase tracking-[.16em] text-white/75">
                      <span>{intelligence?.district ?? "Sri Lanka"} district</span><span className="rounded-full border border-white/20 bg-black/15 px-2.5 py-1 backdrop-blur-lg">{category}</span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <div className="mb-4 flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.18em] text-[#07856f]"><span className="h-px w-8 bg-[#07856f]/40" /> {intelligence?.bestFor ?? destination.type}</div>
                      <h3 className="font-['Instrument_Serif'] text-[clamp(2.7rem,3.2vw,3.8rem)] font-normal leading-[.84] tracking-[-.04em] text-[#103f35]">{destination.name}</h3>
                      <p className="mt-4 line-clamp-2 text-sm leading-6 text-[#60766f]">{intelligence?.routeNote ?? guide.intro}</p>

                      <div className="mt-5">
                        <p className="mb-2 text-[8px] font-bold uppercase tracking-[.18em] text-[#80948d]">Explore nearby</p>
                        <div className="flex flex-wrap gap-1.5">
                          {intelligence?.nearby.slice(0, 3).map((place) => <span key={place} className="rounded-full bg-[#eaf2eb] px-2.5 py-1 text-[9px] font-semibold text-[#46675e]">{place}</span>)}
                          {intelligence && <span className="rounded-full bg-[#0a5b49] px-2.5 py-1 text-[9px] font-bold text-white">+{intelligence.nearby.length}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 flex items-center justify-between gap-5 border-t border-[#0a5b49]/10 pt-4">
                      <div className="flex gap-4 text-[8px] font-bold uppercase tracking-[.13em] text-[#7a8d86]"><span>Best · {guide.bestTime}</span><span>Stay · {guide.stay}</span></div>
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#0a5b49] text-white shadow-lg transition duration-300 group-hover:rotate-45 group-hover:bg-[#ef956c] group-hover:text-[#123f35]">↗</span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-[#0a5b49]/25 px-6 py-24 text-center">
            <span className="mb-5 block text-4xl">⌁</span>
            <h3 className="font-['Instrument_Serif'] text-4xl">No places found</h3>
            <p className="mt-3 text-sm text-[#638078]">Try a different search or explore all destinations.</p>
            <button type="button" onClick={() => { setQuery(""); setActiveFilter("All") }} className="mt-6 rounded-full bg-[#074d3f] px-5 py-2.5 text-xs font-bold text-white">Show all places</button>
          </div>
        )}
      </section>

      <section id="destination-discovery" className="mx-auto max-w-7xl scroll-mt-20 px-5 pb-24 sm:px-8 lg:px-12">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#063e34] px-6 py-14 text-white sm:px-10 lg:px-16 lg:py-20">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#69d790]/20 blur-3xl" />
          <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-[#9fe2b3]">Need a human compass?</p>
              <h2 className="max-w-3xl font-['Instrument_Serif'] text-[clamp(3rem,6vw,5.5rem)] font-normal leading-[.9]">Let the island surprise you.</h2>
            </div>
            <button type="button" onClick={onBack} className="w-fit rounded-full bg-white px-6 py-3 text-sm font-bold text-[#064e3b] transition hover:-translate-y-1">Plan my journey ↗</button>
          </div>
        </div>
      </section>

      {selected && (
        <div className="fixed inset-x-0 bottom-0 top-[4.1rem] z-[80] flex items-center justify-center overflow-hidden bg-[#031d19]/86 p-2 backdrop-blur-md sm:p-4 lg:p-5" role="dialog" aria-modal="true" aria-label={`${selected.name} destination guide`} onMouseDown={(event) => { if (event.currentTarget === event.target) setSelected(null) }}>
          <article key={selected.name} className="relative max-h-full w-full max-w-6xl overflow-y-auto overscroll-contain rounded-[1.5rem] bg-[#f4f6ef] shadow-[0_40px_120px_rgba(0,0,0,.45)] sm:rounded-[2rem] lg:h-[min(82dvh,48rem)] lg:overflow-hidden lg:rounded-[2.25rem]">
            <button type="button" onClick={() => setSelected(null)} className="absolute right-4 top-4 z-20 grid h-11 w-11 place-items-center rounded-full border border-white/50 bg-white/92 text-[#063e34] shadow-xl transition hover:rotate-90 sm:right-6 sm:top-6" aria-label="Close destination guide">✕</button>

            <div className="grid lg:h-full lg:grid-cols-[.94fr_1.06fr]">
              <div className="relative min-h-[20rem] overflow-hidden bg-[#123f35] sm:min-h-[25rem] lg:min-h-0">
                <img src={selected.img} alt={`Beautiful view of ${selected.name}`} className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,28,24,.12)_20%,rgba(3,28,24,.34)_55%,rgba(3,28,24,.92)_100%)]" />
                <div className="absolute left-6 top-6 flex items-center gap-2 sm:left-8 sm:top-8">
                  <span className="rounded-full border border-white/30 bg-black/15 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-xl">{selected.tag}</span>
                  <span className="rounded-full border border-white/20 bg-black/15 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-white/75 backdrop-blur-xl">Sri Lanka</span>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-10 lg:p-12">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-[#b4f3d0]">{selectedCategory} · {selected.type}</p>
                  <h2 className="break-words font-['Instrument_Serif'] text-[clamp(3.4rem,6vw,6.25rem)] leading-[.8] tracking-[-.045em]">{selected.name}</h2>
                  <div className="mt-7 flex items-center gap-4 border-t border-white/20 pt-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/65">
                    <span>Island destination guide</span><span className="h-1 w-1 rounded-full bg-[#9cebc8]" /><span>Curated locally</span>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-9 lg:h-full lg:overflow-y-auto lg:p-10 xl:p-12">
                <div className="mb-8 flex items-center justify-between gap-5 border-b border-[#0a5b49]/12 pb-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#07856f]">Everything to know</p>
                  <span className="text-[10px] font-semibold text-[#758a83]">01 / Destination</span>
                </div>

                <p className="font-['Instrument_Serif'] text-3xl leading-[1.08] tracking-[-.02em] text-[#123f35] sm:text-4xl">{selectedGuide?.intro}</p>
                <p className="mt-5 text-sm leading-7 text-[#5a716a]">{selectedIntel?.routeNote ?? `Known for ${selected.tag.toLowerCase()}, ${selected.name} brings together beautiful scenery, local character and memorable island experiences.`} Give yourself time to explore beyond the main viewpoint.</p>

                <div className="my-8 grid grid-cols-3 gap-2 sm:gap-3">
                  {[["Experience", selected.type], ["Best time", selectedGuide?.bestTime ?? "Year round"], ["Ideal stay", selectedGuide?.stay ?? "2 — 3 days"]].map(([label, value]) => (
                    <div key={label} className="rounded-[1.25rem] border border-[#0a5b49]/8 bg-white p-3.5 shadow-sm sm:p-4"><span className="block text-[8px] font-bold uppercase tracking-[.16em] text-[#789087]">{label}</span><strong className="mt-2 block text-xs font-semibold leading-4 text-[#123f35] sm:text-sm">{value}</strong></div>
                  ))}
                </div>

                {selectedIntel && (
                  <div className="mb-8 rounded-[1.6rem] border border-[#0a5b49]/10 bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex items-start justify-between gap-5">
                      <div><p className="text-[9px] font-bold uppercase tracking-[.2em] text-[#07856f]">Smart place cluster</p><h3 className="mt-1 font-['Instrument_Serif'] text-3xl text-[#123f35]">Around {selected.name}</h3></div>
                      <span className="rounded-full bg-[#e7f2e9] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.12em] text-[#0a5b49]">{selectedIntel.district}</span>
                    </div>
                    <div className="mt-5 grid gap-2 sm:grid-cols-2">
                      {selectedIntel.nearby.map((place, index) => (
                        <div key={place} className="flex items-center gap-3 rounded-xl bg-[#f2f5ef] px-3.5 py-3">
                          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#0a5b49] text-[8px] font-bold text-white">{String(index + 1).padStart(2, "0")}</span>
                          <span className="min-w-0 flex-1"><strong className="block truncate text-xs font-semibold text-[#315a50]">{place}</strong><small className="mt-0.5 block text-[8px] font-bold uppercase tracking-[.12em] text-[#789087]">Nearby place</small></span>
                        </div>
                      ))}
                    </div>
                    <button type="button" onClick={() => { setAroundPageDestination(selected); setSelected(null) }} className="mt-5 flex w-full items-center justify-between rounded-full bg-[#0a5b49] px-5 py-3.5 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#08715d] hover:shadow-lg"><span>More around places details</span><span>Open separate page →</span></button>
                  </div>
                )}

                <div className="rounded-[1.6rem] bg-[#0a493e] p-5 text-white sm:p-6">
                  <p className="mb-4 text-[9px] font-bold uppercase tracking-[.2em] text-[#9cebc8]">Signature experiences</p>
                  <div className="grid gap-1">
                    {selectedGuide?.highlights.map((highlight, index) => (
                      <div key={highlight} className="flex items-center gap-4 border-t border-white/12 py-3 first:border-t-0 first:pt-0 last:pb-0"><span className="text-[9px] font-bold text-[#8be5bb]">0{index + 1}</span><span className="text-sm text-white/82">{highlight}</span></div>
                    ))}
                  </div>
                </div>

                <div className="mt-9">
                  <div className="mb-4 flex items-end justify-between gap-4">
                    <div><p className="text-[9px] font-bold uppercase tracking-[.2em] text-[#07856f]">Continue exploring</p><h3 className="mt-1 font-['Instrument_Serif'] text-3xl text-[#123f35]">Beautiful places nearby</h3></div>
                    <span className="text-xs text-[#758a83]">Select to open</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {relatedDestinations.map((destination) => (
                      <button type="button" key={destination.name} onClick={() => setSelected(destination)} className="group relative min-h-32 overflow-hidden rounded-[1.2rem] text-left text-white">
                        <img src={destination.img} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                        <span className="absolute inset-0 bg-gradient-to-t from-[#042d26]/90 via-[#042d26]/15 to-transparent" />
                        <span className="absolute inset-x-0 bottom-0 p-3"><small className="block text-[8px] font-bold uppercase tracking-wider text-white/65">{getCategory(destination)}</small><strong className="mt-0.5 block font-['Instrument_Serif'] text-xl font-normal">{destination.name}</strong></span>
                      </button>
                    ))}
                  </div>
                </div>

                <button type="button" onClick={onBack} className="mt-8 flex w-full items-center justify-between rounded-full bg-[#ef956c] px-6 py-4 text-sm font-bold text-[#123f35] transition hover:bg-[#f5a47e]"><span>Build a trip around {selected.name}</span><span>↗</span></button>
              </div>
            </div>
          </article>
        </div>
      )}

      {nearbySelection && nearbyStory && (
        <div className="fixed inset-0 z-[110] overflow-y-auto bg-[#021713]/88 p-2 backdrop-blur-xl sm:p-5" role="dialog" aria-modal="true" aria-label={`${nearbySelection.place} nearby place details`} onMouseDown={(event) => { if (event.currentTarget === event.target) setNearbySelection(null) }}>
          <article className="relative mx-auto max-w-[1500px] overflow-hidden rounded-[2rem] bg-[#eef2eb] shadow-[0_50px_150px_rgba(0,0,0,.55)] sm:rounded-[2.5rem]">
            <button type="button" onClick={() => setNearbySelection(null)} className="fixed right-5 top-5 z-30 grid h-12 w-12 place-items-center rounded-full border border-white/50 bg-white/92 text-[#063e34] shadow-xl transition hover:rotate-90 sm:absolute sm:right-7 sm:top-7" aria-label="Close nearby place details">✕</button>

            <header className="relative min-h-[62vh] overflow-hidden bg-[#123f35] text-white">
              <img src={nearbyHero} alt={`Regional view near ${nearbySelection.place}`} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,27,23,.92)_0%,rgba(2,27,23,.6)_48%,rgba(2,27,23,.15)_80%),linear-gradient(0deg,rgba(2,27,23,.8),transparent_60%)]" />
              <div className="relative flex min-h-[62vh] flex-col justify-between p-6 sm:p-10 lg:p-14">
                <div className="flex flex-wrap items-center gap-2">
                  <button type="button" onClick={() => setNearbySelection(null)} className="rounded-full border border-white/25 bg-black/15 px-4 py-2 text-[9px] font-bold uppercase tracking-[.17em] text-white backdrop-blur-xl transition hover:bg-white hover:text-[#063e34]">← Back to {nearbySelection.parent.name}</button>
                  <span className="rounded-full border border-white/20 bg-black/15 px-4 py-2 text-[9px] font-bold uppercase tracking-[.17em] text-white/75 backdrop-blur-xl">{nearbyStory.kind}</span>
                </div>
                <div className="max-w-5xl">
                  <p className="mb-4 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.24em] text-[#a9f1d0]"><span className="h-px w-10 bg-[#a9f1d0]/60" /> Nearby discovery · {nearbyParentIntel?.district} District</p>
                  <h2 className="max-w-5xl font-['Instrument_Serif'] text-[clamp(4.5rem,10vw,10rem)] font-normal leading-[.75] tracking-[-.05em]">{nearbySelection.place}</h2>
                  <div className="mt-8 flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-semibold backdrop-blur-xl">Near {nearbySelection.parent.name}</span>
                    <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-semibold backdrop-blur-xl">Best · {nearbyStory.bestMoment}</span>
                    <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-semibold backdrop-blur-xl">Allow · {nearbyStory.visitTime}</span>
                  </div>
                </div>
              </div>
            </header>

            <div className="grid lg:grid-cols-[1.05fr_.95fr]">
              <div className="p-6 sm:p-10 lg:p-14">
                <p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#07856f]">Why this place belongs in your route</p>
                <p className="mt-5 font-['Instrument_Serif'] text-3xl leading-[1.08] tracking-[-.02em] text-[#123f35] sm:text-5xl">{nearbyStory.intro}</p>

                <div className="my-9 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {[["Main base", nearbySelection.parent.name], ["Location", `${nearbyParentIntel?.district} District`], ["Visit time", nearbyStory.visitTime]].map(([label, value]) => (
                    <div key={label} className="rounded-[1.25rem] border border-[#0a5b49]/9 bg-white p-4 shadow-sm"><span className="text-[8px] font-bold uppercase tracking-[.16em] text-[#789087]">{label}</span><strong className="mt-2 block text-sm text-[#123f35]">{value}</strong></div>
                  ))}
                </div>

                <div className="rounded-[1.6rem] bg-[#073f35] p-5 text-white sm:p-7">
                  <p className="text-[9px] font-bold uppercase tracking-[.2em] text-[#9cebc8]">What to notice</p>
                  <div className="mt-4 grid gap-1">
                    {nearbyStory.highlights.map((highlight, index) => (
                      <div key={highlight} className="flex items-center gap-4 border-t border-white/12 py-3 first:border-t-0"><span className="grid h-7 w-7 place-items-center rounded-full bg-[#a9f1d0] text-[8px] font-bold text-[#073f35]">0{index + 1}</span><span className="text-sm text-white/82">{highlight}</span></div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 rounded-[1.4rem] border border-[#ef956c]/25 bg-[#fff4ed] p-5">
                  <p className="text-[9px] font-bold uppercase tracking-[.2em] text-[#9c5738]">Travel thoughtfully</p>
                  <p className="mt-2 text-sm leading-6 text-[#6e594e]">{nearbyStory.travelTip}</p>
                </div>
              </div>

              <aside className="bg-[#dfe9df] p-4 sm:p-6 lg:p-8">
                <div className="overflow-hidden rounded-[1.6rem] border border-[#0a5b49]/10 bg-[#123f35] shadow-lg">
                  <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 text-white"><div><p className="text-[8px] font-bold uppercase tracking-[.18em] text-[#9cebc8]">Live location</p><strong className="mt-1 block text-sm">{nearbySelection.place}, Sri Lanka</strong></div><span className="grid h-9 w-9 place-items-center rounded-full bg-white/10">⌖</span></div>
                  <div className="relative min-h-[25rem] bg-[#214d44]">
                    <iframe src={nearbyMapUrl} title={`Satellite map of ${nearbySelection.place}`} className="absolute inset-0 h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mb-3 flex items-end justify-between gap-4"><div><p className="text-[8px] font-bold uppercase tracking-[.18em] text-[#07856f]">Regional gallery</p><h3 className="mt-1 font-['Instrument_Serif'] text-3xl text-[#123f35]">See the atmosphere</h3></div><span className="text-[9px] text-[#6d847c]">{nearbyGallery.length} views</span></div>
                  <div className="grid grid-cols-2 gap-2">
                    {nearbyGallery.map((destination, index) => (
                      <figure key={`${destination.name}-${index}`} className={`relative overflow-hidden rounded-[1.2rem] bg-[#123f35] ${index === 0 ? "col-span-2 min-h-56" : "min-h-36"}`}>
                        <img src={destination.img} alt={`Regional inspiration from ${destination.name}`} className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-105" />
                        <span className="absolute inset-0 bg-gradient-to-t from-[#03251f]/70 via-transparent to-transparent" />
                        <figcaption className="absolute inset-x-0 bottom-0 p-4 text-white"><small className="block text-[8px] font-bold uppercase tracking-[.15em] text-white/60">Regional inspiration</small><strong className="mt-1 block font-['Instrument_Serif'] text-2xl font-normal">{destination.name}</strong></figcaption>
                      </figure>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </article>
        </div>
      )}
    </main>
  )
}
