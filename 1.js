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

function add() {
  around.forEach(([dx, dy]) => {
    if (dx + dy == 0) return;
  });
}
add();
