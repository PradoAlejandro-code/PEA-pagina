import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useNews } from '../hooks/news'
import YearCalendar from '../components/YearCalendar'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '../components/ui/carousel'
import { Calendar, Tag, ArrowRight } from 'lucide-react'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const { data: newsList = [], isLoading: loading } = useNews()

  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  return (
    <main className="w-full max-w-7xl mx-auto px-4 py-6 md:py-10 space-y-8">

      {/* News Carousel Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-center pb-2 select-none">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Últimas Noticias
          </h2>
          <span className="bg-white/10 text-white font-semibold text-xs px-3.5 py-1 rounded-full uppercase tracking-wider">
            Novedades
          </span>
        </div>

        {loading ? (
          <div className="flex h-[400px] md:h-[500px] items-center justify-center bg-white/5 rounded-3xl">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
          </div>
        ) : (
          <div className="relative w-full">
            <Carousel
              setApi={setApi}
              opts={{
                align: 'start',
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-0">
                {newsList.map((item) => (
                  <CarouselItem
                    key={item.id}
                    className="pl-0 basis-full"
                  >
                    <Link
                      to="/noticias/$id"
                      params={{ id: item.id }}
                      className="relative block w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-lg border border-zinc-700/20 group cursor-pointer"
                    >
                      {/* Banner Image */}
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />

                      {/* Dark Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10 transition-opacity duration-300 group-hover:from-black/98" />

                      {/* Top category tag overlay */}
                      <div className="absolute top-6 left-6 z-10">
                        <span className="flex items-center gap-x-1.5 bg-[#2b7fff] text-white text-xs md:text-sm font-bold px-4 py-1.5 rounded-full shadow-md">
                          <Tag className="h-3.5 w-3.5" />
                          {item.category}
                        </span>
                      </div>

                      {/* Center Bottom Captions */}
                      <div className="absolute bottom-12 left-6 right-6 md:left-12 md:right-12 z-10 flex flex-col items-center text-center space-y-3 select-none">
                        <h3 className="text-2xl md:text-4xl font-extrabold text-white leading-tight tracking-tight drop-shadow-md group-hover:text-zinc-100 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm md:text-lg text-zinc-200 max-w-3xl font-medium leading-relaxed drop-shadow-sm line-clamp-2 md:line-clamp-none">
                          {item.description}
                        </p>
                        
                        <div className="inline-flex items-center gap-x-2 bg-white text-black font-semibold text-xs md:text-sm px-5 py-2.5 rounded-full shadow-md transition-transform duration-200 group-hover:scale-105 mt-2">
                          <Calendar className="h-4 w-4 text-zinc-700" />
                          <span>{item.date}</span>
                          <span className="text-zinc-300">|</span>
                          <span className="text-[#2b7fff] font-bold">Leer más</span>
                          <ArrowRight className="h-4 w-4 text-[#2b7fff] transition-transform duration-150 group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              
              {/* Inner Controls */}
              <CarouselPrevious className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 bg-white/20 border-white/20 text-white hover:bg-white/40 hover:text-white shadow-lg h-12 w-12 rounded-full cursor-pointer transition-all border outline-none" />
              <CarouselNext className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 bg-white/20 border-white/20 text-white hover:bg-white/40 hover:text-white shadow-lg h-12 w-12 rounded-full cursor-pointer transition-all border outline-none" />
              
              {/* Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-x-2 select-none">
                {Array.from({ length: count }).map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation()
                      api?.scrollTo(index)
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer outline-none ${
                      index === current - 1 
                        ? 'w-8 bg-white' 
                        : 'w-2 bg-white/50 hover:bg-white/80'
                    }`}
                    aria-label={`Ir al slide ${index + 1}`}
                  />
                ))}
              </div>
            </Carousel>
          </div>
        )}
      </section>

      {/* Year Calendar Section */}
      <section>
        <YearCalendar year={2026} />
      </section>
    </main>
  )
}
