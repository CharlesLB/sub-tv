import { chromium } from '@playwright/test'

const BASE_URL = process.env.SCREENSHOT_BASE_URL ?? 'http://localhost:3000'
const USERNAME = process.env.SCREENSHOT_USERNAME ?? ''
const PASSWORD = process.env.SCREENSHOT_PASSWORD ?? ''
const DEFAULT_WIDTH = 1440
const DEFAULT_HEIGHT = 900
const THEME_STORAGE_KEY = 'subtv-tema'

const [path = '/campeonatos', outputFile = '.data/screenshot.png', theme = 'claro', width = String(DEFAULT_WIDTH), height = String(DEFAULT_HEIGHT)] = process.argv.slice(2)

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: Number(width), height: Number(height) } })
const consoleProblems: string[] = []

page.on('console', (message) => {
  if (message.type() === 'error' || message.type() === 'warning') consoleProblems.push(`${message.type()}: ${message.text()}`)
})

page.on('pageerror', (error) => consoleProblems.push(`pageerror: ${error.message}`))
await page.addInitScript(([key, value]) => localStorage.setItem(key, value), [THEME_STORAGE_KEY, theme] as const)
await page.goto(`${BASE_URL}/entrar?para=${encodeURIComponent(path)}`)
await page.fill('input[name="username"]', USERNAME)
await page.fill('input[name="password"]', PASSWORD)
await page.click('button[type="submit"]')
await page.waitForURL((url) => !url.pathname.startsWith('/entrar'), { timeout: 60_000 })
await page.waitForLoadState('networkidle')
await page.waitForTimeout(800)
await page.screenshot({ path: outputFile })
const title = await page.evaluate(() => document.title)
console.info(`saved ${outputFile} (${title})`)
if (consoleProblems.length > 0) console.warn(consoleProblems.map((problem) => problem.slice(0, 600)).join('\n'))
await browser.close()
