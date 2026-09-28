import { extractTextItems } from 'unpdf'
import type { PositionedText } from '../sumula-types/sumula-types'

const PAGE_VERTICAL_OFFSET = 1_000

export const extractPositionedText = async (pdfBytes: Uint8Array): Promise<PositionedText[]> => {
  const { items } = await extractTextItems(new Uint8Array(pdfBytes))

  return items.flatMap((pageItems, pageIndex) => pageItems.map((item) => ({ x: item.x, y: item.y - pageIndex * PAGE_VERTICAL_OFFSET, text: item.str.trim() })).filter((item) => item.text.length > 0))
}
