# Card Game

## 🌱 概要

チームで開発したトランプゲームを遊ぶことができるウェブアプリケーション

## 🏠 URL

https://card-game-ten-beryl.vercel.app

## 📝 説明

実装したゲームは Blackjack と Poker （テキサスホールデム）です。

### 🎮 Blackjack

ルールは標準的なブラックジャックのルールに従います。

ゲームでは、各プレイヤーはハウスと 1 対 1 で勝負します。

プレイヤーには以下の選択肢があります。

- Surrender：最初に配られた 2 枚のカードで負けを認めることができます。賭けた金額の半分が返ってきます。最初の 2 枚のカードが配られた後にしか行えません。

- Stand：カードの追加をやめて、現在の手札で勝負します。

- Hit：手札に 1 枚のカードを追加します。合計点数が 21 を超えてしまうとバスト（bust）となり、プレイヤーの負けとなります。
- Double：ベット額を 2 倍にして、もう 1 枚だけカードを引くことができます。最初の 2 枚のカードが配られた後にしか行えません。

最終的に、プレイヤーの手札とハウスの手札を比較し、21 を超えずにより 21 に近いスコアを持つ方を勝ちとします。

通常の勝利の場合、返金額は掛け金の 2 倍です。
ブラックジャックの場合、返金額は掛け金の 2.5 倍です。

### 🎮 Poker

リミットホールデム形式を採用しています。

各ラウンドのレイズ額は以下のように決められています。

- プリフロップ、フロップ：$ 2
- ターン、リパー：$ 4

各ラウンドにおいてプレイヤーには以下の選択肢があります。

- FOLD：そのゲームを降ります。

- CALL：場の最高ベット額に合わせてベットを追加します。
- RAISE：特定のベット額を追加し、場の最高ベット額をつり上げます。
- CHECK：追加でベットを行うことなく、ラウンドに参加します。

最終的に各プレイヤーの 2 枚の手札と 5 枚のコミュニティーカードで作られる一番強い役を判定・比較し、最も強い役を持つプレイヤーにポットの金額が分配されます。

## 🚀 インストール

```
git clone https://github.com/Recursion-group-A/card-game.git
cd card-game
npm i
npm run dev
```

## 💾 使用技術

<table>
<tr>
  <th>カテゴリ</th>
  <th>技術スタック</th>
</tr>
<tr>
  <td rowspan=3>フロントエンド</td>
  <td>Next.js</td>
</tr>
<tr>
  <td>Phaser</td>
</tr>
<tr>
  <td>TypeScript</td>
</tr>
<td rowspan=7>その他</td>
  <td>ソースコード管理：Git, GitHub</td>
<tr>
  <td>パッケージ管理：npm</td>
</tr>
<tr>
  <td>リンター：eslint</td>
</tr>
<tr>
  <td>フォーマッター：Prettier</td>
</tr>
<tr>
  <td>テストフレームワーク：Jest</td>
</tr>
<tr>
  <td>デプロイ：Vercel</td>
</tr>
<tr>
  <td>husky, lint-staged</td>
</tr>
</table>

## 📜 作成の経緯

- 要件定義、技術選定、設計、実装、テスト、デプロイの一連のソフトウェア開発を経験する
- Git・GitHub を使ったチーム開発の経験を得る
- MVC モデルの理解と実装スキルを高める
- OOP・デザインパターンの知識を用いた拡張可能なソフトウェア設計を学習する
- 経験のない技術（Phaser）のインプット・アウトプットを短期間で行う経験を得る

## 💻 学んだこと

- UML 図を使ったクラス図の書き方
- OOP（抽象クラス、継承、インターフェース、カプセル化、ステートレスクラス）の実装
- デザインパターン（ファクトリメソッド、ストラテジーパターン）の考え方と実装
- Phaser を使った View・Controller の実装
- Jest を使ったテストの作成・実行

開発期間中の [Devlog](https://docs.google.com/document/d/12HDOibWNE8gMtWd8wni5Gtn5iFxRt_q-fkJivLVB82I/edit?usp=sharing)（Teradad41）

## ⭐️ こだわった点

- ゲームによって異なるランクの数え方を切り替えるためにストラテジパターンを使用したことで、今後他のゲームの追加が容易にできるようにした
- Joker カードの生成をファクトリメソッドパターンを使い処理を分離させた
- 抽象クラスではジェネリクスで型を定義し、柔軟なインスタンス化ができるようにした
- 抽象クラスを活用することで、具象クラスでのコーディング量を減少させ、今後他のゲームを追加する際にも使えるようにした
- 役判定やボットのアクション選択のロジックを別クラスに分離させた
- Phaser を用いた View と Controller の責任を分離させた（以前ブラックジャックを実装したときより良いコードを書けたと思う）
- husky と lint-staged を使いローカルでのコミット前に Prettier と eslint を実行させることで、チーム間で特定のフォーマットとコード規約に基づいたコーディングができるようにした

## 📋 ドキュメント

- [Wiki](https://github.com/Recursion-group-A/card-game/wiki)

## 📮 今後実装したいこと

- [ ] Speed を追加する
- [ ] データベースと連携してユーザー情報を登録する
- [ ] スタート画面を React で置き換える

## 📑 参考

### 公式ドキュメント

- [Next.js](https://nextjs.org)
- [Phaser](https://phaser.io)
- [TypeScript](https://www.typescriptlang.org)
- [Jest](https://jestjs.io/ja/)

## 👷 メンバー

<a href="https://github.com/Recursion-group-A/card-game/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=recursion-group-a/card-game" 
alt="contributors images" />
</a>
