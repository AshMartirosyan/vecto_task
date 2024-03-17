import React, { FC, memo } from 'react';
import { ActivityIndicator, Modal, StyleSheet, View } from 'react-native';
import colors from '../../assets/constants/colors';

interface Props {
  visible: boolean;
}

const Loading: FC<Props> = ({ visible }) => {
  return (
    <Modal visible={visible} transparent={true}>
      <View style={styles.loading}>
        <ActivityIndicator size={'large'} color={colors.primary} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: 'rgba(25,25,25,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default memo(Loading);
