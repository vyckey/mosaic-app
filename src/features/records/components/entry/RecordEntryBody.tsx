import type { MosaicRecord } from '../../types';
import { MoodEntryBody } from './MoodEntryBody';
import { MomentEntryBody } from './MomentEntryBody';

export interface RecordEntryBodyProps {
  record: MosaicRecord;
}

/**
 * Type-dispatch slot rendered inside RecordEntry: picks the body component
 * matching `record.type`.
 *
 * Adding a new record type = one `case` here plus its body component
 * (e.g. diary → DiaryEntryBody). The switch covers every variant today; the
 * fallback keeps rendering the moment body should a new variant slip through
 * so a record can never come out blank.
 */
export function RecordEntryBody({ record }: RecordEntryBodyProps) {
  switch (record.type) {
    case 'mood':
      return <MoodEntryBody record={record} />;
    default:
      return <MomentEntryBody record={record} />;
  }
}
