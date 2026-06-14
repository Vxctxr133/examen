import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { insertTarea } from './database';
import { sendLocalNotification, scheduleTaskNotification } from './NotificationService';

export default function CreateTaskScreen({ navigation }: any) {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);

  const handleSave = async () => {
    if (!titulo) return Alert.alert('Error', 'El título es obligatorio');
    
    const fechaObjeto = new Date(fecha);
    if (isNaN(fechaObjeto.getTime())) {
      return Alert.alert('Error', 'Formato de fecha inválido (YYYY-MM-DD)');
    }

    const nuevaTarea = {
      titulo,
      descripcion,
      fechaRecordatorio: fecha,
      completada: false,
    };

    await insertTarea(nuevaTarea);
    await sendLocalNotification('Tarea Creada', `Has creado la tarea: ${titulo}`);
    await scheduleTaskNotification(titulo, descripcion, fechaObjeto);
    
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Título" value={titulo} onChangeText={setTitulo} style={styles.input} />
      <TextInput placeholder="Descripción" value={descripcion} onChangeText={setDescripcion} style={styles.input} />
      <TextInput placeholder="Fecha (YYYY-MM-DD)" value={fecha} onChangeText={setFecha} style={styles.input} />
      <Button title="Guardar Tarea" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderBottomWidth: 1, marginBottom: 15, padding: 8 }
});