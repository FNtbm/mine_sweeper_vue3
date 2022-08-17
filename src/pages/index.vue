<script setup lang="ts">
interface BlockState {
  x: number;
  y: number;
  revealed: boolean;
  mine: boolean;
  flagged: boolean;
  aroundMines: number;
}

//初始化
const WIDTH = 3;
const HEIGTH = 3;
const chunk = reactive(
  Array(HEIGTH)
    .fill("")
    .map((_, y) =>
      Array(WIDTH)
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
      if (cx >= 0 && cx < WIDTH && cy >= 0 && cy < HEIGTH) {
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
const wine = ref(false);
//block动态样式
function blockClass(block: BlockState) {
  if (block.revealed || lose.value || wine.value) {
    return block.mine ? "bg-red" : "text-gray";
  }
}

function onClick(block: BlockState) {
  if (block.mine) {
    lose.value = true;
    alert("BOMMING");
  }

  if (!block.revealed) {
    block.revealed = true;
    zeroRevealed(block);
  }
}

function rightClick(block: BlockState) {
  block.flagged = !block.flagged;

  //胜利条件 所有炸弹被找到且，初炸弹外的所有格子被点开
}

for (let row of chunk) {
  for (let block of row) {
    if (block.revealed && !block.mine) {
      if (block.flagged && block.mine) {
        alert("YOU WIN");
      }
    }
  }
}
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
        hover="bg-gray/60"
        @click="onClick(block)"
        @contextmenu.prevent="rightClick(block)"
      >
        <div v-if="block.flagged || wine" i-mdi:flag></div>
        <div
          v-if="block.revealed || lose || wine"
          flex="~"
          items-center
          justify-center
        >
          <div v-if="block.mine" i-mdi:minecraft>'x'</div>
          <div v-else>{{ block.aroundMines }}</div>
        </div>
      </button>
    </div>
  </div>
</template>
