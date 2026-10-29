import { router, useLocalSearchParams } from 'expo-router';
import { ImagePlus, Link2, MapPin, Users } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import {
  MosaicButton,
  MosaicCard,
  MosaicChipGroup,
  MosaicInput,
  MosaicList,
  MosaicListRow,
  MosaicScreen,
  MosaicScreenHeader,
  MosaicText,
  MosaicTextArea,
} from '@/components/mosaic';
import { useI18n } from '@/i18n/useI18n';

import { lifeEventCategories } from './categories';
import { findLifeEvent } from './mock';
import type {
  LifeEventCategoryId,
  LifeEventDatePrecision,
  LifeEventStatus,
} from './types';

/** Small form label with an optional required marker */
function FieldLabel({
  children,
  required = false,
}: {
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <View className="flex-row items-center gap-1">
      <MosaicText variant="caption" weight="600">
        {children}
      </MosaicText>
      {required && (
        <MosaicText variant="caption" tone="danger">
          *
        </MosaicText>
      )}
    </View>
  );
}

/**
 * Add / edit Life Event form (prototype).
 *
 * The date section honours real-world date precision: year only, year+month,
 * full date, or an approximate year range — the form never forces a fake day.
 * Saving currently walks back; persistence lands with the archive store.
 */
export function LifeEventCreateScreen() {
  const { t } = useI18n();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const existing = id ? findLifeEvent(id) : undefined;
  const today = new Date();

  const [category, setCategory] = useState<LifeEventCategoryId>(
    existing?.category ?? 'other',
  );
  const [title, setTitle] = useState(existing?.title ?? '');
  const [nameError, setNameError] = useState<string | null>(null);

  const [precision, setPrecision] = useState<LifeEventDatePrecision>(
    existing?.date.precision ?? 'month',
  );
  const [year, setYear] = useState(
    String(existing?.date.year ?? today.getFullYear()),
  );
  const [month, setMonth] = useState(
    String(existing?.date.month ?? today.getMonth() + 1),
  );
  const [day, setDay] = useState(String(existing?.date.day ?? today.getDate()));
  const [endYear, setEndYear] = useState(
    existing?.date.endYear ? String(existing.date.endYear) : '',
  );

  const [description, setDescription] = useState(existing?.description ?? '');
  const [status, setStatus] = useState<LifeEventStatus>(
    existing?.status ?? 'past',
  );

  const needsMonth = precision === 'month' || precision === 'day';
  const needsDay = precision === 'day';

  const categoryOptions = lifeEventCategories.map((item) => ({
    value: item.id as string,
    label: t(item.labelKey),
  }));

  const precisionOptions = [
    { value: 'year', label: t('lifeEvents.create.precision.year') },
    { value: 'month', label: t('lifeEvents.create.precision.month') },
    { value: 'day', label: t('lifeEvents.create.precision.day') },
    { value: 'range', label: t('lifeEvents.create.precision.range') },
  ];

  const statusOptions = [
    { value: 'past', label: t('lifeEvents.status.past') },
    { value: 'ongoing', label: t('lifeEvents.status.ongoing') },
  ];

  const handleSave = () => {
    if (!title.trim()) {
      setNameError(t('lifeEvents.create.nameRequired'));
      return;
    }

    // TODO: persist the life event into the life archive store
    console.log('save life event', {
      id: existing?.id,
      title: title.trim(),
      category,
      precision,
      year,
      month: needsMonth ? month : undefined,
      day: needsDay ? day : undefined,
      endYear: precision === 'range' ? endYear : undefined,
      description,
      status,
    });

    router.back();
  };

  return (
    <MosaicScreen>
      <MosaicScreenHeader
        title={
          existing
            ? t('lifeEvents.create.editTitle')
            : t('lifeEvents.create.title')
        }
        onBack={() => router.back()}
        actions={[
          <MosaicButton
            key="save"
            variant="glass"
            size="md"
            tone="primary"
            onPress={handleSave}
          >
            {t('common.save')}
          </MosaicButton>,
        ]}
      />

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-7 px-[18px] pb-10 pt-2"
        showsVerticalScrollIndicator={false}
      >
        <View>
          <MosaicText variant="title" weight="700">
            {t('lifeEvents.create.heading')}
          </MosaicText>
          <MosaicText variant="caption" tone="text-muted" className="mt-1.5">
            {t('lifeEvents.create.subtitle')}
          </MosaicText>
        </View>

        {/* Event type */}
        <View>
          <FieldLabel>{t('lifeEvents.create.type')}</FieldLabel>
          <MosaicChipGroup
            className="mt-3"
            options={categoryOptions}
            value={category}
            onChange={(value) => setCategory(value as LifeEventCategoryId)}
          />
        </View>

        {/* Event name */}
        <View>
          <FieldLabel required>{t('lifeEvents.create.name')}</FieldLabel>
          <MosaicInput
            wrapperClassName="mt-3"
            value={title}
            onChangeText={(value) => {
              setTitle(value);
              setNameError(null);
            }}
            placeholder={t('lifeEvents.create.namePlaceholder')}
            error={nameError}
          />
        </View>

        {/* When did it happen */}
        <View>
          <FieldLabel required>{t('lifeEvents.create.date')}</FieldLabel>
          <MosaicChipGroup
            className="mt-3"
            options={precisionOptions}
            value={precision}
            onChange={(value) => setPrecision(value as LifeEventDatePrecision)}
          />

          <View className="mt-3 flex-row gap-2">
            <MosaicInput
              wrapperClassName="flex-1"
              value={year}
              onChangeText={setYear}
              keyboardType="number-pad"
              maxLength={4}
              placeholder={t('lifeEvents.create.year')}
            />
            {needsMonth && (
              <MosaicInput
                wrapperClassName="flex-1"
                value={month}
                onChangeText={setMonth}
                keyboardType="number-pad"
                maxLength={2}
                placeholder={t('lifeEvents.create.month')}
              />
            )}
            {needsDay && (
              <MosaicInput
                wrapperClassName="flex-1"
                value={day}
                onChangeText={setDay}
                keyboardType="number-pad"
                maxLength={2}
                placeholder={t('lifeEvents.create.day')}
              />
            )}
            {precision === 'range' && (
              <MosaicInput
                wrapperClassName="flex-1"
                value={endYear}
                onChangeText={setEndYear}
                keyboardType="number-pad"
                maxLength={4}
                placeholder={t('lifeEvents.create.endYear')}
              />
            )}
          </View>
        </View>

        {/* Description */}
        <View>
          <FieldLabel>{t('lifeEvents.create.description')}</FieldLabel>
          <MosaicTextArea
            glass
            minHeight={110}
            value={description}
            onChangeText={setDescription}
            placeholder={t('lifeEvents.create.descriptionPlaceholder')}
            containerClassName="mt-3 px-3.5 py-3.5"
          />
        </View>

        {/* Related info */}
        <View>
          <MosaicText variant="body" weight="600">
            {t('lifeEvents.create.related')}
          </MosaicText>
          <MosaicCard padded={false} className="mt-3">
            <MosaicList>
              <MosaicListRow
                title={t('lifeEvents.create.addPhotos')}
                icon={ImagePlus}
                onPress={() => {
                  // TODO: photo picker (expo-image-picker)
                }}
              />
              <MosaicListRow
                title={t('lifeEvents.create.addLocation')}
                icon={MapPin}
                onPress={() => {
                  // TODO: location picker
                }}
              />
              <MosaicListRow
                title={t('lifeEvents.create.addPeople')}
                icon={Users}
                onPress={() => {
                  // TODO: people picker
                }}
              />
              <MosaicListRow
                title={t('lifeEvents.create.linkMoments')}
                icon={Link2}
                onPress={() => {
                  // TODO: pick linked Moment records
                }}
              />
            </MosaicList>
          </MosaicCard>
        </View>

        {/* Status */}
        <View>
          <FieldLabel>{t('lifeEvents.create.status')}</FieldLabel>
          <MosaicChipGroup
            className="mt-3"
            options={statusOptions}
            value={status}
            onChange={(value) => setStatus(value as LifeEventStatus)}
          />
        </View>
      </ScrollView>
    </MosaicScreen>
  );
}
