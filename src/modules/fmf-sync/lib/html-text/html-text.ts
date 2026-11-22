import { type HTMLElement, parse } from 'node-html-parser'

const WHITESPACE_RUN = /\s+/g

export const parseHtml = (html: string): HTMLElement => parse(html, { comment: false })

export const collapseWhitespace = (text: string): string => text.replace(WHITESPACE_RUN, ' ').trim()

export const textOf = (element: HTMLElement | null | undefined): string => (element ? collapseWhitespace(element.text) : '')

export const decodeHtmlText = (fragment: string): string => textOf(parseHtml(`<span>${fragment}</span>`))

export const parseInteger = (text: string): number | null => {
  const trimmed = text.trim()
  if (!/^-?\d+$/.test(trimmed)) return null

  return Number(trimmed)
}
