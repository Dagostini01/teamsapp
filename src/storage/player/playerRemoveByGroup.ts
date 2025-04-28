import AsyncStorage from "@react-native-async-storage/async-storage";
import { playersGetByGroup } from "./playerGetByGroup";
import { PLAYER_COLLECTION } from "@storage/storageConfig";

export async function playerRemoveByGroup(playerName: string, group: string) {
    try {
        const storage = await playersGetByGroup(group); //peguei os players pelo grupo

        const filtered = storage.filter(player => player.name !== playerName) //filtrei o player recebido com o player da linha acima
        const players = JSON.stringify(filtered) // passei a lista pra string

        await AsyncStorage.setItem(`${PLAYER_COLLECTION}-${group}`, players)

    } catch (error) {
        throw error;
    }
}