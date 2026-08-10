import { createFileRoute, Link } from '@tanstack/react-router'
import { Calendar, ChevronLeft, Tag } from 'lucide-react'
import { useNewsById } from '../hooks/news'

export const Route = createFileRoute('/noticias/$id')({
  component: NewsDetail,
})

function NewsDetail() {
  const { id } = Route.useParams()
  const { data: news = null, isLoading: loading } = useNewsById(id)

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
      </div>
    )
  }

  if (!news) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
          Noticia no encontrada
        </h1>
        <p className="mt-4 text-base text-zinc-200">
          La noticia que buscas no existe o fue eliminada.
        </p>
        <Link
          to="/"
          className="mt-6 flex items-center gap-x-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold !text-black shadow-md transition-transform duration-200 hover:scale-105"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Volver al inicio</span>
        </Link>
      </main>
    )
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-12 md:py-20">
      <Link
        to="/"
        className="inline-flex items-center gap-x-2 text-sm font-semibold text-zinc-200 hover:text-white mb-8 transition-colors duration-150"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Volver al inicio</span>
      </Link>

      <article className="space-y-6">
        <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-zinc-200/20 shadow-lg">
          <img
            src={news.imageUrl}
            alt={news.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-200">
          <span className="flex items-center gap-x-1 bg-[#2b7fff] text-white font-bold px-3 py-1 rounded-full text-xs">
            <Tag className="h-3 w-3" />
            {news.category}
          </span>
          <span className="flex items-center gap-x-1">
            <Calendar className="h-4 w-4" />
            {news.date}
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
          {news.title}
        </h1>

        <p className="text-xl text-zinc-100 font-medium leading-relaxed border-l-4 border-white/30 pl-4 italic">
          {news.description}
        </p>

        <div
          className="prose prose-invert max-w-none text-zinc-200 leading-relaxed space-y-4 pt-4"
          dangerouslySetInnerHTML={{ __html: news.content }}
        />
      </article>
    </main>
  )
}
