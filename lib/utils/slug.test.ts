import { describe, it, expect } from 'vitest'
import { generateSlug } from './slug'

describe('generateSlug', () => {

  it('converts a basic string to lowercase with hyphens', () => {
    expect(generateSlug('Scottish Highlands')).toBe('scottish-highlands')
  })

  it('removes accented characters', () => {
    expect(generateSlug('Voyage en Île-de-France')).toBe('voyage-en-ile-de-france')
  })

  it('removes special characters', () => {
    expect(generateSlug('Mon voyage ! (2024)')).toBe('mon-voyage-2024')
  })

  it('collapses multiple spaces into a single hyphen', () => {
    expect(generateSlug('Tour   de   France')).toBe('tour-de-france')
  })

  it('trims leading and trailing spaces', () => {
    expect(generateSlug('  Scotland  ')).toBe('scotland')
  })

  it('does not produce double hyphens', () => {
    expect(generateSlug('Paris - Lyon')).toBe('paris-lyon')
  })

})