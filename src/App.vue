<script setup lang="ts">
import { ref } from 'vue'
import logoImg from './assets/wendys_icon.png'
import cheese_burgerImg from './assets/cheese_burger.png'
import chicken_burgerImg from './assets/chicken_burger.png'
import cokeImg from './assets/coke.png'
import oolong_teaImg from './assets/oolong_tea.png'
import cream_sodaImg from './assets/cream_soda.png'

// 型
type Item = { name: string; price: number; img: string }
type CartItem = { item: Item; qty: number }


// カート
const cart = ref<CartItem[]>([])
const total = ref(0)

const foodhyouji = ref(false)
const drinkhyouji = ref(false)

// 商品リスト
const foodItems: Item[] = [
  { name: "チーズバーガー", price: 500, img: cheese_burgerImg },
  { name: "チキンバーガー", price: 400, img: chicken_burgerImg }
]

const drinkItems: Item[] = [
  { name: "コーラ", price: 150, img: cokeImg },
  { name: "お茶", price: 200, img: oolong_teaImg },
  { name: "クリームソーダ", price: 250, img: cream_sodaImg }
]

// カートに入れる関数
function inCart(item: Item) {
  const existing = cart.value.find(c => c.item.name === item.name)
  if (existing) {
    existing.qty++
  } else {
    cart.value.push({ item, qty: 1 })
  }
  total.value += item.price
}

function add(c: CartItem) {
  c.qty++
  total.value += c.item.price
}

function remove(c: CartItem) {
  c.qty--
  total.value -= c.item.price
  if (c.qty <= 0) {
    cart.value = cart.value.filter(x => x !== c)
  }
}
// カートクリア
function clear() {
  cart.value = []
  total.value = 0
}

// ボタン操作
const foodkaihou = () => foodhyouji.value = !foodhyouji.value
const drinkkaihou = () => drinkhyouji.value = !drinkhyouji.value

// 注文送信
async function send() {
  if (cart.value.length === 0) {
    alert("カートが空です");
    return;
  }

  // ステップ1でコピーしたURLをここに貼り付ける
  const WEBHOOK_URL = "https://discord.com/api/webhooks/1498708202739597512/4JRjGmBhrWKJbIp-Lnw1ws5pmYxd2ZpSIRmnlZc58-dcuKGdAlLGyI7le_xCBKL6cEcm";

  // 送信するメッセージの組み立て
  const orderDetails = cart.value
    .map(c => `・${c.item.name} × ${c.qty}`)
    .join('\n');

  const payload = {
    username: "注文くん（自動通知）",
    content: "🔔 **新しい注文が入りました！**",
    embeds: [{
      title: "注文内容詳細",
      description: orderDetails,
      color: 0x00ff00, // 緑色のバー
      fields: [
        { name: "合計金額", value: `${total.value}円`, inline: true }
      ],
      timestamp: new Date().toISOString()
    }]
  };

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      alert("注文が送信されました.スマホのDiscordを確認してください。");
      cart.value = [];
      total.value = 0;
    } else {
      throw new Error("送信エラー");
    }
  } catch (error) {
    console.error("エラー:", error);
    alert("送信に失敗しました。URLが正しいか確認してください。");
  }
}
</script>

<template>
  <header>
    <img src="./assets/wendys_icon.png" alt="wendys_icon" class = "logo" />

    <button @click="clear" class = "button008">カートの中身を消す</button>
    <button @click="foodkaihou" class = "button003">バーガー</button>
     <div v-if="foodhyouji">
      <div 
        v-for="item in foodItems" 
        :key="item.name" 
        class="item"
      >
        <img :src="item.img" class="item-img" />
        <p>{{ item.name }} - {{ item.price }}円</p>
        <button @click="inCart(item)" class="button008">カートに入れる</button>
      </div>
    </div>
    <button @click="drinkkaihou" class = "button003">ドリンク</button>
    <!-- 飲み物 -->
    <div v-if="drinkhyouji">
      <div
        v-for="item in drinkItems"
        :key="item.name"
        class="item"
      >
        <img :src="item.img" class="item-img" />
        <p>{{ item.name }} - {{ item.price }}円</p>
        <button @click="inCart(item)" class="button008">カートに入れる</button>
      </div>
    </div>

    <h2 class="cart">カート</h2>

    <div v-for="c in cart" :key="c.item.name">
      <img :src="c.item.img" class="item-img" />
      {{ c.item.name }} ×{{ c.qty }}（{{ c.item.price }}円）
      <button @click="add(c)">＋</button>
      <button @click="remove(c)">ー</button>
    </div>

    <h3 class="sum">合計: {{ total }}円</h3>

    <button @click="send" class="order">注文</button>
  </header>
</template>

<style>
/* scopedをつけないことで、画面全体(body)に色が塗れるようになります */
html, body {
  margin: 0;
  padding: 0;
  background-color: red; /* headerと同じ赤にする */
}
</style>

<style scoped>
header{
  color: #000; 
  background: red;
  user-select: none;
}
.cart{
  color: white;
  font-family: fantasy;
}
.sum{
  color: white;
  font-family: fantasy;
}
.logo{
  display: block;       /* ブロック要素化 */
  margin: 0 auto;       /* 左右マージン自動 */
  width: 300px;
}
.item {
  font-size: 20px;
  font-weight: 900;
  text-align: center;
  color:white;
  margin: 10px 0;
}
.item-img {
  width: 40px;
}
.order {
  background: #eee;
  display: flex;
  position: relative;
  justify-content: space-around;
  max-width: 240px;
  align-items: center;
  padding: 10px 25px;
  color: #313131;
  transition: 0.3s ease-in-out;
  font-weight: 500;
  z-index:0;
}
.order:hover {
    background: #313131;
    color: #FFF;
}

.button008 {
    background: #eee;
    position: relative;
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 0 auto; /* 真ん中に設置　*/ 
    max-width: 240px;
    padding: 10px 25px;
    color: #313131;
    transition: 0.3s ease-in-out;
    font-weight: 500;
    z-index:0;
}
.button008:hover {
    background: #313131;
    color: #FFF;
}


.button003 {
    background: #eee;
    border-radius: 50px;
    position: relative;
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 0 auto;
    max-width: 260px;
    padding: 10px 25px;
    color: #313131;
    transition: 0.3s ease-in-out;
    font-weight: 500;
}
.button003:hover {
    background: #313131;
    color: #FFF;
}
.button003:after {
    content: '';
    width: 5px;
    height: 5px;
    border-top: 3px solid #313131;
    border-right: 3px solid #313131;
    transform: rotate(45deg) translateY(-50%);
    position: absolute;
    top: 50%;
    right: 20px;
    border-radius: 1px;
    transition: 0.3s ease-in-out;
}
.button003 a:hover:after {
    border-color: #FFF;
}
</style>
