<script setup lang="ts">

//block状态约束
interface BlockState {
  x?: number;
  y?: number;
  revealed?: boolean;
  mine?: boolean;
  flagged?: boolean;
  aroundMines?: number;
}

//初始化
let Size = ref(6);

let chunk =ref(Array(Size.value)
    .fill("")
    .map((_, y) =>
      Array(Size.value)
        .fill("")
        .map(
          (_, x): BlockState => ({
            x,
            y,
            revealed: false,
            mine: false,
            flagged: false,
            aroundMines: 0,
          })
        )
    ))

//生成炸弹
let blocks = ref(0) 
let probability = ref(20)

function generateMines(blockClick: BlockState) {
   for (let row of chunk.value) {
     for (let block of row) {
      if (block === blockClick) continue;
      block.mine = Math.random() < probability.value/100;
      if(block.mine){
        blocks.value ++
      }
    }
  }
  aroundBlocks(blockClick).forEach(item=>{
        item.mine = false
      })
}

const around = [
  [1, 1],
  [0, 1],
  [1, 0],
  [-1, -1],
  [-1, 0],
  [0, -1],
  [1, -1],
  [-1, 1],
];
//获取周边格子的状态
function aroundBlocks(block: BlockState) {
  return around
    .map(([dx, dy]) => {
      const cx: number = (block.x as number) + dx;
      const cy: number = (block.y as number) + dy;
      if (cx >= 0 && cx < Size.value && cy >= 0 && cy < Size.value) {
        return chunk.value[cy][cx];
      }
    })
    .filter((item) => item !== undefined) as BlockState[];
}

//计算格子周边的炸弹数量
function computeMines() {
  chunk.value.forEach((row) => {
    row.forEach((block) => {
      if (block.mine) return;

      aroundBlocks(block).forEach((aroundBlock) => {
        if (aroundBlock.mine) {
          (block.aroundMines as number) += 1;
        }
      });
    });
  });
}

//翻开周边为0的格子
function zeroRevealed(block: BlockState) {
  if (block.aroundMines) return;

  aroundBlocks(block).forEach((aroundBlock) => {
    if (!aroundBlock.revealed) {
      aroundBlock.revealed = true;
      zeroRevealed(aroundBlock);
    }
  });
}

//block动态样式
function blockClass(block: BlockState) {
  if (block.revealed || gameState.lose) {
    return block.mine ? "bg-red/50" : "text-gray";
  }
  if (!block.revealed) {
    return "hover:bg-gray/60";
  }
}

let gameInit = false;
let gameState = reactive({
  wine:false,
  lose:false
})

 function onClick(block: BlockState)   {
  if(gameState.wine || gameState.lose){
    return;
  }

  if (!gameInit) {
    generateMines(block);
    computeMines();
    gameInit = true;
  }

  if (block.mine) {
    // gameBegin = false;
    gameState.lose = true;
    // alert("BOMBING");
    return;
  }

  if (!block.revealed) {
    block.revealed = true;
    zeroRevealed(block);
  }
  // checkGameState();
}

function rightClick(block: BlockState) {
  if (block.revealed) return;
  block.flagged = !block.flagged;
  // checkGameState();
}

function reset(){
  chunk.value = Array(Size.value)
    .fill("")
    .map((_, y) =>
      Array(Size.value)
        .fill("")
        .map(
          (_, x): BlockState => ({
            x,
            y,
            revealed: false,
            mine: false,
            flagged: false,
            aroundMines: 0,
          })
        )
    )
    gameInit = false;
    gameState.wine = false;
    gameState.lose = false;
    blocks.value = 0
}

let isMobile = ref(false)
function checkMobile(){
  let sUserAgent = navigator.userAgent.toLowerCase();
      if (/ipad|iphone|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/.test(sUserAgent)) {
        isMobile.value = true
  }
}

function checkGameState() {
  const blocks = chunk.value.flat();
      if (isMobile.value) {
        if (
    blocks.every((block) =>  (!block.revealed && block.mine) || block.revealed)
  )  gameState.wine = true;
      } else {
        if (
    blocks.every((block) => (block.mine && block.flagged) ||  block.revealed)
  )  gameState.wine = true;
      }
}
checkMobile()
watchEffect(checkGameState);
watch(Size,reset);

let show = ref(true)
setTimeout(() => {
  show.value = false
}, 2500);

</script>

<template>
  <Confetti :state="gameState"/>
  
  <!-- 功能区 -->

  <div>
      <h1 style="font-size:1.5rem;" mb-3>MineSweeper  <span i-mdi:minecraft>10</span></h1> 

    <div flex="~" content-center  justify-center> 
    <button i-mdi:plus-box @click="probability += probability>=90?0:10"></button>
      <span style="font-size: 0.85em;" >{{probability}}%</span>
    <button mr-2 i-mdi:minus-box  @click="probability += probability<=10?0:-10"></button>
    
    <button
      :onclick="reset"
       mb-3 i-mdi:refresh-circle 
       active-rotate-360
       transition-transform-360 
      ></button>

      <button ml-2 i-mdi:plus-box @click="Size += Size>=10?0:1"></button>
      <span style="font-size: 0.85em;" >{{Size}}</span>
    <button  i-mdi:minus-box  @click="Size += Size<=2?0:-1"></button>
  </div>
    <!-- <span>{{blocks}}</span> -->
    <div v-for="row in chunk" flex="~" items-center justify-center>
      <button
        v-for="block in row"
        :class="blockClass(block)"
        class="block"
        w-9
        h-9
        border-1
        flex="~"
        items-center
        justify-center
        active:bg-blue-3
        @click="onClick(block)"
        @contextmenu.prevent="rightClick(block)"
      >
        <div v-if="block.flagged" i-mdi:flag></div>
        <div v-if="block.revealed || gameState.lose || gameState.wine" flex="~" items-center justify-center>
          <div v-if="block.mine" i-mdi:minecraft>'x'</div>
          <div v-else>{{ !block.aroundMines?'':block.aroundMines }}</div>
        </div>
      </button>
    </div>
  <span md-2 v-if="isMobile && show"  transition-all>( 长按<span i-mdi:flag>10</span> )</span>

  </div>
</template>