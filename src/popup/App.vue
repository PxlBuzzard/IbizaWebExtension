<template>
    <div id="app">
        <div id="sidebar">
          <Sidebar/>
        </div>
        <div id="content">
          <Sidebar/>
        </div>
    </div>
</template>

<script>
import Sidebar from "./components/Sidebar.vue"

export default {
    components: {
        Sidebar
    }
}
</script>

<style>
*, *::before, *::after {
  box-sizing: border-box;
}

#app {
    max-width: 500px;
    margin: 0 auto;
    line-height: 1.4;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    display: flex;
}

#sidebar {
  flex: 1;
}

#content {
  flex: 1;
}
</style>
