import React from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import AnimatedPressable from '@/components/AnimatedPressable';

interface Tab {
  key: string;
  label: string;
}

interface HorizontalTabBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabKey: string, tabIndex: number) => void;
  tabScrollRef?: React.RefObject<ScrollView>;
}

export default function HorizontalTabBar({ tabs, activeTab, onTabChange, tabScrollRef }: HorizontalTabBarProps) {
  return (
    <View style={styles.tabBarWrapper}>
      <ScrollView
        ref={tabScrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabBarScroll}
      >
        {tabs.map((tab, idx) => {
          const isActive = activeTab === tab.key;
          return (
            <AnimatedPressable
              key={tab.key}
              style={[styles.tabButton, isActive && styles.activeTabButton]}
              onPress={() => onTabChange(tab.key, idx)}
            >
              <Text style={[styles.tabButtonText, isActive && styles.activeTabButtonText]}>{tab.label}</Text>
            </AnimatedPressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarWrapper: {
    backgroundColor: '#e0e0e0',
    marginStart: 10,
    marginEnd: 10,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 15
  },
  tabBarScroll: {
    paddingLeft: 5,
    paddingRight: 5,
    alignItems: 'center',
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 16,
    // marginRight: 10,
    backgroundColor: 'transparent',
  },
  activeTabButton: {
    backgroundColor: '#2563eb',
  },
  tabButtonText: {
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
  },
  activeTabButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
}); 