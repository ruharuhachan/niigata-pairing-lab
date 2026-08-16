export type ClaimStatus = 'verified' | 'partner_verified' | 'personal_observation' | 'draft';
export type PermissionStatus = 'not_required' | 'requested' | 'granted' | 'denied';
export type EvidenceLevel = 'idea' | 'bench_tested' | 'event_tested' | 'partner_adopted';

export interface ProvenanceLike {
  claimStatus: ClaimStatus;
  permissionStatus: PermissionStatus;
  createdAt: string;
  updatedAt: string;
  lastVerifiedAt?: string;
  sourceIds: string[];
  partnerVerifiedAt?: string;
  heroImage?: string;
  imagePermissionStatus?: PermissionStatus;
}

export function validateProvenance(entry: ProvenanceLike): string[] {
  const errors: string[] = [];
  if (
    ['verified', 'partner_verified'].includes(entry.claimStatus) &&
    entry.sourceIds.length === 0
  ) {
    errors.push('確認済み情報には出典が必要です。');
  }
  if (entry.claimStatus === 'partner_verified' && !entry.partnerVerifiedAt) {
    errors.push('当事者確認済み情報には確認日が必要です。');
  }
  if (entry.heroImage && entry.imagePermissionStatus !== 'granted') {
    errors.push('画像公開には許諾済み状態が必要です。');
  }
  if (entry.updatedAt < entry.createdAt) {
    errors.push('更新日は作成日以後である必要があります。');
  }
  return errors;
}
