import AsyncStorage from "@react-native-async-storage/async-storage";
import { PLAYER_COLLECTION } from "@storage/storageConfig";
import { PlayerStorageDTO } from "./playerStorageDTO";
import { playersGetByGroup } from "./playerGetByGroup";
import { AppError } from "@utils/AppError";

export async function playerAddByGroup(newPlayer: PlayerStorageDTO, group: string) {
  try {

    const storedPlayers = await playersGetByGroup(group); //pega os nomes do players pelo grupo e retorna uma lista
    const playerAlreadyExists = storedPlayers.filter(player => player.name === newPlayer.name) //filtra o nome pela lista

    if(playerAlreadyExists.length > 0){ //se o nome existir trava
        throw new AppError('Essa pessoa já está adicionada em um time aqui.')
    }

    const storage = JSON.stringify([...storedPlayers, newPlayer]) //se nao adiciona tudo para nao duplicar

    await AsyncStorage.setItem(`${PLAYER_COLLECTION}-${group}`, storage); //aqui adiciona a variavel

  } catch (error) {
    throw error;

  }
}
