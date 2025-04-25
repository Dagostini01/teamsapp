import AsyncStorage from "@react-native-async-storage/async-storage";
import { GROUP_COLLECTION } from "@storage/storageConfig";

export async function groupsGetAll() {
  try {
    const storage = await AsyncStorage.getItem(GROUP_COLLECTION);
    const groups: string[] = storage ? JSON.parse(storage) : [];
    //se meu conteudo storage for verdade tem conteudo e devolvo o conteudo em forma de obj se nao devolvo vazio
    return groups;
  } catch (error) {
    throw error;
  }
}
