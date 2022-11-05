import { StyleSheet } from 'react-native';
import theme  from '../../theme/';

export const styles = StyleSheet.create({
  container: {
    height: 56,
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: theme.COLORS.BACKGROUND,
    color: theme.COLORS.TITLE,
    borderRadius: 8,
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#232129',
    paddingHorizontal: 16,
    paddingTop: 16,
    textAlignVertical: 'top'
  }
});