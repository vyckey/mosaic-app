import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { Clock, ImagePlus, MapPin, Smile, X } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';

import {
  MosaicButton,
  MosaicDateTimePicker,
  MosaicDialog,
  MosaicEmojiPickerModal,
  MosaicIcon,
  MosaicImage,
  MosaicPressable,
  MosaicScreen,
  MosaicScreenHeader,
  MosaicSheet,
  MosaicTagsEditor,
  MosaicText,
  MosaicTextArea,
} from '@/components/mosaic';
import { Icon } from '@/components/ui/icon';
import type { EmojiValue } from '@/constants/emojis';
import { useI18n } from '@/i18n/useI18n';

import { formatRecordedAt } from './format';
import type { MomentLocation, MomentRecord } from './types';

const MAX_PHOTOS = 9;

const uuidV4 = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

export function MomentEditScreen() {
  const { t } = useI18n();
  const [recordedAt, setRecordedAt] = useState(() => new Date());
  const [pickerVisible, setPickerVisible] = useState(false);
  /** Wheel edits stay local until the sheet is confirmed. */
  const [draftRecordedAt, setDraftRecordedAt] = useState(() => new Date());
  const [tags, setTags] = useState<string[]>([]);
  const [emoji, setEmoji] = useState<EmojiValue | null>(null);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [text, setText] = useState('');
  const [photos, setPhotos] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [sourceVisible, setSourceVisible] = useState(false);
  const [location, setLocation] = useState<MomentLocation | null>(null);
  const [locating, setLocating] = useState(false);

  const canPublish = text.trim().length > 0 || photos.length > 0;

  const appendPhotos = (assets: ImagePicker.ImagePickerAsset[]) => {
    setPhotos((prev) => [...prev, ...assets].slice(0, MAX_PHOTOS));
  };

  const handleCamera = async () => {
    setSourceVisible(false);
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(t('moment.cameraDenied'), t('moment.cameraDeniedDesc'));
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });
    if (!result.canceled) {
      appendPhotos(result.assets);
    }
  };

  const handleLibrary = async () => {
    setSourceVisible(false);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: MAX_PHOTOS - photos.length,
      quality: 0.7,
    });
    if (!result.canceled) {
      appendPhotos(result.assets);
    }
  };

  const handleConfirm = () => {
    setRecordedAt(draftRecordedAt);
    setPickerVisible(false);
  };

  const handleLocation = async () => {
    if (location) {
      setLocation(null);
      return;
    }
    setLocating(true);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(t('moment.locationDenied'), t('moment.locationDeniedDesc'));
        return;
      }
      const position = await Promise.race([
        Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('LOCATION_TIMEOUT')), 15000),
        ),
      ]);
      const coords = position.coords;
      let name = `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`;
      let place: Location.LocationGeocodedAddress | null = null;
      try {
        place = await Promise.race([
          Location.reverseGeocodeAsync({
            latitude: coords.latitude,
            longitude: coords.longitude,
          }).then((places) => places[0] ?? null),
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000)),
        ]);
      } catch (error) {
        console.warn('reverse geocode failed:', error);
      }
      if (place) {
        name =
          [place.city, place.district, place.street]
            .filter(Boolean)
            .join(' ') ||
          place.region ||
          place.name ||
          name;
      }
      setLocation({
        longitude: coords.longitude,
        latitude: coords.latitude,
        source: 'GPS',
        accuracy_meters: coords.accuracy ?? undefined,
        altitude: coords.altitude ?? undefined,
        altitude_accuracy_meters: coords.altitudeAccuracy ?? undefined,
        captured_at: new Date().toISOString(),
        address: name,
        country_code: place?.isoCountryCode ?? undefined,
        admin_area: place?.region ?? undefined,
        city: place?.city ?? undefined,
        district: place?.district ?? undefined,
      });
    } catch (error) {
      console.warn('location failed:', error);
      Alert.alert(t('moment.locationFailed'), t('moment.locationFailedDesc'));
    } finally {
      setLocating(false);
    }
  };

  const handlePublish = () => {
    const record: MomentRecord = {
      record_id: uuidV4(),
      type: 'moment',
      subtype: 'moment',
      source: 'USER',
      content: {
        text: text.trim(),
        emoji: emoji?.emoji ?? '',
        media_ids: [],
      },
      location: location ?? undefined,
      tags: tags.map((name, index) => ({
        id: String(index + 1),
        name,
        source: 'USER',
      })),
      recorded_at: recordedAt.toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    console.log('publish moment:', {
      record,
      localMediaUris: photos.map((photo) => photo.uri),
    });
    router.back();
  };

  return (
    <MosaicScreen>
      <MosaicScreenHeader
        title={t('moment.editTitle')}
        onBack={() => router.back()}
        actions={[
          <MosaicButton
            key="publish"
            size="md"
            variant="glass"
            disabled={!canPublish}
            onPress={handlePublish}
          >
            {t('moment.publish')}
          </MosaicButton>,
        ]}
      />

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[18px] pb-10 pt-2"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="mt-3 flex-row items-center gap-2.5">
          <MosaicPressable
            onPress={() => {
              setDraftRecordedAt(recordedAt);
              setPickerVisible(true);
            }}
            hitSlop={{ top: 8, bottom: 8 }}
            className="flex-row items-center pr-2"
          >
            <Icon as={Clock} size="sm" className="text-text-muted" />
            <MosaicText variant="tiny" tone="text-muted" className="ml-1.5">
              {formatRecordedAt(recordedAt)}
            </MosaicText>
          </MosaicPressable>

          <MosaicPressable
            onPress={() => setEmojiPickerVisible(true)}
            hitSlop={{ top: 8, bottom: 8 }}
            className="flex-row items-center gap-1 self-start pr-1"
          >
            {emoji ? (
              <>
                <MosaicText variant="body">{emoji.emoji}</MosaicText>
                <MosaicText variant="tiny" tone="text-muted">
                  {emoji.label}
                </MosaicText>
              </>
            ) : (
              <>
                <MosaicIcon as={Smile} size="sm" tone="text-muted" />
                <MosaicText variant="tiny" tone="text-muted">
                  {t('moment.selectEmoji')}
                </MosaicText>
              </>
            )}
          </MosaicPressable>
        </View>

        <MosaicTagsEditor value={tags} onChange={setTags} className="mt-5" />

        <MosaicTextArea
          value={text}
          onChangeText={setText}
          placeholder={t('moment.placeholder')}
          containerClassName="mt-5"
        />

        <MosaicText variant="tiny" tone="text-muted" className="mb-2 mt-5">
          {t('moment.photos')} {photos.length}/{MAX_PHOTOS}
        </MosaicText>

        <View className="flex-row flex-wrap gap-2.5">
          {photos.map((photo, index) => (
            <View
              key={photo.assetId ?? `${photo.uri}-${index}`}
              className="h-24 w-24 overflow-hidden rounded-tile"
            >
              <MosaicImage source={{ uri: photo.uri }} />
              <MosaicPressable
                onPress={() =>
                  setPhotos((prev) => prev.filter((_, i) => i !== index))
                }
                className="absolute right-1 top-1 h-5 w-5 items-center justify-center rounded-full bg-surface"
              >
                <Icon as={X} size="2xs" className="text-text" />
              </MosaicPressable>
            </View>
          ))}

          {photos.length < MAX_PHOTOS && (
            <MosaicPressable
              onPress={() => setSourceVisible(true)}
              className="h-24 w-24 items-center justify-center rounded-tile border border-dashed border-border bg-surface"
            >
              <Icon as={ImagePlus} size="lg" className="text-text-muted" />
              <MosaicText variant="tiny" tone="text-muted" className="mt-1.5">
                {t('common.add')}
              </MosaicText>
            </MosaicPressable>
          )}
        </View>

        <MosaicPressable
          onPress={handleLocation}
          disabled={locating}
          hitSlop={{ top: 8, bottom: 8 }}
          className="mt-5 flex-row items-center self-start pr-2"
        >
          <Icon
            as={MapPin}
            size="sm"
            className={location ? 'text-primary' : 'text-text-muted'}
          />
          <MosaicText
            variant="tiny"
            tone={location ? 'text' : 'text-muted'}
            className="ml-1.5"
          >
            {locating
              ? t('moment.locating')
              : location
                ? (location.address ?? t('moment.addLocation'))
                : t('moment.addLocation')}
          </MosaicText>
          {location && (
            <MosaicPressable
              onPress={() => setLocation(null)}
              className="ml-1 h-4 w-4 items-center justify-center"
            >
              <Icon as={X} size="2xs" className="text-text-muted" />
            </MosaicPressable>
          )}
        </MosaicPressable>
      </ScrollView>

      {/* Date-time wheel in a centred dialog: the whole choice is visible at
          once and the recorded time only changes on confirm. */}
      <MosaicDialog
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        onConfirm={handleConfirm}
        title={t('moment.recordedAt')}
      >
        <MosaicDateTimePicker
          value={draftRecordedAt}
          mode="datetime"
          // minuteInterval={5}
          hourCycle="24h"
          onChange={setDraftRecordedAt}
        />
      </MosaicDialog>

      <MosaicEmojiPickerModal
        visible={emojiPickerVisible}
        value={emoji?.emoji ?? null}
        onChange={setEmoji}
        onClose={() => setEmojiPickerVisible(false)}
        maxWidth="90%"
      />

      <MosaicSheet
        visible={sourceVisible}
        onClose={() => setSourceVisible(false)}
        title={t('moment.addPhoto')}
      >
        <MosaicButton
          variant="primary"
          className="mb-2.5 w-full"
          onPress={handleCamera}
        >
          {t('moment.takePhoto')}
        </MosaicButton>
        <MosaicButton
          variant="secondary"
          className="w-full"
          onPress={handleLibrary}
        >
          {t('moment.chooseFromLibrary')}
        </MosaicButton>
      </MosaicSheet>
    </MosaicScreen>
  );
}
