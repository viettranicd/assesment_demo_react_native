import React from "react";
import { StyleProp, StyleSheet, Text, TextStyle, TextInput as TInput } from "react-native";

interface TextInputProps {
    placeholderTextColor?: string
    lablel?: string
    style?: StyleProp<TextStyle>
    value: string
    onChangeText: (text: string) => void
    secureTextEntry?: boolean
    placeholder?: string
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
    keyboardType?: 'default' | 'number-pad' | 'decimal-pad' | 'numeric' | 'email-address' | 'phone-pad'
    returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send'
    autoCorrect?: boolean
    multiline?: boolean
    maxLength?: number
    onSubmitEditing?: () => void
    editable?: boolean
    onBlur?: () => void
    onFocus?: () => void
    selectionColor?: string
    underlineColorAndroid?: string
    readonly?: boolean
}
export default function TextInput(props: TextInputProps) {
  const {
    lablel = '',
    placeholderTextColor = "#A8A8A8",
    placeholder,
    value,
    onChangeText,
    secureTextEntry = false,
    autoCapitalize = "none",
    keyboardType,
    returnKeyType,
    autoCorrect,
    multiline,
    maxLength,
    onSubmitEditing,
    editable,
    onBlur,
    onFocus,
    selectionColor,
    underlineColorAndroid,
    style,
    readonly
  } = props
    return (
      <>
        <Text style={styles.inputLabel}>{lablel}</Text>
        <TInput
          style={style}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          placeholderTextColor={placeholderTextColor}
          returnKeyType={returnKeyType}
          readOnly={readonly}
          onFocus={onFocus}
          onBlur={onBlur}
          selectionColor={selectionColor}
          underlineColorAndroid={underlineColorAndroid}
          secureTextEntry={secureTextEntry}
          autoCorrect={autoCorrect}
          multiline={multiline}
          maxLength={maxLength}
          onSubmitEditing={onSubmitEditing}
          editable={editable}
        />
      </>
    )
}

const styles = StyleSheet.create({
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#000',
    fontWeight: '500'
  },
})