<script setup lang="ts">
//block状态约束
interface BlockState {
  x: number;
  y: number;
  revealed: boolean;
  mine: boolean;
  flagged: boolean;
  aroundMines: number;
}

//初始化
const Size = 5;
const chunk = reactive(
  Array(Size)
    .fill("")
    .map((_, y) =>
      Array(Size)
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
);

//生成炸弹
function generateMines() {
  for (let row of chunk) {
    for (let block of row) {
      block.mine = Math.random() < 0.1;
    }
  }
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
function aroundCount(block: BlockState) {
  return around
    .map(([dx, dy]) => {
      const cx: number = block.x + dx;
      const cy: number = block.y + dy;
      if (cx >= 0 && cx < Size && cy >= 0 && cy < Size) {
        return chunk[cy][cx];
      }
    })
    .filter((item) => item !== undefined) as BlockState[];
}

//计算格子周边的炸弹数量
function computeMines() {
  chunk.forEach((row) => {
    row.forEach((block) => {
      if (block.mine) return;

      aroundCount(block).forEach((aroundBloack) => {
        if (aroundBloack.mine) {
          block.aroundMines += 1;
        }
      });
    });
  });
}

//翻开周边为0的格子
function zeroRevealed(block: BlockState) {
  if (block.aroundMines) return;

  aroundCount(block).forEach((aroundBloack) => {
    if (!aroundBloack.revealed) {
      aroundBloack.revealed = true;
      zeroRevealed(aroundBloack);
    }
  });
}

generateMines();
computeMines();

const lose = ref(false);

//block动态样式
function blockClass(block: BlockState) {
  if (block.revealed || lose.value) {
    return block.mine ? "bg-red" : "text-gray";
  }
  if (!block.revealed) {
    return "hover:bg-gray/60";
  }
}

function onClick(block: BlockState) {
  if (block.mine) {
    lose.value = true;
    blockClass(block);
    alert("BOMMING");
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

function checkGameState() {
  console.log("check");
  const blocks = chunk.flat();

  if (
    blocks.every((block) => (block.mine && block.flagged) || block.revealed)
  ) {
    alert("YOU WIN");
  }
}

watchEffect(checkGameState);
</script>

<template>
  <div>
    <h1>Minesweeper</h1>

    <div v-for="row in chunk" flex="~" items-center justify-center>
      <button
        v-for="block in row"
        :class="blockClass(block)"
        w-9
        h-9
        border-1
        flex="~"
        items-center
        justify-center
        @click="onClick(block)"
        @contextmenu.prevent="rightClick(block)"
      >
        <div v-if="block.flagged" i-mdi:flag></div>

        <div v-if="block.revealed || lose" flex="~" items-center justify-center>
          <div v-if="block.mine" i-mdi:minecraft>'x'</div>
          <div v-else>{{ block.aroundMines }}</div>
        </div>
      </button>
    </div>
  </div>
</template>
