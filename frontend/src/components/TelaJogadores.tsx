
import { PlayerCard } from "./PlayerCard";

export function TelaJogadores() {
  return (
    <>
      <h1>Tela de Jogadores</h1>
      <PlayerCard name="Neymar" age={34} mktValue={10} position="PE" />
      <PlayerCard name="Ronaldo" age={40} mktValue={5} position="CA" />
      <PlayerCard name="Marquinhos" age={30} mktValue={30} position="ZAG" />
      <PlayerCard name="Neymar" age={34} mktValue={10} position="PE" />
    </>
  );
}