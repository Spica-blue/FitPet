import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  // container: {
  //   flex: 1,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  container: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    alignItems: 'center'
  },
  profileCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12
  },
  stat: { 
    flex: 1, 
    alignItems: 'center' 
  },
  statIcon: { 
    fontSize: 24 
  },
  statLabel: {
    marginTop: 4, 
    fontSize: 12, 
    color: '#666' 
  },
  statValue: { 
    marginTop: 4, 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  avatar: {
    width: 80, height: 80,
    borderRadius: 40,
    backgroundColor: '#ececec',
    justifyContent: 'center', alignItems: 'center',
    marginVertical: 12
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  username: { 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  buttons: { 
    flexDirection: 'row', 
    marginTop: 12, 
    width: '100%' 
  },
  outlineBtn: {
    flex: 1, padding: 8, marginRight: 8,
    borderRadius: 20, borderWidth: 1, borderColor: '#ccc',
    alignItems: 'center'
  },
  filledBtn: {
    flex: 1, padding: 8,
    backgroundColor: '#000', borderRadius: 20,
    alignItems: 'center'
  },
  chartCard: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    // iOS
    shadowColor: "#000",
    shadowOffset: { width:0, height:2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Android
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
});