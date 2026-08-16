export const claimStatusLabels = {
  verified: '一次・公的資料で確認',
  partner_verified: '掲載当事者が確認',
  personal_observation: '運営者の観察',
  draft: '未検証・非公開',
} as const;

export const permissionStatusLabels = {
  not_required: '許諾不要',
  requested: '許諾確認中',
  granted: '許諾済み',
  denied: '掲載不可',
} as const;

export const evidenceLevelLabels = {
  idea: '仮説',
  bench_tested: '少人数で試行',
  event_tested: 'イベントで検証',
  partner_adopted: '協力先が採用',
} as const;
