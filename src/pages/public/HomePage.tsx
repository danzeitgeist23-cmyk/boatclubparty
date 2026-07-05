import { useEvents } from '../../hooks/useEvents'
import { useSettings } from '../../hooks/useSettings'
import Nav from '../../components/home/Nav'
import Hero from '../../components/home/Hero'
import Countdown from '../../components/home/Countdown'
import EventsSection from '../../components/home/EventsSection'
import GallerySection from '../../components/home/GallerySection'
import WhyUs from '../../components/home/WhyUs'
import Reviews from '../../components/home/Reviews'
import CheckIn from '../../components/home/CheckIn'
import Faq from '../../components/home/Faq'
import Newsletter from '../../components/home/Newsletter'
import Footer from '../../components/home/Footer'
import WhatsAppFloat from '../../components/home/WhatsAppFloat'

export default function HomePage() {
  const { events, loading } = useEvents()
  const settings = useSettings()
  const whatsapp = settings.whatsapp_number

  return (
    <div style={{ minHeight: '100vh' }}>
      <Nav />
      <main>
        <Hero />
        <Countdown events={events} />
        <EventsSection events={events} loading={loading} whatsapp={whatsapp} />
        <GallerySection />
        <WhyUs />
        <Reviews />
        <CheckIn whatsapp={whatsapp} />
        <Faq />
        <Newsletter />
      </main>
      <Footer />
      <WhatsAppFloat whatsapp={whatsapp} />
    </div>
  )
}
