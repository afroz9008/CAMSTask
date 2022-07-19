/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {colors, images} from '../utils';
import {RNCamera} from 'react-native-camera';
import {useCamera} from 'react-native-camera-hooks';
import LiveVideoScreen from './LiveVideoScreen';

export default function LivePhotoScreen({navigation}) {
  const [image, setImage] = useState(null);
  const [{cameraRef}, {takePicture}] = useCamera(null);
  const [isOpenCamera, setIsOpenCamera] = useState(false);
  const [step, setStep] = useState(1);

  const openCamera = async () => {
    setIsOpenCamera(true);
  };

  const takePhoto = async () => {
    try {
      const data = await takePicture();
      setImage(data);
      setIsOpenCamera(false);
    } catch (er) {
      console.log(er, 'error');
    }
  };

  console.log(image);

  return (
    <>
      {step === 1 && (
        <View style={styles.main}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Live Photo</Text>
            {!isOpenCamera && !!image && (
              <TouchableOpacity activeOpacity={0.5} onPress={openCamera}>
                <Text style={styles.subtitle}>Retake photo</Text>
              </TouchableOpacity>
            )}
          </View>
          {!isOpenCamera && !!image ? (
            <View style={styles.imageBox}>
              <Image
                style={{height: '100%', width: "100%", transform: [{scaleX: -1}]}}
                source={{uri: image.uri}}
              />
            </View>
          ) : (
            <View style={styles.box}>
              {isOpenCamera ? (
                <RNCamera
                  ref={cameraRef}
                  mirrorImage={true}
                  fixOrientation={true}
                  type={RNCamera.Constants.Type.front}
                  style={styles.camera}
                />
              ) : (
                <View style={styles.iconRounded}>
                  <Icon color={colors.white} name="user" size={140} />
                </View>
              )}
            </View>
          )}
          <View style={styles.section}>
            <View style={styles.commentSection}>
              <Image
                source={images.commentInfoIcon}
                style={styles.commentIcon}
              />
              <Text style={styles.comment}>
                Please ensure your face is completely visible on screen for your
                KYC to be sucessfully processed.
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.button,
                isOpenCamera && {backgroundColor: colors.red},
              ]}
              activeOpacity={0.5}
              onPress={
                isOpenCamera ? takePhoto : image ? () => setStep(2) : openCamera
              }>
              {isOpenCamera ? (
                <Text style={styles.buttonTitle}>Capture Picture</Text>
              ) : !!image ? (
                <Text style={styles.buttonTitle}>Continue</Text>
              ) : (
                <>
                  <EvilIcons name="image" size={25} color={colors.white} />
                  <Text style={styles.buttonTitle}>Take Photo</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
      {step === 2 && <LiveVideoScreen />}
    </>
  );
}
const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.white,
    marginTop: 5,
    padding: 16,
  },
  camera: {
    height: 235,
    width: '100%',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.green,
  },
  subtitle: {
    color: colors.red,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  box: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    backgroundColor: colors.lightGrey,
    height: 235,
    borderRadius: 5,
    overflow: 'hidden',
  },
  section: {
    justifyContent: 'space-between',
    flex: 1,
  },
  iconRounded: {
    backgroundColor: '#cecece',
    height: 180,
    width: 180,
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentSection: {
    marginTop: 19,
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentIcon: {
    marginRight: 12,
  },
  comment: {
    fontSize: 14,
    color: colors.secondary,
  },
  button: {
    backgroundColor: colors.lightGreen,
    padding: 15,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonTitle: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 9,
  },
  imageBox: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.lightGrey,
    alignItems: 'center',
    marginTop: 15,
    height: 235,
    borderRadius: 5,
  },
});
