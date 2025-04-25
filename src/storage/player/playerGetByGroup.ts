import AsyncStorage from "@react-native-async-storage/async-storage";
import { PLAYER_COLLECTION } from "@storage/storageConfig";
import { PlayerStorageDTO } from "./playerStorageDTO";

export async function playersGetByGroup(group: string) {
  try {
    //aqui só pega o nome pelo grupo para aplicar na funcao de adicionar ao grupo
    const storage = await AsyncStorage.getItem(`${PLAYER_COLLECTION}-${group}`);
    const players: PlayerStorageDTO[] = storage ? JSON.parse(storage) : [];
    return players;
  } catch (error) {
    throw(error)
  }
}
