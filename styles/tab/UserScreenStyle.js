import { StyleSheet } from 'react-native';

export default StyleSheet.create({
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
  stat: { flex: 1, alignItems: 'center' },
  statIcon: { fontSize: 24 },
  statLabel: { marginTop: 4, fontSize: 12, color: '#666' },
  statValue: { marginTop: 4, fontSize: 16, fontWeight: 'bold' },
  avatar: {
    width: 80, height: 80,
    borderRadius: 40,
    backgroundColor: '#ececec',
    justifyContent: 'center', alignItems: 'center',
    marginVertical: 12
  },
  username: { fontSize: 18, fontWeight: 'bold' },
  subText: { color: '#999', marginTop: 4 },
  buttons: { flexDirection: 'row', marginTop: 12, width: '100%' },
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
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16
  },
  chartTitle: {
    fontSize: 16, fontWeight: 'bold',
    marginBottom: 8
  }
});