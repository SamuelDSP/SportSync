export const GravidadeLesao = {
  Leve: "LEVE",
  Moderada: "MODERADA",
  Grave: "GRAVE",
} as const;

export type GravidadeLesao =
  (typeof GravidadeLesao)[keyof typeof GravidadeLesao];
