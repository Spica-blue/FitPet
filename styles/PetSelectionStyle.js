import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: "#fff" 
  },
  title: { 
    fontSize: 18, 
    fontWeight: "bold", 
    marginBottom: 12 
  },
  list: { 
    alignItems: "center" 
  },
  card: {
    width: 140,
    alignItems: "center",
    margin: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    borderWidth: 2,
    borderColor: "transparent",
  },
  cardSelected: {
    borderColor: "#4CAF50",
    backgroundColor: "#E8F5E9",
  },
  anim: { 
    width: 100, 
    height: 100 
  },
  label: { 
    marginTop: 4, 
    fontSize: 14 
  },
  confirmButton: {
    marginTop: 24,
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
  },
  confirmText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  confirmDisabled: {
    backgroundColor: "#A5D6A7",
  }
});