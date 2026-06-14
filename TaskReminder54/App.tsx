import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { initDatabase } from './database';
import { requestNotificationPermissions } from './NotificationService';
import HomeScreen from './HomeScreen';
import CreateTaskScreen from './CreateTaskScreen';
import EditTaskScreen from './EditTaskScreen';

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    const setup = async () => {
      // Inicializar base de datos SQLite
      await initDatabase();
      // Solicitar permisos de notificaciones
      await requestNotificationPermissions();
    };
    setup();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Mis Tareas' }} />
        <Stack.Screen name="CreateTask" component={CreateTaskScreen} options={{ title: 'Nueva Tarea' }} />
        <Stack.Screen name="EditTask" component={EditTaskScreen} options={{ title: 'Editar Tarea' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}