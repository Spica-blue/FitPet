import { StyleSheet, Dimensions } from 'react-native';
const { width: screenW } = Dimensions.get('window');

export default StyleSheet.create({
  // container: {
  //   flex: 1,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#F5F9FF',
    alignItems: 'center',
    // borderWidth: 1,
  },
  profileCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 16,
    padding: 16,
    alignItems: 'center',
    // 그림자 (iOS)
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    // elevation (Android)
    elevation: 2,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 12,
  },
  stat: { 
    flex: 1, 
    // flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
    // borderWidth: 1,
    borderRadius: 16,
    marginRight: 10,
    marginLeft: 10,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,            // 헤더와 값 사이 여백
  },
  statIcon: { 
    width: 28,
    height: 28,
    // marginRight: 4,
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 2,
  },
  statLabel: {
    // marginTop: 6, 
    fontSize: 14, 
    color: '#666' 
  },
  statValue: { 
    // marginTop: 4, 
    fontSize: 16, 
    fontWeight: '500',
    color: "#666", 
  },
  avatar: {
    width: 96, 
    height: 96,
    borderRadius: 48,
    backgroundColor: '#eee',
    justifyContent: 'center', 
    alignItems: 'center',
    marginVertical: 12
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  username: { 
    fontSize: 20, 
    fontWeight: '700',
  },
  chartCard: {
    width: "100%",
    // marginTop: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    // iOS
    shadowColor: "#000",
    shadowOffset: { width:0, height:2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Android
    elevation: 2,
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },

  buttons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
  },
  outlineBtn: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#4A90E2',
    marginRight: 12,
  },
  outlineBtnText: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  filledBtn: {
    backgroundColor: '#4A90E2',
  },
  filledBtnText: {
    color: '#FFF',
    fontWeight: '600',
  },
});