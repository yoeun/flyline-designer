import { describe, expect, it } from 'vitest';
import { shareIdFromPath, shareUrl } from './shareApi.js';

describe('view links', () => {
  it('reads the share id from a view link path', () => {
    expect(shareIdFromPath('/r/pR9s8PaXwI2ooDBDaZYSLg')).toBe('pR9s8PaXwI2ooDBDaZYSLg');
    expect(shareIdFromPath('/r/pR9s8PaXwI2ooDBDaZYSLg/')).toBe('pR9s8PaXwI2ooDBDaZYSLg');
  });

  it('ignores other paths', () => {
    expect(shareIdFromPath('/')).toBeNull();
    expect(shareIdFromPath('/r/short')).toBeNull();
    expect(shareIdFromPath('/r/pR9s8PaXwI2ooDBDaZYSLg/edit')).toBeNull();
  });

  it('builds the link from the site origin', () => {
    expect(shareUrl('pR9s8PaXwI2ooDBDaZYSLg', 'https://flyline.example')).toBe('https://flyline.example/r/pR9s8PaXwI2ooDBDaZYSLg');
  });
});
