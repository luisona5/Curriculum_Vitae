import React, { useState, useEffect } from "react";
import { ScrollView, View, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { InputField } from "../components/InputField";
import { NavigationButton } from "../components/NavigationButton";
import { PersonalInfo } from "../types/cv.types";
import { useCVContext } from "../context/CVContext";

export default function PersonalInfoScreen() {
  const { cvData, updatePersonalInfo } = useCVContext();
  const router = useRouter();

  const [formData, setFormData] = useState<PersonalInfo>(cvData.personalInfo);

  useEffect(() => {
    setFormData(cvData.personalInfo);
  }, [cvData.personalInfo]);

  const handleSave = () => {
    if (!formData.fullName || !formData.email) {
      Alert.alert("Error", "Por favor completa al menos el nombre y email");
      return;
    }

    updatePersonalInfo(formData);

    Alert.alert("Éxito", "Información guardada correctamente", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Nombre Completo */}
        <InputField
          label="Nombre Completo"
          placeholder="Juan Pérez"
          value={formData.fullName}
          onChangeText={(text) =>
            setFormData({ ...formData, fullName: text })
          }
        />

        {/* Email */}
        <InputField
          label="Email"
          placeholder="juan.perez@email.com"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Teléfono */}
        <InputField
          label="Teléfono"
          placeholder="+593 99 999 9999"
          value={formData.phone}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
          keyboardType="phone-pad"
        />

        {/* Ubicación */}
        <InputField
          label="Ubicación"
          placeholder="Quito, Ecuador"
          value={formData.location}
          onChangeText={(text) => setFormData({ ...formData, location: text })}
        />

        {/* Resumen Profesional */}
        <InputField
          label="Resumen Profesional"
          placeholder="Describe brevemente tu perfil profesional..."
          value={formData.summary}
          onChangeText={(text) => setFormData({ ...formData, summary: text })}
          multiline
          numberOfLines={4}
          style={{ height: 100, textAlignVertical: "top" }}
        />

        {/* Botones de Navegación */}
        <NavigationButton title="Guardar Información" onPress={handleSave} />
        <NavigationButton
          title="Cancelar"
          onPress={() => router.back()}
          variant="secondary"
        />
      </View>
    </ScrollView>
  );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 20,
  },
});