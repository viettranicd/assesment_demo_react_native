import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import ScreenHeader from '@/components/ScreenHeader';
import AnimatedView from '@/components/AnimatedView';
import AnimatedPressable from '@/components/AnimatedPressable';
import { NewBox } from '@/constants/Type';
import { boxApis } from '@/apis/box.api';
import { SafeAreaView } from 'react-native-safe-area-context';

interface BoxFormProps {
  mode: 'new' | 'edit';
  initialData?: NewBox;
  boxId?: string;
  onSuccess?: () => void;
}

interface FormState {
  values: NewBox;
  errors: {
    name?: string;
    ipAddress?: string;
    port?: string;
    id?: string
  };
}

export default function BoxForm({ mode, initialData, boxId, onSuccess }: BoxFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formState, setFormState] = useState<FormState>({
    values: {
      name: '',
      ipAddress: '',
      maxCameras: 10,
      description: '',
      port: '',
      macAddress: '',
      deviceId: ''
    },
    errors: {},
  });

  // If in edit mode and initialData is provided, populate the form
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormState(prev => ({
        ...prev,
        values: { ...prev.values, ...initialData }
      }));
    }
  }, [mode, initialData]);

  const handleChange = (field: keyof FormState['values'], value: string) => {
    setFormState(prev => ({
      ...prev,
      values: { ...prev.values, [field]: value },
      errors: { ...prev.errors, [field]: '' },
    }));
  };

  const validateForm = () => {
    const newErrors: FormState['errors'] = {};
    let isValid = true;

    if (!formState.values.deviceId) {
      newErrors.id = 'Id is required';
      isValid = false;
    }

    if (!formState.values.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    if (!formState.values.ipAddress.trim()) {
      newErrors.ipAddress = 'IP address is required';
      isValid = false;
    }
    if (!formState.values.port) {
      newErrors.port = 'Port is required';
      isValid = false;
    }

    setFormState(prev => ({ ...prev, errors: newErrors }));
    return isValid;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    if (isSubmitting) return;

    setIsSubmitting(true);
    console.log('========formState', formState.values)
    const submitPromise = mode === 'new' 
      ? boxApis.addBox(formState.values)
      : boxApis.updateBox(boxId!, formState.values);

    submitPromise
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['boxes'] });
        if (onSuccess) {
          onSuccess();
        } else {
          router.back();
        }
      })
      .catch((err) => {
        ToastAndroid.show(
          `Failed to ${mode === 'new' ? 'add' : 'update'} box, please try again later`,
          ToastAndroid.SHORT
        );
        console.error(err);
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <SafeAreaView style={styles.flexContainer} edges={['left', 'right', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flexContainer}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScreenHeader label={`${mode === 'new' ? 'New' : 'Edit'} Box`} />

        <AnimatedView delay={150} style={styles.flexContainer}>
          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            bounces={true}
          >
            {/* Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Device Id <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={[styles.input, formState.errors.name ? styles.inputError : null]}
                placeholder="Enter the box id"
                placeholderTextColor="#C7C7CD"
                value={formState.values.deviceId}
                onChangeText={(text) => handleChange('deviceId', text)}
              />
              {formState.errors.name ? <Text style={styles.errorText}>{formState.errors.id}</Text> : null}
            </View>

            {/* Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={[styles.input, formState.errors.name ? styles.inputError : null]}
                placeholder="Enter the box name"
                placeholderTextColor="#C7C7CD"
                value={formState.values.name}
                onChangeText={(text) => handleChange('name', text)}
              />
              {formState.errors.name ? <Text style={styles.errorText}>{formState.errors.name}</Text> : null}
            </View>

            {/* IP and Port */}
            <View style={styles.row}>
              <View style={[styles.column, styles.ipColumn]}>
                <Text style={styles.label}>IP <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={[styles.input, formState.errors.ipAddress ? styles.inputError : null]}
                  placeholder="Ip address"
                  placeholderTextColor="#C7C7CD"
                  value={formState.values.ipAddress}
                  onChangeText={(text) => handleChange('ipAddress', text)}
                  keyboardType="decimal-pad"
                />
                {formState.errors.ipAddress ? <Text style={styles.errorText}>{formState.errors.ipAddress}</Text> : null}
              </View>
              <View style={[styles.column, styles.portColumn]}>
                <Text style={styles.label}>Port <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={[styles.input, formState.errors.port ? styles.inputError : null]}
                  placeholder="Port"
                  placeholderTextColor="#C7C7CD"
                  value={formState.values.port}
                  onChangeText={(text) => handleChange('port', text)}
                  keyboardType="number-pad"
                />
                {formState.errors.port ? <Text style={styles.errorText}>{formState.errors.port}</Text> : null}
              </View>
            </View>

            {/* MAC Address */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>MAC address</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter the MAC address"
                placeholderTextColor="#C7C7CD"
                value={formState.values.macAddress}
                onChangeText={(text) => handleChange('macAddress', text)}
                autoCapitalize="characters"
              />
            </View>

            {/* Max num of camera */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Max num of camera</Text>
              <TextInput
                style={styles.input}
                placeholder="Max num of camera"
                placeholderTextColor="#C7C7CD"
                value={formState.values.maxCameras?.toString() ?? '10'}
                onChangeText={(text) => handleChange('maxCameras', text)}
                keyboardType="number-pad"
              />
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter the box description"
                placeholderTextColor="#C7C7CD"
                value={formState.values.description}
                onChangeText={(text) => handleChange('description', text)}
                multiline={true}
                numberOfLines={4}
              />
            </View>
          </ScrollView>
        </AnimatedView>
      </KeyboardAvoidingView>
      {/* Submit Button */}
      <View style={styles.buttonContainer}>
        <AnimatedPressable
          style={[styles.submitButton, isSubmitting ? styles.submitButtonDisabled : null]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>{mode === 'new' ? 'Submit' : 'Save'}</Text>
          )}
        </AnimatedPressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 25,
    paddingBottom: 20,
    paddingTop: 15,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 8,
  },
  required: {
    color: '#FF3B30',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 16,
    color: '#000',
  },
  inputError: {
    borderColor: '#FF3B30',
    borderWidth: 1,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  column: {
    flex: 1,
  },
  ipColumn: {
    flex: 0.6,
  },
  portColumn: {
    flex: 0.4,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  buttonContainer: {
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
}); 