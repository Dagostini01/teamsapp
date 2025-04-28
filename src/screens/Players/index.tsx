import { useEffect, useRef, useState } from "react";
import { Alert, FlatList, TextInput } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import { AppError } from "@utils/AppError";

import { playerAddByGroup } from "@storage/player/playerAddByGroup";
import { playersGetByGroupAndTeam } from "@storage/player/playersGetByGroupAndTeam";

import { Container, Form, HeaderList, NumberOfPlayers } from "./styles";

import { ListEmpty } from "@components/ListEmpty";
import { Button } from "@components/Button";
import { PlayerCard } from "@components/PlayerCard";
import { Header } from "@components/Header";
import { Highlight } from "@components/Hightlight";
import { ButtonIcon } from "@components/ButtonIcon";
import { Input } from "@components/Input";
import { Filter } from "@components/Filter";
import { PlayerStorageDTO } from "@storage/player/playerStorageDTO";
import { playerRemoveByGroup } from "@storage/player/playerRemoveByGroup";
import { groupRemoveByName } from "@storage/group/groupRemoveByName";
import { Loading } from "@components/Loading";

type RouteParams = {
    group: string;
}

export function Players() {
    
    const [isLoading, setIsLoading] = useState(true);
    const [newPlayerName, setNewPlayerName] = useState(''); //armazena o nome digitado
    const [team, setTeam] = useState('Time A') //armazena o time
    const [players, setPlayers] = useState<PlayerStorageDTO[]>([]) //armazena os players

    const navigation = useNavigation();
    const route = useRoute();
    const { group } = route.params as RouteParams

    const newPlayerNameInputRef = useRef<TextInput>(null);

    async function handleAddPlayer() {
        if (newPlayerName.trim().length === 0) {
            return Alert.alert('Nova pessoa', 'Informe o nome da pessoa para adicionar.');
        }

        const newPlayer = {
            name: newPlayerName,
            team,
        }

        try {
            await playerAddByGroup(newPlayer, group)

            newPlayerNameInputRef.current?.blur();//tira o foco da caixa

            setNewPlayerName(''); //limpa o input
            fetchPlayersByTeam(); //atualiza no momento que adiciona o useEffect

        } catch (error) {
            if (error instanceof AppError) {
                Alert.alert('Nova pessoa', error.message);
            } else {
                console.log(error);
                Alert.alert('Nova pessoa', 'Não foi possível adicionar')
            }
        }
    }

    async function fetchPlayersByTeam() {
        try {
            setIsLoading(true);
            const playersByTeam = await playersGetByGroupAndTeam(group, team);
            setPlayers(playersByTeam)
            setIsLoading(false);
        } catch (error) {
            console.log(error)
            Alert.alert('Pessoas', 'Não foi possível carregar as pessoas do time selecionado.')
        }
    }

    async function handlePlayerRemove(playerName: string) {
        try {
            await playerRemoveByGroup(playerName, group)
            fetchPlayersByTeam();
        } catch (error) {
            Alert.alert('Remover pessoa', 'Não foi possível remover.')
        }
    }

    async function groupRemove() {
        try {
            await groupRemoveByName(group);
            navigation.navigate('groups');
        } catch (error) {
            console.log(error);
            Alert.alert('Remover grupo', 'Não foi possível remover o grupo.')
        }
    }

    async function handleGroupRemove() {
        Alert.alert('Remover', 'Deseja remover o grupo?',
            [
                { text: 'Não', style: 'cancel' },
                { text: 'Sim', onPress: () => { groupRemove() } }
            ])
    }

    useEffect(() => {
        fetchPlayersByTeam();

    }, [team]); //toda vez que o state de time mudar ela dispara o useEffect

    return (
        <Container>

            <Header showBackButton />
            <Highlight title={group} subtitle="adicione a galera e separe os times" />

            <Form>
                <Input
                    inputRef={newPlayerNameInputRef}
                    onChangeText={setNewPlayerName} //mantem o estado atualizado
                    value={newPlayerName} // o valor do nosso input é o nosso estado
                    placeholder="Nome da pessoa"
                    autoCorrect={false}
                    onSubmitEditing={handleAddPlayer} //enter no teclado dispara a funcao de add
                    returnKeyType="done" //icon de confirmar
                />
                <ButtonIcon icon="add" onPress={handleAddPlayer} />
            </Form>

            <HeaderList>
                {
                    isLoading ? <Loading /> :
                        <FlatList
                            data={['Time A', 'Time B']}
                            keyExtractor={item => item}
                            renderItem={({ item }) => (
                                <Filter
                                    title={item}
                                    isActive={item === team}
                                    onPress={() => setTeam(item)}
                                />
                            )}
                            horizontal
                        />
                }
                <NumberOfPlayers>{players.length}</NumberOfPlayers>
            </HeaderList>

            <FlatList
                data={players}
                keyExtractor={item => item.name}
                renderItem={({ item }) => (
                    <PlayerCard name={item.name} onRemove={() => { handlePlayerRemove(item.name) }} />
                )}
                ListEmptyComponent={() => (
                    <ListEmpty
                        message="Não há pessoas nesse time"
                    />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    { paddingBottom: 100 },
                    players.length === 0 && { flex: 1 }
                ]}
            />

            <Button title="Remover Turma" type="SECONDARY" onPress={handleGroupRemove} />

        </Container>
    )
}
