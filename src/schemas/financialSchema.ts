import { Type } from '@sinclair/typebox';

export const SummaryRequestSchema = Type.Object({
  startDate: Type.String({ format: 'date' }),
  endDate: Type.String({ format: 'date' }),
});
export const MonthlyExpenseTrends=Type.Object({
  year:Type.Number({minimum:2020,maximum:2024}),
})
