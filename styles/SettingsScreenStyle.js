import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f2f2f2' 
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff'
  },
  label: { 
    fontSize: 16 
  },
  value: { 
    color: '#666', 
    fontSize: 14 
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginLeft: 16
  },
  btn: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutBtn: {
    backgroundColor: '#ffffff',
  },
  unlinkBtn: {
    backgroundColor: '#ffdddd',
  },
  btnText: {
    fontSize: 16,
    fontWeight: '500',
  },
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    paddingVertical: 12,
    justifyContent: 'space-around',
  },
});
