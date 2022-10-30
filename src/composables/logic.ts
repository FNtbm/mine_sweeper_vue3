import { Ref, UnwrapNestedRefs } from "vue";

interface BlockState {
    x?: number;
    y?: number;
    revealed?: boolean;
    mine?: boolean;
    flagged?: boolean;
    aroundMines?: number;
  }
  
  interface GameState{
    begin:boolean,
    win:boolean,
    lose:boolean
  } 

  //初始化
  const Around = [
    [1, 1],
    [0, 1],
    [1, 0],
    [-1, -1],
    [-1, 0],
    [0, -1],
    [1, -1],
    [-1, 1],
  ];
  class Game {
    chunk:Ref<BlockState[][]> = ref() 
    size:Number
    constructor(Size:number){
        this.size = Size
    }

    blocksInit() { 
        return Array(Size.value)
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
    }
    
  //生成炸弹
   generateMines(blockClick: BlockState) {
    for (let row of chunk.value) {
      for (let block of row) {
        if (block === blockClick) continue;
        block.mine = Math.random() < 0.15;
        if(block.mine){
          
        }
      }
    }
  }
  
 
  //获取周边格子的状态
   aroundCount(block: BlockState) {
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
   computeMines() {
    chunk.value.forEach((row) => {
      row.forEach((block) => {
        if (block.mine) return;
  
        aroundCount(block).forEach((aroundBlock) => {
          if (aroundBlock.mine) {
            (block.aroundMines as number) += 1;
          }
        });
      });
    });
  }
  
  //翻开周边为0的格子
   zeroRevealed(block: BlockState) {
    if (block.aroundMines) return;
  
    aroundCount(block).forEach((aroundBlock) => {
      if (!aroundBlock.revealed) {
        aroundBlock.revealed = true;
        zeroRevealed(aroundBlock);
      }
    });
  }
  
  //block动态样式
   blockClass(block: BlockState) {
    if (block.revealed || gameState.lose) {
      return block.mine ? "bg-red/50" : "text-gray";
    }
    if (!block.revealed) {
      return "hover:bg-gray/60";
    }
  }
   reset(){
    this.chunk.value = this.blocksInit()
    this.gameState = reactive({
        begin:false,
        win:false,
        lose:false
        })
    }
  }
  
  let gameInit = false;
  let gameState:ReactiveVariable<GameStats> = reactive({
    begin:false,
    win:false,
    lose:false
  })
  
   function onClick(block: BlockState)   {
    if(gameState.win || gameState.lose){
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
  
  
  
  function checkGameState() {
    const blocks = chunk.value.flat();
    let sUserAgent = navigator.userAgent.toLowerCase();
        if (/ipad|iphone|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/.test(sUserAgent)) {
          if (
      blocks.every((block) =>  (!block.revealed && block.mine) || block.revealed)
    )  gameState.win = true;
        } else {
          if (
      blocks.every((block) => (block.mine && block.flagged) ||  block.revealed)
    )  gameState.win = true;
        }
  }
  watchEffect(checkGameState);
  