<script setup lang="ts">
import { ref } from 'vue'
import logoImg from './assets/wendys_icon.png'
import chicken_burgerImg from './assets/chicken_burger.png'
import cokeImg from './assets/coke.png'
import oolong_teaImg from './assets/oolong_tea.png'
import cream_sodaImg from './assets/cream_soda.png'
import allhamImg from './assets/allham.png'
import alldriImg from './assets/alldri.png'

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
  { name: "チキンバーガー", price: 400, img: chicken_burgerImg },
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
const userName = ref("")
const isShowNameInput = ref(false)
// 注文送信
// 1. 最初に「注文」ボタンを押したときの処理
function startOrder() {
  if (cart.value.length === 0) {
    alert("カートが空です");
    return;
  }
  // 名前入力欄を表示する
  isShowNameInput.value = true;
}
const isSending = ref(false)

// 2. 名前を入れて「送信」を押したときの処理（中身は前回のsendとほぼ同じ）
async function confirmAndSend() {
  if (!userName.value.trim()) {
    alert("お名前を入力してください");
    return;
  }
  // --- 追加：すでに送信中なら何もしない ---
  if (isSending.value) return;

  // 送信中モード開始
  isSending.value = true;
  const WEBHOOK_URL = "https://discord.com/api/webhooks/1498708202739597512/4JRjGmBhrWKJbIp-Lnw1ws5pmYxd2ZpSIRmnlZc58-dcuKGdAlLGyI7le_xCBKL6cEcm";
  const orderDetails = cart.value.map(c => `・${c.item.name} × ${c.qty}`).join('\n');

  const payload = {
    username: "注文くん",
    content: `🔔 **${userName.value} 様からの注文！**`,
    embeds: [{
      title: "注文内容",
      description: orderDetails,
      color: 0x00ff00,
      fields: [{ name: "合計金額", value: `${total.value}円`, inline: true }],
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
      alert("注文を送信しました！");
      // 全部リセット
      userName.value = "";
      isShowNameInput.value = false;
      clear();
    }
    
  } catch (error) {
    alert("エラーが発生しました");
  } finally {
    // --- 重要：成功しても失敗しても、最後に送信中モードを解除する ---
    isSending.value = false;
  }
}
</script>

<template>
  <header>
    <dev class = "header-title">Wendy's first kitchen 注文サイト</dev>
    
    
    <img src="./assets/wendys_icon.png" alt="wendys_icon" class = "logo" />

    <button @click="clear" class = "button003">カートの中身を消す</button>
    <button @click="foodkaihou" class = "image-burger-button" >
    </button>
     <div v-if="foodhyouji">
      <div 
        v-for="item in foodItems" 
        :key="item.name" 
        class="item"
      >
        <img :src="item.img" class="item-img" />
        <p>{{ item.name }} - {{ item.price }}円</p>
        <button @click="inCart(item)" class="button003">カートに入れる</button>
      </div>
    </div>
    <button @click="drinkkaihou" class = "image-drink-button" >
    </button>
    <!-- 飲み物 -->
    <div v-if="drinkhyouji">
      <div
        v-for="item in drinkItems"
        :key="item.name"
        class="item"
      >
        <img :src="item.img" class="item-img" />
        <p>{{ item.name }} - {{ item.price }}円</p>
        <button @click="inCart(item)" class="button003">カートに入れる</button>
      </div>
    </div>

    <h2 class="cart">カート</h2>

    <div v-for="c in cart" :key="c.item.name" class="item">
      <img :src="c.item.img" class="item-img" />
      {{ c.item.name }} ×{{ c.qty }}（{{ c.item.price }}円）
      <button @click="add(c)">＋</button>
      <button @click="remove(c)">ー</button>
    </div>

    <h3 class="sum">合計: {{ total }}円</h3>

    <button v-if="!isShowNameInput" @click="startOrder" class="order">
      注文
    </button>
    <!-- 「注文する」を押した後に現れるエリア -->
    <div v-if="isShowNameInput" class="name-confirm-area">
      <p style="color: white;">お名前を入力して確定してください</p>
      <input 
        v-model="userName" 
        type="text" 
        placeholder="お名前（ニックネーム可）" 
        class="name-input"
      />
      <div class="button-group">
        <button @click="confirmAndSend" class="confirm-btn">送信を確定する</button>
        <button @click="isShowNameInput = false" class="cancel-btn">キャンセル</button>
      </div>
    </div>
  </header>
</template>

<style>
/* scopedをつけないことで画面全体(body)に色が塗れるようになります */
html, body {
  margin: 0;
  padding: 0;
  background-color: #880000; /* headerと同じ赤にする */
}
</style>

<style scoped>
header{
  color: #000; 
  user-select: none;
}
header .header-title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-top: 20px;
  color: white;
  font-family: fantasy;
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
.name-confirm-area {
  background: rgba(0, 0, 0, 0.2);
  padding: 20px;
  border-radius: 10px;
  margin-top: 20px;
  text-align: center;
}

.name-input {
  padding: 10px;
  font-size: 18px;
  border-radius: 5px;
  border: none;
  width: 80%;
  margin-bottom: 15px;
}

.confirm-btn {
  background: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.cancel-btn {
  background: #666;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  margin-left: 10px;
  cursor: pointer;
}

.button-group {
  display: flex;
  justify-content: center;
}
 .image-burger-button {
    display: flex;
     margin: 20px auto; /* 真ん中に設置　*/ 
     justify-content: center;
     align-items: center;
    width: 200px;              /* ボタン幅 */
    height: 60px;              /* ボタン高さ */
    border: none;
    cursor: pointer;          
    line-height: 60px;         /* 高さと同じにして中央寄せ */
    background-image: url('@/assets/allham.png'); /* 画像パス */
    background-size: cover;    /* 縦横比を保ちつつ全面表示 */
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 8px;        /* 角丸 */
    transition: opacity 0.3s;
  }

  .image-burger-button:hover {
    opacity: 0.8;              /* ホバー時に少し暗く */
  }
   .image-drink-button {
    display: flex;
     margin: 20px auto; /* 真ん中に設置　*/ 
     justify-content: center;
     align-items: center;
    width: 200px;              /* ボタン幅 */
    height: 60px;              /* ボタン高さ */
    border: none;
    cursor: pointer;
    line-height: 60px;         /* 高さと同じにして中央寄せ */
    background-image: url('@/assets/alldri.png'); /* 画像パス */
    background-size: cover;    /* 縦横比を保ちつつ全面表示 */
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 8px;        /* 角丸 */
    transition: opacity 0.3s;
  }

  .image-drink-button:hover {
    opacity: 0.8;              /* ホバー時に少し暗く */
  }
</style>
