import { router } from 'expo-router';
import {
  ChevronRight,
  ImagePlus,
  MapPin,
  MoreHorizontal,
  Users,
} from 'lucide-react-native';
import { useState } from 'react';
import { Alert, ScrollView, useWindowDimensions, View } from 'react-native';

import {
  glassRimStyle,
  glassSurfaceClassName,
  MosaicCard,
  MosaicGlass,
  MosaicIcon,
  MosaicImage,
  MosaicImagePreview,
  MosaicList,
  MosaicListRow,
  MosaicMenu,
  MosaicMenuItem,
  MosaicMenuSeparator,
  MosaicPressable,
  MosaicScreen,
  MosaicScreenHeader,
  MosaicText,
  useMosaicImagePreview,
} from '@/components/mosaic';
import { useTheme } from '@/hooks/use-theme';
import { useI18n } from '@/i18n/useI18n';

import { getLifeEventCategory } from './categories';
import { formatLifeEventDate } from './format';
import { findLifeEvent } from './mock';

export interface LifeEventDetailScreenProps {
  eventId: string;
}

const pad2 = (value: number) => String(value).padStart(2, '0');

/** `2020-06-10` label for linked moments */
function formatMomentDate(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

/** At most this many thumbnails are shown before the “+N” overflow tile */
const MAX_PHOTO_THUMBNAILS = 3;

/**
 * Life event detail — a personal archive page, not a feed post. The content
 * hierarchy is title → story → related photos → details → linked Moments;
 * photos are optional thumbnails and never reserve a hero-sized empty box.
 */
export function LifeEventDetailScreen({ eventId }: LifeEventDetailScreenProps) {
  const { t } = useI18n();
  const theme = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const preview = useMosaicImagePreview();
  // Local-only picker state: the inline picker is still unwired to the archive
  // store, so it just needs a stable value to render against.
  const [date, setDate] = useState(() => new Date());
  const event = findLifeEvent(eventId);

  if (!event) {
    return (
      <MosaicScreen>
        <MosaicScreenHeader
          title={t('lifeEvents.detail.title')}
          onBack={() => router.back()}
        />
        <View className="flex-1 items-center justify-center px-[18px]">
          <MosaicText variant="body" tone="text-muted">
            {t('lifeEvents.detail.notFound')}
          </MosaicText>
        </View>
      </MosaicScreen>
    );
  }

  const category = getLifeEventCategory(event.category);
  const photos = event.photos ?? [];
  const visiblePhotos = photos.slice(0, MAX_PHOTO_THUMBNAILS);
  const remainingPhotos = photos.length - visiblePhotos.length;
  // Three equal thumbnails across the content width: 18px gutters + 8px gaps
  const thumbnailSize = Math.floor(
    (windowWidth - 18 * 2 - 8 * (MAX_PHOTO_THUMBNAILS - 1)) /
      MAX_PHOTO_THUMBNAILS,
  );
  // Long-form story text reads better with a relaxed line height (≈1.7)
  const storyLineHeight = Math.round(theme.typography.body.fontSize * 1.7);

  const handleEdit = () => {
    router.push({
      pathname: '/me/life-events/new',
      params: { id: event.id },
    });
  };

  const handleDuplicate = () => {
    // TODO: duplicate the event once the archive store lands
    console.log('duplicate life event:', event.id);
  };

  const handleDelete = () => {
    Alert.alert(
      t('lifeEvents.detail.deleteTitle'),
      t('lifeEvents.detail.deleteMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => {
            // TODO: remove from the archive store once persistence lands
            router.back();
          },
        },
      ],
    );
  };

  const openPreview = (index: number) => {
    preview.open(
      photos.map((uri) => ({ uri })),
      index,
    );
  };

  return (
    <MosaicScreen>
      <MosaicScreenHeader
        title={t('lifeEvents.detail.title')}
        onBack={() => router.back()}
        actions={[
          // A single overflow menu keeps destructive actions off the page.
          <MosaicMenu
            key="more"
            trigger={
              <MosaicPressable
                accessibilityLabel={t('common.more')}
                className="h-11 w-11 items-center justify-center overflow-hidden rounded-full"
              >
                <MosaicGlass
                  className={glassSurfaceClassName}
                  style={glassRimStyle}
                />
                <MosaicIcon as={MoreHorizontal} size="md" tone="text" />
              </MosaicPressable>
            }
          >
            <MosaicMenuItem id="edit" icon="pencil" onPress={handleEdit}>
              {t('lifeEvents.detail.edit')}
            </MosaicMenuItem>
            <MosaicMenuItem
              id="duplicate"
              icon="doc.on.doc"
              onPress={handleDuplicate}
            >
              {t('lifeEvents.detail.duplicate')}
            </MosaicMenuItem>
            <MosaicMenuSeparator />
            <MosaicMenuItem
              id="delete"
              icon="trash"
              destructive
              onPress={handleDelete}
            >
              {t('lifeEvents.detail.delete')}
            </MosaicMenuItem>
          </MosaicMenu>,
        ]}
      />

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[18px] pb-10 pt-2"
        showsVerticalScrollIndicator={false}
      >
        {/* Identity: category, title, then the date — the title is the hero */}
        <View className="flex-row items-center gap-1.5">
          <MosaicIcon as={category.icon} size="sm" tone="primary" />
          <MosaicText variant="caption" tone="primary" weight="600">
            {t(category.labelKey)}
          </MosaicText>
        </View>

        <MosaicText variant="display" weight="700" className="mt-2">
          {event.title}
        </MosaicText>

        <View className="mt-4 flex-row flex-wrap items-center gap-2">
          <MosaicText variant="caption" tone="text-muted">
            {formatLifeEventDate(event.date, t)}
          </MosaicText>
          {event.status === 'ongoing' && (
            <View className="rounded-full bg-primary-muted px-2 py-0.5">
              <MosaicText variant="tiny" tone="primary" weight="600">
                {t('lifeEvents.status.ongoing')}
              </MosaicText>
            </View>
          )}
        </View>

        {/* Story: body copy, full length, never truncated */}
        {event.description ? (
          <View className="mt-8">
            <MosaicText variant="body" weight="600">
              {t('lifeEvents.detail.story')}
            </MosaicText>

            {event.description
              .split('\n')
              .filter((paragraph) => paragraph.trim().length > 0)
              .map((paragraph, index) => (
                <MosaicText
                  key={`paragraph-${index}`}
                  variant="body"
                  className="mt-3"
                  style={{ lineHeight: storyLineHeight }}
                >
                  {paragraph}
                </MosaicText>
              ))}
          </View>
        ) : null}

        {/* Related photos: compact thumbnails, no empty hero container */}
        <View className="mt-8">
          <View className="flex-row items-center justify-between">
            <MosaicText variant="body" weight="600">
              {t('lifeEvents.detail.photos')}
            </MosaicText>
            {photos.length > 0 && (
              <MosaicText variant="tiny" tone="text-muted">
                {t('lifeEvents.detail.photoCount', { count: photos.length })}
              </MosaicText>
            )}
          </View>

          {photos.length > 0 ? (
            <View className="mt-3 flex-row gap-2">
              {visiblePhotos.map((uri, index) => {
                const isOverflowTile =
                  index === visiblePhotos.length - 1 && remainingPhotos > 0;

                return (
                  <View
                    key={`${uri}-${index}`}
                    style={{ width: thumbnailSize, height: thumbnailSize }}
                  >
                    <MosaicImage
                      source={{ uri }}
                      width={thumbnailSize}
                      height={thumbnailSize}
                      radius="stat"
                      onPress={() => openPreview(index)}
                    />
                    {isOverflowTile && (
                      <MosaicPressable
                        onPress={() => openPreview(index)}
                        className="absolute inset-0 items-center justify-center rounded-stat bg-black/40"
                      >
                        <MosaicText
                          variant="title"
                          tone="primary-foreground"
                          weight="600"
                        >
                          +{remainingPhotos}
                        </MosaicText>
                      </MosaicPressable>
                    )}
                  </View>
                );
              })}
            </View>
          ) : (
            // No photos: a lightweight text entry instead of a blank frame
            <MosaicPressable
              onPress={() => {
                // TODO: open the photo picker once editing is wired up
                console.log('add photos:', event.id);
              }}
              className="mt-3 flex-row items-center gap-3 rounded-card border border-dashed border-border px-4 py-3"
            >
              <View className="h-9 w-9 items-center justify-center rounded-full bg-primary-muted">
                <MosaicIcon as={ImagePlus} size="sm" tone="primary-strong" />
              </View>
              <View className="min-w-0 flex-1">
                <MosaicText variant="caption" weight="600">
                  {t('lifeEvents.detail.addPhotos')}
                </MosaicText>
                <MosaicText variant="tiny" tone="text-muted" className="mt-0.5">
                  {t('lifeEvents.detail.photosEmpty')}
                </MosaicText>
              </View>
            </MosaicPressable>
          )}
        </View>

        {/* Details: location and people as a compact fact list */}
        <View className="mt-8">
          <MosaicText variant="body" weight="600">
            {t('lifeEvents.detail.info')}
          </MosaicText>

          <MosaicList divided={false}>
            <MosaicListRow
              icon={MapPin}
              title={t('lifeEvents.detail.location')}
              value={event.location}
              placeholder={t('lifeEvents.detail.notAdded')}
              chevron={false}
            />
            <MosaicListRow
              icon={Users}
              title={t('lifeEvents.detail.people')}
              value={event.people?.join(', ')}
              placeholder={t('lifeEvents.detail.notAdded')}
              chevron={false}
            />
          </MosaicList>
        </View>

        {/* Linked Moments: the event aggregates the life it contains */}
        {event.moments?.length ? (
          <View className="mt-8">
            <View className="flex-row items-center justify-between">
              <MosaicText variant="body" weight="600">
                {t('lifeEvents.detail.relatedMoments')}
              </MosaicText>
              <MosaicPressable
                onPress={() => {
                  // TODO: navigate to the filtered Moment list
                  console.log('view all moments of:', event.id);
                }}
                className="flex-row items-center gap-0.5"
              >
                <MosaicText variant="tiny" tone="primary" weight="500">
                  {t('lifeEvents.detail.viewAll')}
                </MosaicText>
                <MosaicIcon as={ChevronRight} size="xs" tone="primary" />
              </MosaicPressable>
            </View>

            <MosaicCard padded={false} className="mt-3 px-[18px]">
              <MosaicList>
                {event.moments.map((moment) => (
                  <MosaicListRow
                    key={moment.id}
                    title={moment.title}
                    subtitle={`${formatMomentDate(moment.date)} · ${t('lifeEvents.detail.momentTag')}`}
                    emoji="🗓️"
                    onPress={() => {
                      // TODO: navigate to the linked Moment detail
                      console.log('linked moment:', moment.id);
                    }}
                  />
                ))}
              </MosaicList>
            </MosaicCard>
          </View>
        ) : null}
      </ScrollView>

      <MosaicImagePreview {...preview} />
    </MosaicScreen>
  );
}
