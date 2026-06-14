import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Switch, Text } from 'react-native';
import { updateTarea } from './database';
import { sendLocalNotification, scheduleTaskNotification } from './NotificationService';
import { Tarea } from './Tarea';

interface EditTaskProps {
  route: { params: { tarea: Tarea } };
  navigation: any;
}

export default function EditTaskScreen({ route, navigation }: EditTaskProps) {
  const { tarea } = route.params;
  const [titulo, setTitulo] = useState(tarea.titulo);
  const [descripcion, setDescripcion] = useState(tarea.descripcion);
  const [fecha, setFecha] = useState(tarea.fechaRecordatorio);
  const [completada, setCompletada] = useState(tarea.completada);

  const handleUpdate = async () => {
    if (!titulo.trim()) {
      Alert.alert('Error', 'El título es obligatorio');
      return;
    }

    const tareaEditada = {
      ...tarea,
      titulo,
      descripcion,
      fechaRecordatorio: fecha,
      completada,
    };

    await updateTarea(tareaEditada);
    await sendLocalNotification('Tarea Actualizada', `Se actualizó: ${titulo}`);
    await scheduleTaskNotification(titulo, descripcion, new Date(fecha));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Título" value={titulo} onChangeText={setTitulo} style={styles.input} />
      <TextInput placeholder="Descripción" value={descripcion} onChangeText={setDescripcion} style={styles.input} />
      <TextInput placeholder="Fecha (YYYY-MM-DD)" value={fecha} onChangeText={setFecha} style={styles.input} />
      <View style={styles.row}>
        <Text>Completada:</Text>
        <Switch value={completada} onValueChange={setCompletada} />
      </View>
      <Button title="Actualizar Tarea" onPress={handleUpdate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderBottomWidth: 1, marginBottom: 15, padding: 8 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }
});