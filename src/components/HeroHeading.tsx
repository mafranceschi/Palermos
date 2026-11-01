// Título de banner: etiqueta, título y una línea naranja que se "pinta" de
// izquierda a derecha, como una pasada de pistola. Animado con CSS para que se
// vea desde el primer pintado.
export function HeroHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
}) {
  return (
    <div>
      {eyebrow && (
        <p className="animate-fade-up text-[11px] font-bold uppercase tracking-[0.22em] text-orange-400">
          {eyebrow}
        </p>
      )}
      <h1 className="mt-1 animate-fade-up text-3xl font-extrabold tracking-tight [animation-delay:60ms] sm:text-4xl">
        {title}
      </h1>
      <span className="mt-3 block h-1 w-16 origin-left animate-draw-x rounded-full bg-gradient-to-r from-orange-500 to-orange-300 [animation-delay:200ms]" />
      {subtitle && (
        <p className="mt-3 animate-fade-in text-sm text-navy-100/90 [animation-delay:250ms] sm:text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
}
