<template>
  <nav text-xl mt-6 inline-flex gap-2>
    <button icon-btn @click="toggleDark(true)">
      <div dark:i-carbon-moon i-carbon-sun />
    </button>

    <a
      icon-btn
      i-carbon-logo-github
      rel="noreferrer"
      href="https://github.com/FNtbm/mine_sweeper_vue3"
      target="_blank"
      title="GitHub"
    />
  </nav>
</template>
