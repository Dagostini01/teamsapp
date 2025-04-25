import { playersGetByGroup } from "./playerGetByGroup";

export async function playersGetByGroupAndTeam(group: string, team: string) {
  try {
    const storage = await playersGetByGroup(group); //pega os players do grupo

    const players = storage.filter((players) => players.team === team); //filtra os players do time recebido com o time do grupo

    return players;
  } catch (error) {
    throw error;
  }
}
