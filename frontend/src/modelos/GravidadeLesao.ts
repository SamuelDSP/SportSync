<<<<<<< HEAD
export const GravidadeLesao = {
  Leve: "LEVE",
  Moderada: "MODERADA",
  Grave: "GRAVE",
} as const;

export type GravidadeLesao =
  (typeof GravidadeLesao)[keyof typeof GravidadeLesao];
=======
export enum GravidadeLesao {
  Leve = "LEVE",
  Moderada = "MODERADA",
  Grave = "GRAVE",
}
>>>>>>> a17991ab5b845bdab0ec810885650305b5353c77
