// Soft, blurred color fields behind the frosted surfaces: crimson, marigold and rhododendron.
// Purely decorative and fixed to the viewport.
export function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="bg-primary animate-drift absolute -top-40 -left-32 size-[34rem] rounded-full opacity-25 blur-3xl dark:opacity-30" />
      <div className="bg-accent animate-drift absolute -top-24 right-[-10rem] size-[30rem] rounded-full opacity-30 blur-3xl [animation-delay:-7s] dark:opacity-20" />
      <div className="bg-sale animate-drift absolute bottom-[-12rem] left-1/3 size-[36rem] rounded-full opacity-15 blur-3xl [animation-delay:-14s] dark:opacity-20" />
    </div>
  );
}
