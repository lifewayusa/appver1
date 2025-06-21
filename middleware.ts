// Middleware removido: autenticação agora é feita via Supabase Auth nas páginas e APIs.
// Se precisar de proteção de rotas, implemente via hooks ou server actions.
// teste
// Arquivo middleware.ts desativado: nenhuma lógica de middleware necessária para ambiente local.

export default function middleware() {
  // Middleware vazio: nenhuma lógica executada
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
