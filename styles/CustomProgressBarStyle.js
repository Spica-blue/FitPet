import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    justifyContent: 'center',
    position: 'relative',
  },
  track: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#eee',
    borderRadius: 6,       // height/2
  },
  fill: {
    position: 'absolute',
    left: 0,
    borderRadius: 6,       // height/2
  },
  label: {
    position: 'absolute',
    right: -36,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
});
