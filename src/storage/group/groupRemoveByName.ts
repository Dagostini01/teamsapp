import AsyncStorage from "@react-native-async-storage/async-storage";
import { groupsGetAll } from "./groupGetAll";
import { GROUP_COLLECTION, PLAYER_COLLECTION } from "@storage/storageConfig";

export async function groupRemoveByName(groupDeleted: string) {
  try {
    const storedGroups = await groupsGetAll(); //peguei todos os grupos
    const groups = storedGroups.filter((group) => group !== groupDeleted); //filtrei o grupo digitado com o do parametro

    await AsyncStorage.setItem(GROUP_COLLECTION, JSON.stringify(groups)) //inseri os grupos com o filtro no async storage
    await AsyncStorage.removeItem(`${PLAYER_COLLECTION}-${groupDeleted}`); //deleto o grupo todo
    
  } catch (error) {
    throw error;
  }
}
