import Footer from "@/components/sections/Footer"
import Hero from "@/components/sections/Homepage/Hero"
import UpcomingEventPage from "@/components/sections/Homepage/UpcomingEventPage"
import Navbar from "@/components/sections/Navbar"

const Home = () => {
  return (
    <div>
        <Navbar />
        <Hero />
        <UpcomingEventPage />
        <Footer />
    </div>
  )
}

export default Home