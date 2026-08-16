# データ辞書

## 共通メタデータ

| フィールド         | 必須 | 説明                      |
| ------------------ | ---: | ------------------------- |
| `title`            |    ✓ | 編集・表示用タイトル      |
| `claimStatus`      |    ✓ | 確認状態                  |
| `permissionStatus` |    ✓ | 掲載許諾状態              |
| `createdAt`        |    ✓ | ISO 8601の日付            |
| `updatedAt`        |    ✓ | 最終更新日                |
| `lastVerifiedAt`   |      | 事実の最終確認日          |
| `nextReviewAt`     |      | 次に確認すべき日          |
| `sourceIds`        |    ✓ | `sources`コレクションのID |

## コレクション

- `sources`：資料名、発行者、URL、発行日、確認日、資料種別、支える主張
- `breweries`：名称、読み、自治体、公式URL、概要、当事者確認日
- `sakes`：酒蔵ID、銘柄、商品、区分、度数、販売状態
- `tasting-notes`：酒ID、観察者、日付、温度、器、開栓時間、香味、限界
- `pairings`：酒ID、料理・食材、仮説、相互作用、提供条件、証拠レベル
- `experiments`：仮説、対象、場所、比較条件、質問、結果、限界、次の検証
- `stories`：許諾済みインタビュー、現場記録、イベントレポート
- `events`：日程、会場、公式URL、開催状態、概要

完全な型と相互ルールは `src/content.config.ts` を正とします。
