import { FormEvent, useMemo, useState } from 'react';
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Compass,
  CloudSun,
  Globe2,
  Heart,
  LocateFixed,
  MapPin,
  Menu,
  MessageCircle,
  Mountain,
  Search,
  Send,
  Sparkles,
  Star,
  Sun,
  Umbrella,
  Waves,
  X,
} from 'lucide-react';

type Destination = {
  id: string;
  name: string;
  country: string;
  region: string;
  image: string;
  description: string;
  weather: string;
  temp: string;
  weatherIcon: 'sun' | 'cloud' | 'rain';
  places: string[];
  tags: string[];
  accent: string;
};

type ChatMessage = {
  role: 'assistant' | 'user';
  text: string;
};

const destinations: Destination[] = [
  {
    id: 'santorini',
    name: 'Santorini',
    country: 'Greece',
    region: 'Europe',
    image: 'https://images.pexels.com/photos/164435/pexels-photo-164435.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description: 'Sun-washed villages, volcanic beaches, and sunsets that stay with you.',
    weather: 'Sunny',
    temp: '27°',
    weatherIcon: 'sun',
    places: ['Oia Castle', 'Red Beach', 'Fira to Oia Trail'],
    tags: ['Coastal', 'Romantic', 'Slow travel'],
    accent: 'coral',
  },
  {
    id: 'kyoto',
    name: 'Kyoto',
    country: 'Japan',
    region: 'Asia',
    image: 'https://images.pexels.com/photos/18848921/pexels-photo-18848921.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description: 'Ancient rituals, quiet gardens, and lantern-lit streets around every corner.',
    weather: 'Partly cloudy',
    temp: '21°',
    weatherIcon: 'cloud',
    places: ['Fushimi Inari', 'Arashiyama', 'Kiyomizu-dera'],
    tags: ['Culture', 'Food', 'Mindful'],
    accent: 'sage',
  },
  {
    id: 'amalfi',
    name: 'Amalfi Coast',
    country: 'Italy',
    region: 'Europe',
    image: 'https://images.pexels.com/photos/919280/pexels-photo-919280.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description: 'Cliffside villages, lemon-scented air, and a blue horizon in every direction.',
    weather: 'Sunny',
    temp: '25°',
    weatherIcon: 'sun',
    places: ['Path of the Gods', 'Positano', 'Ravello Gardens'],
    tags: ['Coastal', 'Food', 'Road trip'],
    accent: 'sand',
  },
  {
    id: 'marrakech',
    name: 'Marrakech',
    country: 'Morocco',
    region: 'Africa',
    image: 'https://images.pexels.com/photos/6621125/pexels-photo-6621125.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description: 'A sensory maze of spice, craft, color, and stories in the red city.',
    weather: 'Clear skies',
    temp: '30°',
    weatherIcon: 'sun',
    places: ['Jemaa el-Fnaa', 'Majorelle Garden', 'Bahia Palace'],
    tags: ['Culture', 'Design', 'Warm'],
    accent: 'terracotta',
  },
];

const week = [
  { day: 'Today', date: '18', icon: 'sun', temp: '27°', low: '19°' },
  { day: 'Tue', date: '19', icon: 'sun', temp: '26°', low: '18°' },
  { day: 'Wed', date: '20', icon: 'cloud', temp: '24°', low: '17°' },
  { day: 'Thu', date: '21', icon: 'rain', temp: '22°', low: '16°' },
  { day: 'Fri', date: '22', icon: 'sun', temp: '25°', low: '18°' },
];

const answers: Record<string, string> = {
  time: 'For a first visit, 3–4 nights is the sweet spot. It gives you time for Oia at golden hour, a boat day, and one unhurried morning in Fira.',
  food: 'Start with a long lunch of tomato fritters, fava, grilled octopus, and local Assyrtiko wine. For the freshest seafood, look toward the smaller villages away from the caldera.',
  beach: 'Red Beach is the iconic stop, but I would pair it with a swim at Vlychada for its sculptural cliffs and calmer, more local atmosphere.',
  default: 'I would shape your trip around one slow morning, one big view, and one local table each day. Ask me about timing, food, beaches, or what to pack.',
};

function WeatherIcon({ type, size = 18 }: { type: 'sun' | 'cloud' | 'rain'; size?: number }) {
  if (type === 'cloud') return <CloudSun size={size} strokeWidth={1.8} />;
  if (type === 'rain') return <Umbrella size={size} strokeWidth={1.8} />;
  return <Sun size={size} strokeWidth={1.8} />;
}

function App() {
  const [activeRegion, setActiveRegion] = useState('All');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState('santorini');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', text: 'Tell me what you want to feel on this trip.' },
  ]);
  const [locationMessage, setLocationMessage] = useState('');

  const selected = destinations.find((destination) => destination.id === selectedId) ?? destinations[0];
  const regions = ['All', 'Europe', 'Asia', 'Africa'];

  const filteredDestinations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return destinations.filter((destination) => {
      const matchesRegion = activeRegion === 'All' || destination.region === activeRegion;
      const matchesQuery = !normalizedQuery || `${destination.name} ${destination.country} ${destination.tags.join(' ')}`.toLowerCase().includes(normalizedQuery);
      return matchesRegion && matchesQuery;
    });
  }, [activeRegion, query]);

  const toggleFavorite = (id: string) => {
    setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const findLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage('Location search is not available here. Try searching for a place instead.');
      return;
    }
    setLocationMessage('Finding your nearest escape…');
    navigator.geolocation.getCurrentPosition(
      () => setLocationMessage('You are near a beautiful day trip. Explore the destinations below.'),
      () => setLocationMessage('We could not access your location. Search any city to begin exploring.'),
      { timeout: 6000 },
    );
  };

  const submitChat = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = chatInput.trim();
    if (!text) return;
    const lower = text.toLowerCase();
    const answerKey = Object.keys(answers).find((key) => lower.includes(key)) ?? 'default';
    setMessages((current) => [...current, { role: 'user', text }, { role: 'assistant', text: answers[answerKey] }]);
    setChatInput('');
  };

  const scrollToExplore = () => document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <main className="app-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Wanderly home">
          <span className="brand-mark"><Compass size={21} /></span>
          <span>Wanderly<span className="brand-dot">.</span></span>
        </a>
        <nav className={`main-nav ${mobileMenuOpen ? 'is-open' : ''}`} aria-label="Primary navigation">
          <a href="#explore" onClick={() => setMobileMenuOpen(false)}>Explore</a>
          <a href="#weather" onClick={() => setMobileMenuOpen(false)}>Weather</a>
          <a href="#places" onClick={() => setMobileMenuOpen(false)}>Places to go</a>
          <button className="nav-chat" onClick={() => { setChatOpen(true); setMobileMenuOpen(false); }}><Sparkles size={16} /> Ask Wanderly</button>
        </nav>
        <button className="menu-button" aria-label="Open menu" onClick={() => setMobileMenuOpen((open) => !open)}>
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <section className="hero" id="top">
        <div className="hero-orbit orbit-one" />
        <div className="hero-orbit orbit-two" />
        <div className="hero-copy">
          <p className="eyebrow light"><span /> Your next story starts here</p>
          <h1>Go where<br /><em>you feel alive.</em></h1>
          <p className="hero-intro">Curated places, real weather, and a little help planning the kind of trip you will talk about for years.</p>
          <div className="hero-actions">
            <button className="button button-primary" onClick={scrollToExplore}>Explore destinations <ArrowRight size={17} /></button>
            <button className="button button-quiet" onClick={() => setChatOpen(true)}><MessageCircle size={17} /> Ask the guide</button>
          </div>
        </div>
        <div className="hero-visual" aria-label="Aerial view of Santorini, Greece">
          <div className="hero-image" />
          <div className="image-caption"><MapPin size={13} /> Santorini, Greece <span>01 / 04</span></div>
          <div className="hero-weather"><Sun size={17} /><div><strong>27°</strong><span>Perfectly clear</span></div></div>
        </div>
        <div className="hero-footer"><span>Scroll to wander</span><span className="scroll-line" /><span>01 — 04</span></div>
      </section>

      <section className="explore-section" id="explore">
        <div className="section-heading">
          <div><p className="eyebrow"><span /> Find your somewhere</p><h2>Places with a pulse.</h2></div>
          <p className="section-note">Not sure where to begin?<br /><button onClick={() => setChatOpen(true)}>Let our guide help <ArrowRight size={14} /></button></p>
        </div>
        <div className="explore-toolbar">
          <div className="region-tabs" role="tablist" aria-label="Filter destinations">
            {regions.map((region) => <button key={region} className={activeRegion === region ? 'active' : ''} onClick={() => setActiveRegion(region)}>{region}</button>)}
          </div>
          <label className="search-box"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a city, country, feeling…" /><kbd>/</kbd></label>
        </div>
        <div className="destination-grid">
          {filteredDestinations.map((destination, index) => (
            <article className={`destination-card ${selectedId === destination.id ? 'selected' : ''}`} key={destination.id} onClick={() => setSelectedId(destination.id)}>
              <div className="card-image-wrap"><img src={destination.image} alt={destination.name} /><button className={`favorite ${favorites.includes(destination.id) ? 'liked' : ''}`} aria-label={`Save ${destination.name}`} onClick={(event) => { event.stopPropagation(); toggleFavorite(destination.id); }}><Heart size={17} fill={favorites.includes(destination.id) ? 'currentColor' : 'none'} /></button><span className="card-number">0{index + 1}</span></div>
              <div className="card-content"><div className="card-meta"><span><MapPin size={13} /> {destination.country}</span><span><WeatherIcon type={destination.weatherIcon} size={15} /> {destination.temp}</span></div><h3>{destination.name}</h3><p>{destination.description}</p><div className="tag-row">{destination.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
            </article>
          ))}
        </div>
        {filteredDestinations.length === 0 && <div className="empty-state"><Globe2 size={25} /><h3>No places found yet.</h3><p>Try another city, country, or feeling.</p></div>}
      </section>

      <section className="split-section" id="weather">
        <div className="weather-panel">
          <div className="panel-heading"><div><p className="eyebrow light"><span /> Right now</p><h2>Weather worth<br /><em>travelling for.</em></h2></div><button className="location-button" onClick={findLocation}><LocateFixed size={16} /> Use my location</button></div>
          {locationMessage && <p className="location-message">{locationMessage}</p>}
          <div className="weather-location"><div className="big-weather-icon"><WeatherIcon type={selected.weatherIcon} size={35} /></div><div><p>{selected.name}, {selected.country}</p><strong>{selected.temp}</strong><span>{selected.weather} · Feels like {selected.temp}</span></div></div>
          <div className="forecast-row">{week.map((item) => <div className={`forecast-day ${item.day === 'Today' ? 'today' : ''}`} key={item.day}><span>{item.day}</span><small>{item.date}</small><WeatherIcon type={item.icon as 'sun' | 'cloud' | 'rain'} size={18} /><strong>{item.temp}</strong><small>{item.low}</small></div>)}</div>
          <div className="weather-foot"><span><Waves size={15} /> Water temperature 23°</span><span><Sun size={15} /> Sunrise 06:18</span><span><Mountain size={15} /> Visibility 10km</span></div>
        </div>
        <div className="places-panel" id="places"><p className="eyebrow"><span /> While you are there</p><div className="places-title-row"><h2>Do not miss<br /><em>these.</em></h2><div className="rating"><Star size={16} fill="currentColor" /><strong>4.9</strong><span>from fellow<br />wanderers</span></div></div><div className="place-list">{selected.places.map((place, index) => <button className="place-row" key={place} onClick={() => setChatOpen(true)}><span className="place-index">0{index + 1}</span><span className="place-name">{place}</span><span className="place-type">{index === 0 ? 'Iconic view' : index === 1 ? 'Local favorite' : 'Worth the walk'}</span><ArrowRight size={17} /></button>)}</div><button className="text-button" onClick={() => setChatOpen(true)}>Build my day around {selected.name} <ArrowRight size={15} /></button></div>
      </section>

      <section className="planner-section">
        <div className="planner-copy"><p className="eyebrow"><span /> Make it yours</p><h2>A trip that<br /><em>sounds like you.</em></h2><p>Tell us your mood, your pace, and the things you love. Our guide turns a blank map into a day-by-day plan.</p><button className="button button-dark" onClick={() => setChatOpen(true)}>Plan with the guide <Sparkles size={16} /></button></div>
        <div className="itinerary-card"><div className="itinerary-top"><span className="itinerary-label"><CalendarDays size={15} /> Your weekend, sketched</span><span className="itinerary-status"><span /> Ready to explore</span></div><div className="itinerary-header"><div><h3>Santorini, slowly</h3><p>3 days · 2 people · late September</p></div><button aria-label="Save itinerary" onClick={() => toggleFavorite('itinerary')}><Heart size={18} fill={favorites.includes('itinerary') ? 'currentColor' : 'none'} /></button></div><div className="itinerary-days"><div className="day-card active"><span>DAY 01</span><strong>Arrive & exhale</strong><p>Check in · Oia sunset<br />Dinner at a hidden taverna</p><i><Check size={12} /></i></div><div className="day-card"><span>DAY 02</span><strong>Blue all day</strong><p>Catamaran sail · Red Beach<br />Wine tasting in Pyrgos</p><i><Check size={12} /></i></div><div className="day-card"><span>DAY 03</span><strong>One last view</strong><p>Fira to Oia walk · Slow lunch<br />A final swim</p><i><Check size={12} /></i></div></div><div className="itinerary-bottom"><span><span className="mini-avatar">W</span> Curated by Wanderly</span><button onClick={() => setChatOpen(true)}>Edit plan <ArrowRight size={14} /></button></div></div>
      </section>

      <footer className="site-footer"><a className="brand" href="#top"><span className="brand-mark"><Compass size={18} /></span><span>Wanderly<span className="brand-dot">.</span></span></a><p>Go gently. Go often.</p><span>© 2024 Wanderly Travel Co.</span></footer>

      {chatOpen && <aside className="chat-drawer" aria-label="Wanderly travel guide"><div className="chat-header"><div><span className="chat-avatar"><Sparkles size={16} /></span><div><strong>Wanderly guide</strong><span>Usually replies instantly</span></div></div><button aria-label="Close guide" onClick={() => setChatOpen(false)}><X size={20} /></button></div><div className="chat-body">{messages.map((message, index) => <div className={`chat-message ${message.role}`} key={`${message.role}-${index}`}><p>{message.text}</p></div>)}<div className="suggestion-row"><button onClick={() => setChatInput('How long should I stay?')}>How long?</button><button onClick={() => setChatInput('Where should I eat?')}>Where to eat?</button><button onClick={() => setChatInput('Best beach?')}>Best beach?</button></div></div><form className="chat-form" onSubmit={submitChat}><input value={chatInput} onChange={(event) => setChatInput(event.target.value)} placeholder="Ask about your trip…" aria-label="Ask about your trip" /><button aria-label="Send message"><Send size={17} /></button></form></aside>}
    </main>
  );
}

export default App;
