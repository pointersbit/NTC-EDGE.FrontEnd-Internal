import { StyleSheet } from "react-native";
import { text } from 'src/styles/color';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30
  },
  alertMessage: {
    textAlign: 'center',
    color: text.default,
  },
  contentStyle: {
    padding: 30,
  },
  actionContainerStyle: {
    justifyContent: 'space-around',
  },
  confirmButton: {
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderWidth: 1,
    borderColor: text.default,
  },
  confirmText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelText: {
    color: text.default,
    fontSize: 14,
    fontWeight: '600',
  }
});

export default styles;