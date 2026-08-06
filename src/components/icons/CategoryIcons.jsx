/* Premium, outline-style barbershop category icons.
   Shared visual treatment: round caps/joins, uniform 1.8 stroke, currentColor.
   Consistent with the lucide icon family used across the app. */

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

/* Navaja de afeitar (open straight razor) */
export function RazorIcon({ className, ...props }) {
  return (
    <svg {...base} className={className} aria-hidden="true" {...props}>
      <path d="M4.5 15 L12 7 L18 13" />
      <path d="M18 13 L21 16 L18 19 L15 16 Z" />
      <path d="M12 7 v2.5" />
    </svg>
  )
}

/* Máquina de cortar pelo (hair clippers) */
export function ClippersIcon({ className, ...props }) {
  return (
    <svg {...base} className={className} aria-hidden="true" {...props}>
      <rect x="7" y="3.5" width="10" height="12" rx="2" />
      <path d="M9.5 15.5 v2.5 M12 15.5 v3 M14.5 15.5 v2.5" />
      <path d="M9.5 6.5 h5" />
      <path d="M10.5 10 h3" opacity="0.7" />
    </svg>
  )
}

/* Barba (beard silhouette) */
export function BeardIcon({ className, ...props }) {
  return (
    <svg {...base} className={className} aria-hidden="true" {...props}>
      <path d="M6 9.5 C6 5.5 8.5 4.5 12 4.5 C15.5 4.5 18 5.5 18 9.5 C18 13.5 17 18.5 12 19 C7 18.5 6 13.5 6 9.5 Z" />
      <path d="M8.5 13.5 C10 15 14 15 15.5 13.5" />
      <path d="M9.5 9 h2 M12.5 9 h2" />
    </svg>
  )
}

/* Bigote (mustache) */
export function MustacheIcon({ className, ...props }) {
  return (
    <svg {...base} className={className} aria-hidden="true" {...props}>
      <path d="M4.5 11 C6 8.5 8.5 9.5 9 11.5 L10 14.5 C10.6 16 13.4 16 14 14.5 L15 11.5 C15.5 9.5 18 8.5 19.5 11 C19.9 12.4 18.8 13.8 17 14.8 C15 15.8 13 16 12 16 C11 16 9 15.8 7 14.8 C5.2 13.8 4.1 12.4 4.5 11 Z" />
    </svg>
  )
}

/* Peine (comb) */
export function CombIcon({ className, ...props }) {
  return (
    <svg {...base} className={className} aria-hidden="true" {...props}>
      <rect x="3" y="8.5" width="18" height="3.5" rx="1.5" />
      <path d="M5 12 v5.5 M8 12 v5.5 M11 12 v5.5 M14 12 v5.5 M17 12 v5.5" />
      <path d="M6.5 5.5 v1 M9.5 5.5 v1 M12 5.5 v1 M14.5 5.5 v1 M17.5 5.5 v1" />
    </svg>
  )
}

/* Productos capilares (hair products bottle) */
export function ProductsIcon({ className, ...props }) {
  return (
    <svg {...base} className={className} aria-hidden="true" {...props}>
      <path d="M10.5 9.5 v-3 a1.5 1.5 0 0 1 3 0 v3" />
      <rect x="8" y="9.5" width="8" height="9.5" rx="1.5" />
      <path d="M9.5 14 h5" />
      <path d="M12 16.5 h2" />
    </svg>
  )
}

/* Silla de barbería (barber chair) */
export function ChairIcon({ className, ...props }) {
  return (
    <svg {...base} className={className} aria-hidden="true" {...props}>
      <path d="M7.5 10.5 v-4.5 a2 2 0 0 1 2 -2 h5 a2 2 0 0 1 2 2 v4.5" />
      <rect x="5" y="10.5" width="14" height="5" rx="2" />
      <path d="M12 15.5 v4 M8.5 19.5 h7" />
    </svg>
  )
}

/* Tijeras clásicas (kept for nav/tools) */
export function RazorEdgeIcon({ className, ...props }) {
  return (
    <svg {...base} className={className} aria-hidden="true" {...props}>
      <path d="M4 6 L13 14 L20 6" />
      <circle cx="6" cy="17.5" r="1.8" />
      <circle cx="18" cy="17.5" r="1.8" />
    </svg>
  )
}
