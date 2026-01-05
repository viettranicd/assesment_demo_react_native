import { StyleSheet, View, Text } from 'react-native'
import AnimatedPressable from './AnimatedPressable'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

interface ScreenHeaderProps {
  label: string
  leftContent?: React.ReactElement | React.ReactElement[]
  rightContent?: React.ReactElement | React.ReactElement[]
}

export default function ScreenHeader(props: ScreenHeaderProps) {
  const {
    label,
    rightContent
  } = props

  const router = useRouter()

  return (
    <View style={styles.header}>
      <AnimatedPressable
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <Ionicons name="chevron-back" size={24} color="black" />
      </AnimatedPressable>
      <View style={styles.headerTitleContainer}>
        <Text style={styles.headerTitle}>{label}</Text>
      </View>
      {rightContent && (
        <View style={styles.rightContent}>
          {rightContent}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    // backgroundColor: '#',
    position: 'relative',
    marginBottom: 10,
    marginTop: 10,
  },
  backButton: {
    // padding: 8,
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  headerTitleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  rightContent: {
    position: 'absolute',
    right: 16,
    // flexDirection: 'row',
  }
})