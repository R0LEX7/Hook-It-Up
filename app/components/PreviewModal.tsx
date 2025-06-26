import React from 'react';
import { Image, Modal, StyleSheet, View } from 'react-native';
import Button from './Button';

interface PreviewModalProps {
  visible: boolean;
  uri: string;
  onClose: () => void;
  onCancel: () => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({
  visible,
  uri,
  onClose,
  onCancel,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.container}>
        <Image source={{ uri }} resizeMode="contain" style={styles.image} />

        <View className="flex flex-col gap-6">
          <Button onPressHandler={onClose} title="continue" />
          <Button onPressHandler={onCancel} title="cancel" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '90%',
    height: '60%',
    borderRadius: 10,
  },
});

export default PreviewModal;
