export enum GravidadeLesao {
  Leve = "LEVE",
  Moderada = "MODERADA",
  Grave = "GRAVE",
}

export const diasPorGravidade: Record<GravidadeLesao, number> = {
  [GravidadeLesao.Leve]: 7,
  [GravidadeLesao.Moderada]: 21,
  [GravidadeLesao.Grave]: 60,
};
