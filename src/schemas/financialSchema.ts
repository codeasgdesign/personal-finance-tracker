import { Type } from '@sinclair/typebox';

export const SummaryRequestSchema = Type.Object({
  startDate: Type.String({ format: 'date' }),
  endDate: Type.String({ format: 'date' }),
});
