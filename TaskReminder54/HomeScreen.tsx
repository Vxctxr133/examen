import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { getTareas, deleteTarea, updateTarea } from './database';
import { Tarea } from './Tarea';
import { useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export default function HomeScreen({ navigation }: { navigation: StackNavigationProp<any> }) {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [filtro, setFiltro] = useState<'Todas' | 'Pendientes' | 'Completadas'>('Todas');
  const isFocused = useIsFocused();

  const loadTareas = async () => {
    const data = await getTareas();
    setTareas(data);
  };

  useEffect(() => {
    if (isFocused) loadTareas();
  }, [isFocused]);

  const toggleCompletada = async (tarea: Tarea) => {
    await updateTarea({ ...tarea, completada: !tarea.completada });
    loadTareas();
  };

  const handleRemove = async (id: number) => {
    Alert.alert(
      "Eliminar Tarea",
      "¿Estás seguro de que deseas eliminar esta tarea? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive", 
          onPress: async () => {
            await deleteTarea(id);
            loadTareas();
          } 
        }
      ]
    );
  };

  const tareasFiltradas = tareas.filter(t => {
    if (filtro === 'Pendientes') return !t.completada;
    if (filtro === 'Completadas') return t.completada;
    return true;
  });

  return (
    <View style={styles.container}>
      <View style={styles.filterBar}>
        {(['Todas', 'Pendientes', 'Completadas'] as const).map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFiltro(f)}
            style={[styles.filterTab, filtro === f && styles.filterTabActive]}
          >
            <Text style={[styles.filterText, filtro === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={tareasFiltradas}
        keyExtractor={(item) => item.id!.toString()}
        renderItem={({ item }) => (
          <View style={[styles.item, item.completada && styles.itemCompleted]}>
            <TouchableOpacity 
              style={{ flex: 1 }} 
              onPress={() => navigation.navigate('EditTask', { tarea: item })}
            >
              <Text style={[styles.title, item.completada && styles.titleCompleted]}>
                {item.completada ? '✅ ' : ''}{item.titulo}
              </Text>
              <Text>{item.descripcion}</Text>
              <Text style={styles.date}>{item.fechaRecordatorio}</Text>
            </TouchableOpacity>
            <Button title={item.completada ? "↩️" : "✅"} onPress={() => toggleCompletada(item)} />
            <Button title="X" color="red" onPress={() => handleRemove(item.id!)} />
          </View>
        )}
      />
      <Button title="Crear Nueva Tarea" onPress={() => navigation.navigate('CreateTask')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  item: { 
    padding: 15, 
    borderBottomWidth: 1, 
    borderColor: '#eee',
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  itemCompleted: {
    backgroundColor: '#f8f9fa',
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  titleCompleted: { 
    textDecorationLine: 'line-through', 
    color: '#aaa' 
  },
  date: { fontSize: 12, color: '#666' },
  filterBar: { 
    flexDirection: 'row', 
    marginBottom: 15,
    backgroundColor: '#e9ecef',
    borderRadius: 12,
    padding: 4
  },
  filterTab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 10 },
  filterTabActive: { backgroundColor: '#fff', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  filterText: { color: '#6c757d', fontWeight: '600' },
  filterTextActive: { color: '#007AFF', fontWeight: 'bold' }
});