
<script lang="ts" setup>
    // const MyPromise = require('some-promise-lib');
import confetti from "canvas-confetti"

let prop = defineProps<{
    state:{
        wine:Boolean,
        lose:Boolean
    }
}>()

var count = 300;
var defaults = {
  origin: { y: 0.7 }
};

function fire(particleRatio:number, opts:any) {
  confetti(Object.assign({}, defaults, opts, {
    particleCount: Math.floor(count * particleRatio)
  }));
}
function wine(){
fire(0.25, {
  spread: 30,
  startVelocity: 55,
});
fire(0.2, {
  spread: 65,
});
fire(0.35, {
  spread: 120,
  decay: 0.91,
  scalar: 0.8
});
fire(0.1, {
  spread: 140,
  startVelocity: 25,
  decay: 0.92,
  scalar: 1.2
});
fire(0.1, {
  spread: 160,
  startVelocity: 45,
});

}



let end:number
function lose() {

// go Buckeyes!
let colors = ['#4B0082', '#ffffff','	#DA70D6','#DC143C'];
  confetti({
    particleCount: 4,
    angle: 60,
    spread: 55,
    origin: { x: 0 },
    colors: colors
  });
  confetti({
    particleCount: 4,
    angle: 120,
    spread: 55,
    origin: { x: 1 },
    colors: colors
  });

  if (Date.now() < end) {
    requestAnimationFrame(lose);
  }
}

watch(prop,({state})=>{
    if(state.wine){
        setTimeout(() => {
        wine()
        }, 200);
    }
    if(state.lose){
      setTimeout(() => {
        end = Date.now() + (1*1000)
        lose()
        }, 200);
    }
})
</script>
<template></template>
<style>
  
</style>