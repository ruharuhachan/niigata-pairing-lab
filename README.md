# 新潟ペアリングラボ / Niigata Pairing Lab

新潟清酒と食を起点に、地域資源の「飲む理由」「選ぶ理由」「売れる場面」を、一次情報と小さな現場実証から設計するプロジェクトです。

現在は **Phase 1（信頼形成・現場参加）のMVP** です。掲載数を競うメディアではなく、事実・当事者発言・運営者の観察・仮説を分離し、出典、確認日、許諾、訂正可能性を表示する活動基盤を目指します。

## Phase 1の範囲

- 新潟県内の酒蔵、日本酒、ペアリング、実証、現場記録
- 出典・確認状態・掲載許諾・鮮度の構造化管理
- 酒蔵・飲食店・売場からの訂正、掲載確認、共同実験への導線
- GitHub Pagesで動く静的サイト

以下は現時点で実装しません。

- 会員登録、ユーザー投稿、コメント、決済、EC、在庫、予約
- 酒類の受注・媒介・価格交渉
- CRM、商談メモ、連絡先、生アンケートの保存
- スクレイピング、AIによる事実・官能評価・成果の自動生成
- 全国向けマーケットプレイスや第4フェーズの先行実装

## 技術構成

- Astro 7 / TypeScript / Astro Content Collections
- Markdown frontmatterによる本文と構造データの一体管理
- pnpm / Vitest / Playwright / axe-core
- GitHub Actions / GitHub Pages / CodeQL / Dependabot
- クライアントJavaScriptを使わない静的HTML（初期状態）

D3はデータが5件以上になり、表よりも関係性を理解しやすくなる場合だけ導入します。

## ローカル起動

Node.jsとpnpmのバージョンは `.nvmrc` と `packageManager` に固定しています。

```bash
corepack enable
corepack prepare pnpm@11.22.0 --activate
pnpm install --frozen-lockfile
pnpm dev
```

標準のbase pathは `/niigata-pairing-lab` です。ローカルでは `http://localhost:4321/niigata-pairing-lab/` を開きます。ルート配下で確認する場合は `BASE_PATH=/ pnpm dev` を使います。

## 検査・ビルド

```bash
pnpm format:check
pnpm lint
pnpm check
pnpm test
pnpm build
pnpm test:e2e
```

`pnpm run ci` はE2E以外のPull Request向け検査をまとめて実行します。E2EはChromiumの準備後に個別実行します。

## コンテンツ追加の最短手順

1. 対象コレクションのfixtureをコピーし、実在しないことを示すfixture表現を削除する
2. `claimStatus: draft` のまま、公式・一次資料を `src/content/sources/` へ追加する
3. `sourceIds`、確認日、許諾状態、訂正に必要な情報を入力する
4. `pnpm content:check && pnpm check` を実行する
5. Pull Requestで事実、表現、権利、公開範囲を人が確認する
6. 確認後に `claimStatus` を変更し、公開する

### 状態の意味

| 項目               | 値                     | 意味                                   |
| ------------------ | ---------------------- | -------------------------------------- |
| `claimStatus`      | `verified`             | 一次資料・公的資料を運営が確認         |
|                    | `partner_verified`     | 掲載当事者が確認                       |
|                    | `personal_observation` | 運営者自身の官能・現場観察             |
|                    | `draft`                | 未検証。本番・サイトマップから除外     |
| `permissionStatus` | `not_required`         | 公開資料の事実など、追加許諾を要しない |
|                    | `requested`            | 許諾確認中                             |
|                    | `granted`              | 合意した範囲で許諾済み                 |
|                    | `denied`               | 公開不可                               |
| `evidenceLevel`    | `idea`                 | 仮説のみ                               |
|                    | `bench_tested`         | 少人数で試行                           |
|                    | `event_tested`         | 提供現場・イベントで検証               |
|                    | `partner_adopted`      | 協力先が継続採用                       |

## 写真・ロゴ・取材・個人情報

写真・ロゴは、権利者、利用範囲、許諾日を記録でき、`imagePermissionStatus: granted` の場合だけ公開します。インタビューは発言、要約、写真、肩書、公開期間を合意します。

公開リポジトリには、次のものを置きません。

- 氏名・連絡先・名刺・生アンケート・録音
- 未公開インタビュー、商談メモ、契約、見積、売上・顧客情報
- 秘密情報、APIキー、個人用の作業ファイル

`.gitignore` は事故防止の補助であり、漏えい防止の保証ではありません。実データは公開リポジトリの作業ディレクトリへ持ち込みません。

## 訂正

公開前はサイト上の窓口を「準備中」と表示します。運用開始後はIssue Formまたは外部フォームを有効化し、対象URL、誤り、根拠、希望修正を受け取ります。重要な訂正はページ末尾へ履歴を残します。

## GitHub Pages

`astro.config.mjs` は次の環境変数を使います。

- `SITE_URL`：既定 `https://ruharuhachan.github.io`
- `BASE_PATH`：既定 `/niigata-pairing-lab`

Actionsを使うには、リポジトリの **Settings → Pages → Source** を **GitHub Actions** に設定します。`deploy-pages.yml` は `main` へのpush後にビルド成果物を公開します。

## 既知の制約と次フェーズへの条件

- 公開コンテンツはまだ0件。架空fixtureはすべて `draft` で本番から除外される
- 問い合わせ手段、運営主体、名称、ライセンスは確定前
- GitHub Pagesでは任意のHTTPレスポンスヘッダーを設定できない
- D3可視化は、説明可能な実証データが5件以上になるまで実装しない
- Phase 2へ進む目安は、深い事例3〜5件、継続相談、再注文・継続採用等の行動変化

## 設計資料

- [サイト構築プロンプト兼アーキテクチャ設計書](docs/site-build-prompt.md)
- [コンテンツポリシー](docs/content-policy.md)
- [データ辞書](docs/data-dictionary.md)
- [編集フロー](docs/editorial-workflow.md)
- [脅威モデル](docs/threat-model.md)

## ライセンス

未決定です。ライセンスが追加されるまで、文章・データ・画像・コードの再利用許諾を意味しません。
