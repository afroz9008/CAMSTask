/* eslint-disable prettier/prettier */
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feathericons from 'react-native-vector-icons/Feather';
import {colors, images} from '../utils';
import {RNCamera} from 'react-native-camera';
import {useCamera} from 'react-native-camera-hooks';
import Video from 'react-native-video';
import {ProgressBar} from 'react-native-paper';

export default function LiveVideoScreen() {
  const [videoLink, setVideoLink] = useState(null);
  const [{cameraRef}] = useCamera(null);
  const [isOpenCamera, setIsOpenCamera] = useState(false);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState({loaded: false, duration: 0});
  let player = useRef();

  useEffect(() => {
    if (isOpenCamera && cameraRef) {
      setTimeout(() => {
        (async () => {
          console.log(cameraRef.current, 'data');
          // cameraRef.current.stopRecording();
          if (cameraRef.current && cameraRef.current.recordAsync) {
            const data = await cameraRef.current.recordAsync();
            setVideoLink(data?.uri);
          }
        })();
      }, 200);
    }
  }, [isOpenCamera, cameraRef]);

  const openCamera = async () => {
    setIsOpenCamera(true);
  };

  const stopVideo = async () => {
    cameraRef?.current?.stopRecording();
    setIsOpenCamera(false);
  };

  const handleProgressPress = (e) => {
    const position = e.nativeEvent.locationX;
    const p = parseFloat(position / 250) * loaded.duration;
    const isPlaying = !paused;

    player.seek(p);
  };

  const handleProgress = (p) => {
    setProgress(parseFloat(p.currentTime) / parseFloat(loaded.duration));
  };

  const handleEnd = () => {
    setPaused(true);
    setProgress(0);
    player.seek(0);
  };

  const handleSeekBack = () => {
    const currentTime = progress - 0.5;
    setProgress(parseFloat(currentTime) / parseFloat(loaded.duration));
    player.seek(currentTime);
  };
  const handleSeekForwerd = () => {
    const currentTime = parseFloat(progress + 0.5);
    setProgress(parseFloat(currentTime) / parseFloat(loaded.duration));
    player.seek(currentTime);
  };

  const handleMainButtonTouch = () => {
    console.log('inside handleMainButtonTouch');
    console.log(progress);
    if (progress >= 1) {
      player.seek(0);
    }
    setPaused((p) => !p);
  };

  const handleLoad = (meta) => {
    setLoaded({
      loaded: true,
      duration: meta.duration,
    });
  };

  console.log(videoLink);

  return (
    <View style={styles.main}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Live Video</Text>
        {!!isOpenCamera && (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image source={images.recordIcon} style={styles.commentIcon} />
            <Text style={styles.subtitle}>Recording...</Text>
          </View>
        )}
        {!!videoLink && !isOpenCamera && (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity activeOpacity={0.5} onPress={openCamera}>
              <Text style={styles.subtitle}>Retake video</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {!!videoLink && !isOpenCamera ? (
        <View style={styles.imageBox}>
          <Video
            paused={paused}
            onLoad={handleLoad}
            onProgress={handleProgress}
            onEnd={handleEnd}
            resizeMode="cover"
            source={{uri: videoLink}} // Can be a URL or a local file.
            ref={(ref) => {
              player = ref;
            }} // Store reference
            style={{flex: 1, transform: [{scaleX: -1}], width: '100%'}}
          />

          {loaded.loaded && (
            <View style={[styles.iconRounded, {bottom: 0}]}>
              <View style={{marginHorizontal: 10}}>
                <TouchableWithoutFeedback onPress={handleSeekBack}>
                  <Ionicons
                    name="ios-play-back-outline"
                    size={25}
                    color={colors.white}
                  />
                </TouchableWithoutFeedback>
              </View>
              <View>
                <TouchableWithoutFeedback onPress={handleMainButtonTouch}>
                  <Ionicons
                    name={
                      !paused ? 'ios-pause-circle-outline' : 'ios-play-outline'
                    }
                    size={25}
                    color={colors.white}
                  />
                </TouchableWithoutFeedback>
              </View>
              <View style={{marginHorizontal: 10}}>
                <TouchableWithoutFeedback onPress={handleSeekForwerd}>
                  <Ionicons
                    name="ios-play-forward-outline"
                    size={25}
                    color={colors.white}
                  />
                </TouchableWithoutFeedback>
              </View>
              <TouchableWithoutFeedback onPress={handleProgressPress}>
                <View>
                  <ProgressBar
                    animated={false}
                    progress={progress}
                    color="#FFF"
                    borderColor="#FFF"
                    width={205}
                    height={5}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.box}>
          {isOpenCamera && (
            <RNCamera
              ref={cameraRef}
              defaultVideoQuality={RNCamera.Constants.VideoQuality['720p']}
              type={RNCamera.Constants.Type.front}
              style={styles.camera}
              androidCameraPermissionOptions={{
                title: 'Permission to use camera',
                message: 'We need your permission to use your camera',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
              }}
              androidRecordAudioPermissionOptions={{
                title: 'Permission to use audio recording',
                message: 'We need your permission to use your audio',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
              }}
            />
          )}
          <View style={[styles.iconRounded, isOpenCamera && {bottom: 0}]}>
            <Ionicons name="mic-outline" size={32} color={colors.white} />
            <Text style={styles.midtitle}>
              Please read out the date and time on your device.
            </Text>
          </View>
        </View>
      )}
      <View style={styles.section}>
        <View style={styles.commentSection}>
          <Image source={images.commentInfoIcon} style={styles.commentIcon} />
          <Text style={styles.comment}>
            Please ensure your face is completely visible on screen for your KYC
            to be sucessfully processed.
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.button, isOpenCamera && {backgroundColor: colors.red}]}
          activeOpacity={0.5}
          onPress={isOpenCamera ? stopVideo : videoLink ? () => 0 : openCamera}>
          {isOpenCamera ? (
            <>
              <Feathericons name="video-off" size={25} color={colors.white} />
              <Text style={styles.buttonTitle}>Stop Video</Text>
            </>
          ) : !!videoLink ? (
            <Text style={styles.buttonTitle}>Continue</Text>
          ) : (
            <>
              <Ionicons
                name="videocam-outline"
                size={25}
                color={colors.white}
              />
              <Text style={styles.buttonTitle}>Start Video</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
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
    height: '100%',
    width: '100%',
    top: 0,
    position: 'absolute',
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
    marginLeft: -5,
    textDecorationLine: 'underline',
  },
  box: {
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
  midtitle: {
    fontSize: 16,
    color: colors.white,
    marginLeft: 8,
  },
  iconRounded: {
    backgroundColor: 'rgba(2, 3, 3, 0.6)',
    padding: 10,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 65,
    position: 'absolute',
  },
  commentSection: {
    marginTop: 19,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
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
