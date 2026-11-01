// Entrada de cada página: sube apenas y aparece. Es CSS puro (no framer) para
// que arranque apenas se pinta la página, sin esperar a que cargue el JS.
// Va en template.tsx, que se vuelve a montar en cada navegación.
export function PageTransition({ children }: { children: React.ReactNode }) {
  return <div className="animate-fade-up">{children}</div>;
}
