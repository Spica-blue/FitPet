import React from 'react';
import { StyleSheet } from 'react-native';

const StepStyle = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#111',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  genderButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    flex: 1,
    marginHorizontal: 4,
  },
  genderButtonActive: {
    backgroundColor: '#ffe6e6',
  },
  genderIcon: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  genderText: {
    fontSize: 16,
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  input: {
    flex: 1,
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
    marginHorizontal: 4,
  },
  unitText: {
    fontSize: 16,
    marginRight: 12,
  },
  activityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  activityButton: {
    alignItems: 'center',
    flex: 1,
    padding: 8,
    marginHorizontal: 4,
  },
  activityButtonActive: {
    backgroundColor: '#e0f7fa',
    borderRadius: 16,
  },
  activityIcon: {
    width: 48,
    height: 48,
    marginBottom: 6,
  },
  activityLabel: {
    fontSize: 13,
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: '#111',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#aaa',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputBlock: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    padding: 8,
  },
  backButtonText: {
    fontSize: 20,
    color: '#333',
  },
  dietOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
  },
  dietOptionActive: {
    backgroundColor: '#e0f7fa',
  },
  dietIcon: {
    width: 48,
    height: 48,
    marginRight: 16,
  },
  dietTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dietDesc: {
    fontSize: 13,
    color: '#666',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',  // 반투명 검정
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
  },
  loadingBox: {
    backgroundColor: '#333',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default StepStyle