// Hash déterministe : un même tag donne toujours la même nuance.
// 5 nuances curatées qui s'accordent avec le thème sombre + doré.
// Couleurs inspirées de la palette Le Geai Éditions (sable, vert de minuit, rouge antique).

const PALETTE = ['gold', 'moss', 'antique', 'lavender', 'lune'] as const;

export type TagColor = (typeof PALETTE)[number];

export function tagColor(tag: string): TagColor {
  let h = 0;
  for (let i = 0; i < tag.length; i++) {
    h = ((h << 5) - h + tag.charCodeAt(i)) | 0;
  }
  return PALETTE[Math.abs(h) % PALETTE.length];
}
