import React from 'react';
import { View, Text, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AiBox } from '@/constants/Type';
import { formatDate } from '@/utils/helper';
import { getStatusTextStyle, mappingStatus } from '@/constants/Status';

interface BoxInformationTabProps {
  boxData: AiBox;
  isActive: boolean;
}

export default function BoxInformationTab({ boxData, isActive }: BoxInformationTabProps) {
  if (!isActive) {
    return null
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Detailed info and specs</Text>
      <View style={styles.card}>
        <View style={styles.grid}>
          {/* Left column */}
          <View style={styles.col}>
            <SpecItem icon="phone-portrait-outline" label="Box id" value={boxData.id.toString() || '-'} />
            <SpecItem icon="hardware-chip-outline" label="Device" value={boxData.name} />
            <SpecItem icon="camera-outline" label="Camera" value={boxData.cameras?.length ? `${boxData.cameras.length} cameras` : '-'} />
            <SpecItem icon="resize-outline" label="Last update" value={formatDate(boxData.updatedAt)} />
          </View>
          {/* Right column */}
          <View style={styles.col}>
            <SpecItem icon="battery-full-outline" label="IP address" value={boxData.ipAddress} />
            <SpecItem icon="server-outline" label="Port" value={boxData.port.toString()} />
            <SpecItem icon="phone-landscape-outline" label="Status" value={mappingStatus[boxData.status]} style={getStatusTextStyle(boxData.status)} />
            <SpecItem icon="resize-outline" label="Created at" value={formatDate(boxData.createdAt)} />
          </View>
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.descriptionLabel}>Description</Text>
        <Text style={styles.descriptionText}>{boxData.description || 'No description available'}</Text>
      </View>
    </View>
  );
}

function SpecItem({ icon, label, value, style = {} }: { icon: any; label: string; value: string, style?: StyleProp<TextStyle> }) {
  return (
    <View style={styles.specItem}>
      <Ionicons name={icon} size={20} color="#888" style={styles.specIcon} />
      <View style={{ flex: 1 }}>
        <Text style={styles.specLabel}>{label}</Text>
        <Text style={[styles.specValue, style]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#222',
    marginStart: 2
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    gap: 16,
  },
  col: {
    flex: 1,
    gap: 15,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 10,
  },
  specIcon: {
    marginTop: 2,
  },
  specLabel: {
    fontSize: 13,
    color: '#888',
    marginBottom: 2,
  },
  specValue: {
    fontSize: 15,
    color: '#222',
    fontWeight: '500',
    flexWrap: 'wrap',
  },
  descriptionLabel: {
    fontSize: 13,
    color: '#888',
    marginBottom: 2,
  },
  descriptionText: {
    fontSize: 15,
    color: '#222',
    fontWeight: '500',
    lineHeight: 22,
    minHeight: 100,
  },
}); 