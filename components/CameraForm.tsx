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
import Checkbox from 'expo-checkbox';
import DropDownPicker from 'react-native-dropdown-picker';
import ScreenHeader from '@/components/ScreenHeader';
import AnimatedView from '@/components/AnimatedView';
import AnimatedPressable from '@/components/AnimatedPressable';
import ImageAnnotation from '@/components/ImageAnnotation';
import { cameraApis } from '@/apis/camera.api';
import { NewCamera, CamZone } from '@/constants/Type';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CameraFormProps {
  mode: 'new' | 'edit';
  /**
   * Initial form data. In "new" mode this can be partial (e.g. only boxId),
   * whereas in "edit" mode this should be the full camera object returned by the API.
   */
  initialData?: Partial<NewCamera>;
  /**
   * Box id used for query invalidation when a new camera is added
   */
  boxId?: string;
  /**
   * Camera id, required when mode === "edit"
   */
  cameraId?: string | number;
  /**
   * Called after a successful mutation. If omitted, the component will navigate back automatically.
   */
  onSuccess?: () => void;
}

interface FormErrors {
  name?: string;
  ipAddress?: string;
  port?: string;
  camUser?: string;
  camPass?: string;
  aiType?: string;
}

export default function CameraForm({ mode, initialData, boxId, cameraId, onSuccess }: CameraFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // AI Type dropdown state
  const [aiTypeOpen, setAiTypeOpen] = useState(false);
  const [aiTypeValue, setAiTypeValue] = useState<number | null>(null);
  const [aiTypeItems] = useState([
    { label: 'Warning', value: 1073741824 },
    { label: 'Detection', value: 1073741825 },
    { label: 'Recognition', value: 1073741826 },
  ]);

  // Compose default state
  const defaultZones: CamZone[] = [{
    zoneName: 'Zone 1',
    points: [[1073741824]],
  }];

  const [formData, setFormData] = useState<NewCamera>({
    name: '',
    description: '',
    ipAddress: '',
    port: '',
    boxId: initialData?.boxId ?? (boxId ? parseInt(boxId, 10) : 0),
    camUser: '',
    camPass: '',
    isEnable: true,
    aiType: [],
    zones: defaultZones,
    ...initialData, // spread after defaults so provided values overwrite
  });

  // Populate state once initialData arrives (e.g. after fetching in edit screen)
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
      }));
      if (initialData.aiType && initialData.aiType.length > 0) {
        setAiTypeValue(initialData.aiType[0]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  // Add errors state
  const [errors, setErrors] = useState<FormErrors>({});

  // Helper function to update form fields
  const updateFormField = (field: keyof NewCamera, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    setErrors(prev => ({
      ...prev,
      [field]: undefined,
    }));
  };

  // Validation helper
  const validateForm = () => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    if (!formData.ipAddress.trim()) {
      newErrors.ipAddress = 'IP address is required';
      isValid = false;
    }
    if (!formData.port.trim()) {
      newErrors.port = 'Port is required';
      isValid = false;
    }
    if (!formData.camUser.trim()) {
      newErrors.camUser = 'Camera user is required';
      isValid = false;
    }
    if (!formData.camPass.trim()) {
      newErrors.camPass = 'Camera password is required';
      isValid = false;
    }
    if (formData.aiType.length === 0) {
      newErrors.aiType = 'AI type is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm() || isSubmitting) return;
    setIsSubmitting(true);

    const submitPromise = mode === 'new'
      ? cameraApis.addCamera(formData)
      : cameraApis.updateCamera(typeof cameraId === 'number' ? cameraId : parseInt(cameraId as string, 10), formData);

    try {
      const response = await submitPromise;

      if (mode === 'new' && boxId && response && response.data) {
        // Optimistically update box detail cache to include the new camera
        queryClient.setQueryData(['box', boxId], (old: any) => {
          if (!old) return old;
          return {
            ...old,
            cameras: [...(old.cameras || []), response.data],
          };
        });
      }

      // Invalidate caches
      queryClient.invalidateQueries({ queryKey: ['cameras'] });
      queryClient.invalidateQueries({ queryKey: ['boxes'] });
      if (mode === 'edit' && cameraId) {
        queryClient.removeQueries({ queryKey: ['camera', cameraId] });
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.back();
      }
    } catch (err) {
      ToastAndroid.show(
        `Failed to ${mode === 'new' ? 'add' : 'update'} camera, please try again later`,
        ToastAndroid.SHORT
      );
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.flexContainer} edges={['left', 'right', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flexContainer}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScreenHeader label={`${mode === 'new' ? 'New' : 'Edit'} Camera`} />

        <AnimatedView delay={150} style={styles.mainContentWrapper}>
          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            bounces
          >
            {/* Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={[styles.input, errors.name ? styles.inputError : null]}
                placeholder="Enter the camera name"
                placeholderTextColor="#C7C7CD"
                value={formData.name}
                onChangeText={(value) => updateFormField('name', value)}
              />
              {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
            </View>

            {/* IP and Port */}
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>IP <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={[styles.input, errors.ipAddress ? styles.inputError : null]}
                  placeholder="Ip address"
                  placeholderTextColor="#C7C7CD"
                  value={formData.ipAddress}
                  onChangeText={(value) => updateFormField('ipAddress', value)}
                  keyboardType="decimal-pad"
                />
                {errors.ipAddress ? <Text style={styles.errorText}>{errors.ipAddress}</Text> : null}
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Port <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={[styles.input, errors.port ? styles.inputError : null]}
                  placeholder="Port"
                  placeholderTextColor="#C7C7CD"
                  value={formData.port}
                  onChangeText={(value) => updateFormField('port', value)}
                  keyboardType="number-pad"
                />
                {errors.port ? <Text style={styles.errorText}>{errors.port}</Text> : null}
              </View>
            </View>

            {/* Cam user and Cam password */}
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Cam user <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={[styles.input, errors.camUser ? styles.inputError : null]}
                  placeholder="Cam user"
                  placeholderTextColor="#C7C7CD"
                  value={formData.camUser}
                  onChangeText={(value) => updateFormField('camUser', value)}
                />
                {errors.camUser ? <Text style={styles.errorText}>{errors.camUser}</Text> : null}
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Cam password <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={[styles.input, errors.camPass ? styles.inputError : null]}
                  placeholder="Cam password"
                  placeholderTextColor="#C7C7CD"
                  value={formData.camPass}
                  onChangeText={(value) => updateFormField('camPass', value)}
                  secureTextEntry
                />
                {errors.camPass ? <Text style={styles.errorText}>{errors.camPass}</Text> : null}
              </View>
            </View>

            {/* AI Type Picker */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>AI type <Text style={styles.required}>*</Text></Text>
              <DropDownPicker
                open={aiTypeOpen}
                value={aiTypeValue}
                items={aiTypeItems}
                setOpen={setAiTypeOpen}
                setValue={setAiTypeValue}
                placeholder="Select a AI type"
                listMode="SCROLLVIEW"
                style={[styles.dropdown, errors.aiType ? styles.inputError : null, aiTypeOpen && {borderWidth: 1, borderColor: 'gray'}]}
                dropDownContainerStyle={styles.dropdownContainer}
                onChangeValue={(value) => value && updateFormField('aiType', [value])}
              />
              {errors.aiType ? <Text style={styles.errorText}>{errors.aiType}</Text> : null}
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter the camera description"
                placeholderTextColor="#C7C7CD"
                value={formData.description}
                onChangeText={(value) => updateFormField('description', value)}
                multiline
                numberOfLines={4}
              />
            </View>

            {/* Cam zone */}
            <View style={styles.inputGroup}>
              <ImageAnnotation />
            </View>

            {/* Enable Checkbox */}
            <View style={styles.checkboxContainer}>
              <Checkbox
                style={styles.checkbox}
                value={formData.isEnable}
                onValueChange={(value) => updateFormField('isEnable', value)}
                color={formData.isEnable ? '#007AFF' : undefined}
              />
              <Text style={styles.checkboxLabel}>Enable</Text>
            </View>
          </ScrollView>
        </AnimatedView>
      </KeyboardAvoidingView>
      {/* Submit button */}
      <View style={styles.buttonContainer}>
        <AnimatedPressable
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
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
  mainContentWrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scrollViewContent: {
    paddingHorizontal: 25,
    paddingBottom: 20,
    paddingTop: 10,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 8,
  },
  required: {
    color: '#FF0000',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
    fontSize: 16,
    color: '#000',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  column: {
    flex: 1,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: 10,
    width: 22,
    height: 22,
    borderRadius: 4,
  },
  checkboxLabel: {
    fontSize: 16,
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
  dropdown: {
    borderWidth: 0,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    minHeight: 50,
  },
  dropdownContainer: {
    borderTopWidth: 0,
    borderWidth: 1,
    borderColor: 'gray',
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#FF0000',
  },
  errorText: {
    color: '#FF0000',
    marginTop: 4,
    fontSize: 12,
    marginLeft: 4,
  },
}); 