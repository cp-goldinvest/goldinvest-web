import { type SchemaTypeDefinition } from 'sanity'
import { postType } from './post'
import { visualChartType } from './visualChart'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [postType, visualChartType],
}
