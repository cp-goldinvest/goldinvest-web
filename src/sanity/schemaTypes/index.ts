import { type SchemaTypeDefinition } from 'sanity'
import { postType } from './post'
import { visualChartType } from './visualChart'
import { tableBlockType } from './tableBlock'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [postType, visualChartType, tableBlockType],
}
