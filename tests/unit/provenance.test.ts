import { describe, expect, it } from 'vitest';
import { validateProvenance, type ProvenanceLike } from '../../src/lib/provenance';

const base: ProvenanceLike = {
  claimStatus: 'verified',
  permissionStatus: 'not_required',
  createdAt: '2026-08-01',
  updatedAt: '2026-08-02',
  sourceIds: ['official-source'],
};

describe('validateProvenance', () => {
  it('accepts verified content with a source', () => {
    expect(validateProvenance(base)).toEqual([]);
  });

  it('rejects verified content without sources', () => {
    expect(validateProvenance({ ...base, sourceIds: [] })).toContain(
      '確認済み情報には出典が必要です。',
    );
  });

  it('requires a partner verification date', () => {
    expect(validateProvenance({ ...base, claimStatus: 'partner_verified' })).toContain(
      '当事者確認済み情報には確認日が必要です。',
    );
  });

  it('blocks images without granted permission', () => {
    expect(
      validateProvenance({ ...base, heroImage: '/test.jpg', imagePermissionStatus: 'requested' }),
    ).toContain('画像公開には許諾済み状態が必要です。');
  });
});
