import { useCallback, useState } from "react";
import { Alert, FlatList } from "react-native";

import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { Highlight } from "@components/Hightlight";
import { GroupCard } from "@components/GroupCard";
import { ListEmpty } from "@components/ListEmpty";
import { Header } from "@components/Header";
import { Button } from "@components/Button";

import { Container } from "./styles";
import { groupsGetAll } from "@storage/group/groupGetAll";
import { Loading } from "@components/Loading";

export function Groups() {

    const [isLoading, setIsLoading] = useState(true);
    const [groups, setGroups] = useState<string[]>([]);
    const navigation = useNavigation();

    function handleNewGroup() {
        navigation.navigate('new');
    }

    async function fetchGroups() {
        try {
            setIsLoading(true)
            const data = await groupsGetAll()
            setGroups(data)

        } catch (error) {
            console.log(error)
            Alert.alert('Turmas', 'Não foi possível carregar os grupos.')
        } finally {
            setIsLoading(false)
        }
    }

    function handleOpenGroup(group: string) {
        navigation.navigate('players', { group });
    }

    useFocusEffect(useCallback(() => {
        // console.log("use focus executou")
        fetchGroups();
    }, [])) //padrao do hoock utilizar o callback pois renderiza toda vez que voltar nessa pagina

    return (
        <Container>
            <Header />

            <Highlight
                title="Turmas"
                subtitle="jogue com sua turma"
            />

            {isLoading ? <Loading /> : <FlatList
                data={groups}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                    <GroupCard
                        title={item}
                        onPress={() => handleOpenGroup(item)}
                    />
                )}
                contentContainerStyle={groups.length === 0 && { flex: 1 }}
                ListEmptyComponent={() => (
                    <ListEmpty
                        message="Que tal cadastrar a primeira turma?"
                    />
                )}
            />}

            <Button title="Criar nova turma" onPress={handleNewGroup} />

        </Container>
    )
}