import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface ChipProps {
  label: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Chip({ label, style, textStyle }: ChipProps) {
  return (
    <View style={[styles.chip, style]}>
      <Text style={[styles.chipText, textStyle]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
    marginBottom: 4,
    backgroundColor: '#eee',
  },
  chipText: {
    color: '#222',
    fontWeight: '600',
    fontSize: 13,
  },
}); 