import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import {
  getContext,
} from './integrations/tanstack-query/root-provider'

export function getRouter() {
  const context = getContext()

  const router = createTanStackRouter({
    routeTree,
    context,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    defaultNotFoundComponent: () => {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 select-none">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 max-w-md shadow-2xl backdrop-blur-md">
            <h1 className="text-6xl font-extrabold text-[#2b7fff] mb-2 tracking-tight">404</h1>
            <h2 className="text-xl font-bold text-white mb-4">Página no encontrada</h2>
            <p className="text-zinc-400 text-sm mb-6">
              La sección o página que estás buscando no existe o está en mantenimiento.
            </p>
            <a
              href="/"
              className="inline-flex items-center justify-center bg-[#2b7fff] hover:bg-[#1a6ee6] text-white font-bold py-2.5 px-6 rounded-full shadow-md transition-all duration-200 cursor-pointer"
            >
              Volver al inicio
            </a>
          </div>
        </div>
      )
    },
  })

  setupRouterSsrQueryIntegration({ router, queryClient: context.queryClient })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
