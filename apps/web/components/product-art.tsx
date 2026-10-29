import { categoryIcons } from './category-icons.ts';

// Placeholder "package" art until real product photos are uploaded (admin, milestone 7).
// Colors are per category so the grid stays scannable.
const PALETTES: Record<string, [string, string, string]> = {
  'snacks-namkeen': ['#F8D893', '#E8A33D', '#5D3515'],
  noodles: ['#FCEDCB', '#D18620', '#5D3515'],
  'achar-pickles': ['#F6C4C0', '#CF3F35', '#5F1915'],
  'spices-masala': ['#F8C9A0', '#C2581F', '#5A2610'],
  'rice-daal-chiura': ['#F3ECE3', '#B89A6A', '#4A3A20'],
  tea: ['#CDE7D6', '#2E8B57', '#123A24'],
  sweets: ['#F9D3E1', '#D63A6E', '#5C1530'],
  frozen: ['#D6E6F8', '#3A7FD0', '#163A63'],
  'puja-samagri': ['#FBE3C4', '#E8862B', '#5D3515'],
  household: ['#E8ECF1', '#566377', '#161C25'],
};

export function ProductArt({
  categorySlug,
  brand,
  className = '',
  size = 'md',
}: {
  categorySlug: string;
  brand: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const [bg, accent, ink] = PALETTES[categorySlug] ?? PALETTES.household!;
  const Icon = categoryIcons[categorySlug as keyof typeof categoryIcons];
  const iconSize = { sm: 'size-7', md: 'size-12', lg: 'size-24' }[size];
  return (
    <div
      aria-hidden="true"
      className={`relative grid aspect-square place-items-center overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(120% 90% at 30% 20%, #fff8 0%, transparent 55%), ${bg}`,
      }}
    >
      <div
        className="absolute inset-x-[18%] top-[14%] bottom-[10%] rounded-[14%] shadow-lg"
        style={{
          background: `linear-gradient(160deg, ${accent} 0%, ${accent}dd 60%, ${ink}cc 100%)`,
        }}
      />
      <div className="absolute inset-x-[18%] top-[14%] h-[10%] rounded-t-[14%] bg-white/25" />
      {Icon ? (
        <Icon className={`relative text-white drop-shadow ${iconSize}`} strokeWidth={1.5} />
      ) : null}
      {size !== 'sm' && (
        <span className="absolute inset-x-[20%] bottom-[16%] truncate text-center text-[0.6rem] font-bold tracking-wider text-white/90 uppercase sm:text-xs">
          {brand}
        </span>
      )}
    </div>
  );
}
