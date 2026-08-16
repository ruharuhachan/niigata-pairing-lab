# 新潟ペアリングラボ — GitHubサイト構築プロンプト兼アーキテクチャ設計書

> 用途：この文書を、そのまま Codex / ChatGPT のコーディングエージェントへ貼り付けて実装を依頼する。  
> 対象：第1フェーズの検証用サイト。第2〜4フェーズの「プラットフォーム」を先回りして作らない。  
> 仮称：Niigata Pairing Lab / 新潟ペアリングラボ。名称・ロゴは権利確認後に確定する。

---

## ここから実装依頼プロンプト

あなたは、編集設計・データモデリング・アクセシビリティ・セキュリティに強いシニアWebエンジニアです。次の要件を満たす、公開GitHubリポジトリ向けの静的サイトを設計・実装してください。

最初に既存リポジトリを読み、既存コード・未コミット変更・README・AGENTS.md・ライセンス・デプロイ設定を確認してください。既存物がある場合は、上書きや削除をせず、変更案と影響範囲を示してください。破壊的変更、既存データの削除、ホスティング先の変更、費用の発生、秘密情報の利用が必要な場合は作業を止めて質問してください。

### 1. 事業コンテキスト

このサイトは、新潟清酒を起点に、一次情報と小さな実証を蓄積し、酒蔵・飲食店・売場・生活者の間で「飲む理由」と「売れる場面」を設計する活動基盤です。

事業は次の4段階を想定します。

1. 新潟県内での情報発信、コミュニティ参加、軽いコンサルティング
2. 新潟清酒の販路拡大、飲み方・ペアリング・日本酒カクテルの提案
3. 新潟清酒と他都道府県の名産を掛け合わせた共同企画
4. 新潟の日本酒以外の産品も含む、地域横断ペアリング情報のハブ

ただし、今回実装するのは第1フェーズのMVPだけです。目的は、情報量を競うことではなく、出典・検証状態・協力者の許諾・現場実験の学びを透明に示し、相談や共同実験につなげることです。

### 2. MVPの成功条件

サイト公開自体を成功としません。次の行動を支援することを成功条件にします。

- 読者が、掲載情報の出典・確認日・主観と事実の区別を理解できる
- 酒蔵・飲食店・売場が、訂正・掲載相談・共同実験を申し込める
- 運営者が、1件のコンテンツを無理なく追加・レビュー・更新できる
- ペアリング案が「思いつき」ではなく、仮説・実施条件・反応・次の検証として残る
- 更新停止や誤情報を検出できる

### 3. 今回の非目標

以下は実装しないでください。

- 会員登録、ログイン、ユーザー投稿、コメント、SNS機能
- 決済、EC、在庫、予約、定期便、酒類の受注・媒介・価格交渉
- 顧客管理や営業案件管理。実在連絡先・商談メモは公開リポジトリに置かない
- 酒蔵公式サイトやメディアのスクレイピング
- AIによる事実・テイスティングノート・ペアリング成果の自動生成
- 第4フェーズを想定したマーケットプレイスやマイクロサービス化
- 許諾のない写真・ロゴ・地図データ・記事本文の転載
- 実在するかのように見えるダミーデータの本番公開

問い合わせは、運営者が後で指定する外部フォームまたはメールリンクへ接続できる構造にし、未指定時は無効な仮リンクを出さず「準備中」と表示してください。

### 4. 技術方針

- 最新安定版の Astro と TypeScript を採用する
- パッケージマネージャーは pnpm、Node.jsは現在のAstro推奨LTSを `.nvmrc` と `package.json#engines` に固定する
- Astro Content Collections と型付きスキーマを中核にする
- 記事本文は Markdown / MDX、構造データは YAML または JSON。用途を混在させずREADMEに選定理由を書く
- 基本はゼロJavaScriptの静的HTML。必要な島だけクライアントJSを読み込む
- D3は独自可視化に限って使う。単純な棒・線・円グラフには使わない
- GitHub PagesへGitHub Actionsでデプロイする。プロジェクトサイト配下でもURLが壊れないよう、Astroの `site` と `base` を環境変数または設定値で扱う
- 1リポジトリ構成とする。モノレポにしない
- CSSは小さなデザイントークン層とコンポーネントCSSを基本とする。大規模UIフレームワークは導入しない
- 外部分析ツールやCookieは初期状態で入れない。導入する場合は目的・保持期間・同意要否を別途判断する

### 5. 推奨リポジトリ構成

```text
.
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── correction.yml
│   │   ├── new-entry.yml
│   │   └── collaboration.yml
│   ├── workflows/
│   │   ├── ci.yml
│   │   ├── deploy-pages.yml
│   │   ├── link-check.yml
│   │   ├── content-freshness.yml
│   │   └── codeql.yml
│   ├── dependabot.yml
│   └── pull_request_template.md
├── docs/
│   ├── adr/
│   │   ├── 0001-static-astro.md
│   │   ├── 0002-provenance-first-content.md
│   │   └── 0003-no-private-data-in-public-repo.md
│   ├── content-policy.md
│   ├── data-dictionary.md
│   ├── editorial-workflow.md
│   └── threat-model.md
├── public/
│   ├── favicon.svg
│   ├── images/
│   │   └── README.md
│   └── robots.txt
├── scripts/
│   ├── check-content.ts
│   ├── check-freshness.ts
│   ├── check-links.ts
│   └── build-source-index.ts
├── src/
│   ├── components/
│   │   ├── charts/
│   │   │   ├── FlavorMap.astro
│   │   │   └── PairingNetwork.astro
│   │   ├── ClaimBadge.astro
│   │   ├── CorrectionLink.astro
│   │   ├── SourceList.astro
│   │   └── VerificationMeta.astro
│   ├── content/
│   │   ├── breweries/
│   │   ├── sakes/
│   │   ├── tasting-notes/
│   │   ├── pairings/
│   │   ├── experiments/
│   │   ├── stories/
│   │   ├── events/
│   │   └── sources/
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── ArticleLayout.astro
│   ├── lib/
│   │   ├── content/
│   │   ├── provenance/
│   │   └── visualization/
│   ├── pages/
│   │   ├── index.astro
│   │   ├── breweries/
│   │   ├── sakes/
│   │   ├── pairings/
│   │   ├── experiments/
│   │   ├── stories/
│   │   ├── methodology.astro
│   │   ├── sources.astro
│   │   ├── corrections.astro
│   │   ├── partners.astro
│   │   └── responsible-drinking.astro
│   ├── styles/
│   │   ├── tokens.css
│   │   └── global.css
│   └── content.config.ts
├── tests/
│   ├── unit/
│   └── e2e/
├── .editorconfig
├── .gitignore
├── .nvmrc
├── LICENSE
├── README.md
├── astro.config.mjs
├── package.json
├── playwright.config.ts
├── pnpm-lock.yaml
└── tsconfig.json
```

`.private/`、`contacts/`、`crm/`、録音、未公開インタビュー、名刺、契約、見積、売上情報、個人情報を `.gitignore` に明記してください。ただし、`.gitignore` は漏えい防止の保証ではないため、実データはそもそも公開リポジトリの作業ディレクトリへ置かない運用をREADMEと脅威モデルに明記してください。

### 6. データモデル

名称の似た概念を一つの巨大なコンテンツ型に詰め込まないでください。少なくとも次を分離します。

#### 共通メタデータ

全エントリに以下を持たせます。

```ts
type ClaimStatus =
  | 'verified'             // 一次資料・公的資料で運営が確認
  | 'partner_verified'     // 掲載当事者が内容を確認
  | 'personal_observation' // 運営者の官能・現場観察
  | 'draft';               // 未検証。本番一覧から除外

type PermissionStatus =
  | 'not_required'
  | 'requested'
  | 'granted'
  | 'denied';

interface Provenance {
  id: string;
  title: string;
  claimStatus: ClaimStatus;
  permissionStatus: PermissionStatus;
  createdAt: string;
  updatedAt: string;
  lastVerifiedAt?: string;
  nextReviewAt?: string;
  sourceIds: string[];
  correctionUrl?: string;
}
```

日付はISO 8601、IDは変更しにくい英小文字slugにします。公開ページでは、確認状態・最終確認日・出典を人間が読める形で表示します。

#### Source

- `id`, `title`, `url`, `publisher`, `publishedAt`, `accessedAt`
- `sourceType`: official / public_record / partner_statement / interview / observation / secondary
- `archivedUrl` は合法かつ必要な場合のみ
- どの主張を支えるか、フィールド単位の参照を表現できるようにする

#### Brewery

- 基本名称、読み、自治体、公式URL
- 沿革や特徴は自由記述だけにせず、各主張へ出典を紐づける
- 住所・電話等は掲載目的がある場合のみ。公式情報と確認日を必須にする
- `partnerVerifiedAt` は酒蔵が確認した場合だけ設定する

#### Sake

- Breweryへの参照、銘柄名、商品名、酒類区分、公式商品URL
- アルコール度数等は、ラベルまたは公式商品情報の出典がある場合のみ
- 日本酒度だけから甘辛や味覚を断定しない
- 季節商品・終売・ヴィンテージの状態を持てるようにする

#### TastingNote

- Sakeとは分離し、観察者、日付、温度、器、開栓後時間、ロットが分かる範囲で記録
- 香味記述は `personal_observation` として表示
- 個人差・提供条件で変わることを明記

#### Pairing

- Sakeと料理・食材の参照
- 仮説、狙う相互作用、温度、器、分量、提供手順、避ける条件
- evidenceLevel: idea / bench_tested / event_tested / partner_adopted
- 実験ID、試行回数、観察結果へリンク

#### Experiment

- 仮説、対象者、場所種別、実施日、比較条件、質問、結果、限界、次の実験
- 氏名・連絡先・生のアンケートは保存しない。公開するのは匿名化・集計済み情報のみ
- 売上データは協力先の許諾と集計粒度を確認してから掲載

### 7. ページと情報設計

初期公開に必要なページは以下です。

- トップ：目的、最新の検証、相談導線、「何をしないか」
- 酒蔵一覧・詳細：網羅を装わず、掲載基準と件数を明示
- 日本酒一覧・詳細：商品事実と運営者の観察を視覚的に分離
- ペアリング一覧・詳細：実証レベル、提供条件、結果、限界を表示
- 実験一覧・詳細：成功例だけでなく不成立や学びも表示
- ストーリー：許諾済みインタビュー・現場レポート
- 方法論：調査、官能記録、実験、訂正の方法
- 出典一覧：Sourceから自動生成
- 訂正窓口：修正方針、対応目安、GitHub Issueまたは外部フォーム
- パートナー向け：掲載確認・共同実験・有償相談の違い
- 責任ある飲酒：20歳未満の飲酒禁止、妊娠・運転・健康上の注意を簡潔に表示

「新潟県内すべての酒蔵」「公式」「認定」など、根拠や許諾がない権威表現を使わないでください。

### 8. 可視化

MVPで実装可能なのは次の2種類です。ただし、データ不足ならコンポーネントの型とテストだけを用意し、本番ページには出しません。

1. フレーバーマップ
   - 甘味、酸、旨味、香りの強さ、ボディ等、定義を公開できる軸だけを用いる
   - 運営者の観察か、パートナー確認済みかを明示する
   - 日本酒度から主観軸を自動算出しない
2. ペアリング・ネットワーク
   - 酒、料理・食材、実験をノードとして扱う
   - 線の太さや色は、試行回数・証拠レベルなど説明可能な値だけに対応させる
   - 位置そのものに意味がない力学レイアウトの場合は、その旨を明記する

要件：

- SVGまたはCanvasだけに情報を閉じ込めず、同等情報のHTML表を併設する
- キーボード操作、フォーカス表示、スクリーンリーダー向け名称を実装する
- 色だけで状態を区別せず、凡例・形・文言を併用する
- `prefers-reduced-motion` を尊重する
- 320px幅でも横はみ出しを起こさない
- データが5件未満なら可視化より一覧を優先する
- 地理可視化は、利用条件を確認した公式GeoJSONを取得できた後の別判断とする

### 9. コンテンツと許諾のルール

- 事実、当事者発言、運営者の観察、仮説を明確に分ける
- すべての重要な事実にフィールド単位の出典を付ける
- 引用は必要最小限とし、出典本文を複製しない
- 写真・ロゴは権利者、利用範囲、許諾日を記録できるものだけ公開する
- 生成AIの文章は下書きとしてのみ使い、人が出典照合・表現確認をしてから公開する
- fixtureは架空であることが一目で分かる名称とし、`draft` のまま本番ビルドから除外する
- 訂正履歴を隠さず、重要な修正はページ末尾へ残す
- イベント情報は終了日と最終確認日を持ち、期限後は自動的に過去イベントへ移す

### 10. 編集・貢献フロー

1. Issueで追加・訂正・共同企画を受ける
2. 出典、許諾、重複、公開範囲を確認する
3. 小さなPull Requestでデータと表示を追加する
4. 自動検証後、人が事実・表現・権利をレビューする
5. 公開後に確認日と次回確認日を設定する

Issue Formは次を用意します。

- `new-entry.yml`：掲載対象、公式URL、提案者との関係、出典、許諾状態
- `correction.yml`：対象URL、誤り、根拠、希望する修正、連絡可否
- `collaboration.yml`：共同実験の目的、場所、対象者、酒類販売の有無、公開可能範囲

外部からのPRを信用境界として扱い、Actionsで任意コードや秘密情報へアクセスさせないでください。

### 11. CI・品質・セキュリティ

Pull Requestで次を実行します。

- `pnpm install --frozen-lockfile`
- format check、lint、TypeScript check、Astro check、production build
- Vitestによるスキーマ・変換・日付ロジックの単体テスト
- Playwrightによる主要ページ、404、モバイル幅、キーボード導線のスモークテスト
- 重複ID、壊れた参照、不正URL、未来の確認日、出典なしのverified、許諾なし画像をビルド失敗にする
- 内部リンクと外部リンクを定期検査する。外部障害でPRを不安定にしないよう、PR時と定期実行の扱いを分ける
- `nextReviewAt` 超過を定期ジョブで一覧化し、IssueまたはActions Summaryへ出す
- CodeQLとDependabotを設定する
- Actions権限をジョブ単位で最小化し、依存ActionはメジャータグではなくコミットSHAへ固定する
- 秘密情報をリポジトリ・ビルド成果物・ログに入れない
- ホスティングが許せばCSP等のセキュリティヘッダーを設定する。GitHub Pagesで不可能な制御はREADMEに制約として記載する

`pull_request_target` は原則使わないでください。必要性が出た場合は脅威モデルと安全な理由を提示し、実装前に確認を求めてください。

### 12. SEO・構造化データ・表示品質

- title、description、canonical、OGP、sitemap、RSSを実装する
- 構造化データはページ内容と一致するSchema.org型だけを使う。未確認の評価、価格、在庫を出さない
- 日本語を主言語にし、言語属性・日付・パンくずを正しく設定する
- Core Web Vitalsを意識し、画像サイズ・遅延読込・フォントを最適化する
- 自動アクセシビリティ検査に加え、キーボードと拡大表示を手動確認する手順をREADMEへ書く
- デザインは「清潔・現代的・地域の一次情報」を感じるものにし、和柄や筆文字の濫用を避ける

### 13. READMEに必ず含める内容

- サイトの目的、対象、非目標
- ローカル起動、検査、ビルド、プレビュー、デプロイ手順
- 新規コンテンツ追加の最短手順
- claimStatus / permissionStatus / evidenceLevel の意味
- 写真・ロゴ・インタビュー・個人情報の扱い
- 訂正依頼の流れ
- 公開リポジトリに置いてはいけないもの
- GitHub Pagesのbase path設定
- 現時点の既知の制約と、次フェーズへ進む条件

### 14. 実装順序

次の順で、小さく検証可能なコミット単位に分けてください。

1. 既存状態の監査と、短い実装計画の提示
2. Astroの最小構成、品質ツール、CI
3. Content Collectionsのスキーマとfixture
4. レイアウト、事実・観察・出典の表示コンポーネント
5. 一覧・詳細・方法論・訂正ページ
6. データ検査・鮮度検査・出典索引
7. 必要なデータ量が揃った場合のみ可視化
8. Playwright、アクセシビリティ、レスポンシブ確認
9. GitHub Pagesデプロイ設定とREADME仕上げ

各段階で、変更ファイル、判断、テスト結果、残課題を簡潔に報告してください。

### 15. 受け入れ基準

以下をすべて満たしたらMVP完成です。

- クリーン環境で依存導入、検査、ビルドが成功する
- GitHub Pagesのリポジトリ配下URLでCSS・画像・リンクが壊れない
- draftは本番ビルドとサイトマップから除外される
- verifiedなのに出典がないエントリはCIで拒否される
- partner_verifiedなのに確認日がないエントリはCIで拒否される
- permissionStatusがgrantedでない画像は本番へ出ない
- すべての詳細ページで状態、最終確認日、出典、訂正導線が見える
- 主要操作がキーボードで完結し、可視化にHTML代替がある
- 320px、768px、1440pxで重大な崩れがない
- ダミーの酒蔵・酒・実績・推薦コメントを本番公開していない
- READMEとADRだけで、別の協力者が1件を安全に追加できる

### 16. 敵対的反証レビューを実装に反映する

設計後、実装前に次の反論へ答え、必要なら設計を縮小してください。

| 攻撃仮説 | 失敗の形 | 必須の防御 |
|---|---|---|
| 「既存メディアの薄いコピー」 | 検索流入も協力も得られない | 一次情報、出典、現場実験、訂正可能性を差別化軸にする |
| 「D3を使いたいだけ」 | 読みにくく保守不能 | 少数データは表。可視化の意思決定価値を説明できる時だけ採用 |
| 「スキーマが重く投稿できない」 | 運営者自身が更新を止める | 最小必須項目、テンプレート、明確なエラーメッセージ、1件追加テスト |
| 「静的サイトで全国ハブを作れる」 | 第4フェーズの要件を先取りして複雑化 | Phase 1以外を実装しない。移行条件をADRとして残すだけ |
| 「情報がすぐ古くなる」 | 閉店・終売・日程変更で信用失墜 | 確認日、次回確認日、期限切れ検知、訂正窓口 |
| 「公開GitHubから商談が漏れる」 | 個人情報・条件・未発表案件の漏えい | 公開情報と業務記録を完全分離。実データを作業ツリーに置かない |
| 「AIがもっともらしい酒情報を捏造」 | 酒蔵との信頼を失う | 出典必須、draft既定、人の確認、架空fixtureの本番除外 |
| 「両面市場のコールドスタート」 | 掲載も読者も揃わない | サイト機能を増やさず、3〜5件の共同実験を深く記録する |

最終報告では「作ったもの」だけでなく、「意図的に作らなかったもの」「残存リスク」「次の実地検証」を明記してください。

## 実装依頼プロンプトここまで

---

## 構成判断の要約

この案は、情報サイトを最終製品と見なしていません。公開サイトは、信頼できる証拠台帳、協力者との共通言語、相談前のポートフォリオとして設計しています。最初からECや全国プラットフォームを作ると、酒類販売・媒介、在庫、契約、個人情報、二面市場の獲得が同時に発生するため、実証前の技術投資を避けています。

D3も中心技術ではありません。少数データなら表の方が正確です。実験数が増え、「どの酒と食材が、どの条件と証拠レベルでつながっているか」を一覧では読み解きにくくなった時だけ、ネットワーク可視化が意味を持ちます。

## 公式技術資料

- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [D3: What is D3?](https://d3js.org/what-is-d3)
- [GitHub PagesのGitHub Actionsデプロイ](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-jekyll-build-errors-for-github-pages-sites)
- [GitHub CodeQL code scanning](https://docs.github.com/en/code-security/concepts/code-scanning/codeql/code-scanning)
- [Dependabot設定ファイル](https://docs.github.com/en/code-security/concepts/supply-chain-security/about-the-dependabot-yml-file)

## この設計書自体の残存リスク

- 実装時点のAstro・GitHub Actionsの仕様変更は、最新の公式文書で再確認が必要
- GitHub Pagesは応答ヘッダー、フォーム、サーバー処理に制約がある
- 公開リポジトリ方式は透明性に強い一方、運営者が公開・非公開の境界を守れることが前提
- スキーマを精緻にしすぎると編集コストが上がるため、最初の3件を入力した時点で必須項目を再評価する
- サイトの品質は酒蔵・商品情報の「網羅数」ではなく、当事者確認と実験の深さに依存する

