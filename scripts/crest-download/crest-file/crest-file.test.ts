import { describe, expect, it } from 'vitest'
import { crestDiskPathOf, crestFileNameOf, crestPublicPathOf, isPngImage } from './crest-file'

describe('crestFileNameOf', () => {
  it('keeps numeric FMF crest ids as the file name', () => {
    expect(crestFileNameOf('16052')).toBe('16052.png')
  })

  it('turns named crest ids into lowercase kebab-case', () => {
    expect(crestFileNameOf('America_Teofilo_Otoni')).toBe('america-teofilo-otoni.png')
  })

  it('strips path separators so the file stays in the crest folder and rejects an empty id', () => {
    expect(crestFileNameOf('../../etc/passwd')).toBe('etc-passwd.png')
    expect(() => crestFileNameOf('___')).toThrow()
  })
})

describe('crest paths', () => {
  it('serves the file from /crests and stores it under public/crests', () => {
    expect(crestPublicPathOf('16052.png')).toBe('/crests/16052.png')
    expect(crestDiskPathOf('16052.png')).toBe('public/crests/16052.png')
  })
})

describe('isPngImage', () => {
  it('accepts a body that starts with the PNG signature', () => {
    expect(isPngImage(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]))).toBe(true)
  })

  it('rejects an HTML error page served with status 200', () => {
    expect(isPngImage(new TextEncoder().encode('<!DOCTYPE html>'))).toBe(false)
  })
})
