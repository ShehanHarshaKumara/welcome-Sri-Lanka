import type { CSSProperties } from "react"
import type { Destination } from "./DestinationsPage"

type ExperiencesPageProps = {
  destinations: Destination[]
  onNavigate: (page: "home" | "tours" | "gallery" | "reach-us") => void
}

const STORIES = [
  {
    id: "heritage",
    number: "01",
    kicker: "Heritage · Sigiriya",
    title: "Wake before the kings.",
    lead: "Climb through water gardens and painted caves while the jungle is still blue with morning.",
    copy: "Sigiriya is more than the view from the top. It is the quiet approach through ancient gardens, the first warm light on the rock face, and the moment the plains open in every direction. Go early, take your time, and let a local guide reveal the stories hidden in the stone.",
    image: "/assets/pidurangala-main.png",
    detailImage: "/assets/dambulla-cave-temple-main.png",
    mood: "Ancient · Quiet · Awe-inspiring",
    best: "Best at sunrise",
    time: "4–5 hours",
    accent: "#d9693f",
  },
  {
    id: "wild",
    number: "02",
    kicker: "Wildlife · Minneriya",
    title: "Stand quietly. The wild comes closer.",
    lead: "Watch elephants move across open grassland as the dry-zone sky turns gold.",
    copy: "The most powerful wildlife moments are often the least hurried. In Minneriya, a naturalist helps you read tracks, bird calls and changing light before the elephants appear. Keep your distance, lower your voice and experience the park on its own terms.",
    image: "/assets/minneriya-national-park-main.png",
    detailImage: "/assets/ritigala-monastery-main.png",
    mood: "Untamed · Spacious · Humbling",
    best: "Best May–September",
    time: "Half day",
    accent: "#9aaa61",
  },
  {
    id: "highlands",
    number: "03",
    kicker: "Highlands · Ella",
    title: "Take the long way through the clouds.",
    lead: "Open the train window and watch tea country unfold one green curve at a time.",
    copy: "The hill-country railway is not simply transport—it is the experience. Waterfalls flash between trees, tea pickers work bright slopes, and small stations arrive with hot milk tea and mountain air. The best plan is to leave room for the journey to surprise you.",
    image: "/assets/nine-arch-bridge-main.png",
    detailImage: "/assets/ravana-falls-main.png",
    mood: "Slow · Cinematic · Refreshing",
    best: "Best December–April",
    time: "Half or full day",
    accent: "#5d8f83",
  },
  {
    id: "coast",
    number: "04",
    kicker: "Coast · Weligama",
    title: "Let the Indian Ocean set the pace.",
    lead: "Learn your first wave, follow the coast and stay until the sky turns coral.",
    copy: "Sri Lanka's south is made for unhurried days. Begin with a warm-water surf lesson in Weligama, stop for a king coconut, then follow the road towards Mirissa. The coast is at its best when you mix movement with long, delicious pauses.",
    image: "/assets/weligama-bay-main.png",
    detailImage: "/assets/coconut-tree-hill-main.png",
    mood: "Salty · Playful · Unhurried",
    best: "Best November–April",
    time: "A full easy day",
    accent: "#e6a64c",
  },
  {
    id: "flavours",
    number: "05",
    kicker: "Flavours · Island kitchens",
    title: "Taste the story behind the spice.",
    lead: "Meet the island through market baskets, family recipes and food made to be shared.",
    copy: "The best Sri Lankan meals begin before the table. Walk through a local market, learn how roasted curry powder changes from region to region, and cook alongside a host who measures by memory. Come hungry—the conversation matters as much as the food.",
    image: "/assets/local-flavours-mirissa-main.png",
    detailImage: "/assets/local-flavours-ella-main.png",
    mood: "Generous · Fragrant · Social",
    best: "Wonderful year-round",
    time: "3–4 hours",
    accent: "#c9573c",
  },
]

export default function ExperiencesPage({ onNavigate }: ExperiencesPageProps) {
  return (
    <main className="island-stories">
      <section className="island-stories__hero">
        <video autoPlay muted loop playsInline poster="/assets/nine-arch-bridge-main.png" aria-label="Scenes from a journey through Sri Lanka">
          <source src="/assets/videos/sri-lanka-hero.mp4" type="video/mp4" />
        </video>
        <div className="island-stories__hero-shade" />
        <div className="island-stories__hero-copy">
          <p><span /> Experiences worth travelling for</p>
          <h1>Don’t just visit.<br /><em>Feel Sri Lanka.</em></h1>
          <div className="island-stories__hero-bottom">
            <p>Five ways to meet the island—through ancient places, wild landscapes, mountain journeys, ocean days and generous tables.</p>
            <button type="button" onClick={() => document.getElementById("story-menu")?.scrollIntoView({ behavior: "smooth" })}>Begin the journey <span>↓</span></button>
          </div>
        </div>
        <div className="island-stories__hero-note"><span>06° 56′ N</span><span>79° 51′ E</span><span>Indian Ocean</span></div>
      </section>

      <section className="island-stories__intro">
        <p className="island-stories__eyebrow">The island, experienced</p>
        <div><h2>Some places you see.<br />Sri Lanka is a place you <em>feel.</em></h2><p>The cool stone beneath your feet before sunrise. A train leaning into the mountains. Cinnamon and woodsmoke drifting from a kitchen. These are the moments that turn a trip into a story.</p></div>
      </section>

      <nav id="story-menu" className="island-stories__menu" aria-label="Explore experience stories">
        <span>Choose a feeling</span>
        <div>{STORIES.map((story) => <a key={story.id} href={`#${story.id}`}><b>{story.number}</b>{story.id}<span>↘</span></a>)}</div>
      </nav>

      <section className="island-stories__chapters">
        {STORIES.map((story, index) => (
          <article id={story.id} className={`island-story island-story--${index % 2 ? "reverse" : "forward"}`} key={story.id} style={{ "--story-accent": story.accent } as CSSProperties}>
            <div className="island-story__visual">
              <img className="island-story__main-image" src={story.image} alt={`${story.kicker} experience in Sri Lanka`} loading={index < 2 ? "eager" : "lazy"} />
              <div className="island-story__number">{story.number}</div>
              <figure><img src={story.detailImage} alt="Another view from this Sri Lankan experience" loading="lazy" /><figcaption>{story.mood}</figcaption></figure>
            </div>
            <div className="island-story__copy">
              <p className="island-stories__eyebrow">{story.kicker}</p>
              <h2>{story.title}</h2>
              <p className="island-story__lead">{story.lead}</p>
              <p className="island-story__body">{story.copy}</p>
              <dl><div><dt>When to go</dt><dd>{story.best}</dd></div><div><dt>Make time for</dt><dd>{story.time}</dd></div></dl>
              <button type="button" onClick={() => onNavigate("reach-us")}>Add this to my journey <span>↗</span></button>
            </div>
          </article>
        ))}
      </section>

      <section className="island-stories__day">
        <div className="island-stories__day-heading"><p className="island-stories__eyebrow">One unforgettable day</p><h2>From first light<br />to firelight.</h2></div>
        <ol>
          <li><time>05:30</time><span>Climb before sunrise</span><p>Cool air, quiet paths and the first light over the plains.</p></li>
          <li><time>10:00</time><span>Meet a village kitchen</span><p>Fresh hoppers, sambols and stories shared around the table.</p></li>
          <li><time>15:30</time><span>Follow the wild</span><p>A slow safari as elephants emerge into the evening light.</p></li>
          <li><time>19:30</time><span>Dinner under the stars</span><p>Local flavours, night sounds and nowhere else to be.</p></li>
        </ol>
      </section>

      <section className="island-stories__closing">
        <img src="/assets/boutique-stays-mirissa-main.png" alt="A peaceful Sri Lankan coastal stay" loading="lazy" />
        <div className="island-stories__closing-shade" />
        <div><p className="island-stories__eyebrow">Your Sri Lanka can feel different</p><h2>What do you want<br />to remember?</h2><p>Tell us what draws you in. We’ll shape a journey with the right places, pace and people.</p><div><button type="button" onClick={() => onNavigate("reach-us")}>Create my journey <span>↗</span></button><button type="button" onClick={() => onNavigate("tours")}>Explore curated tours</button></div></div>
      </section>
    </main>
  )
}
