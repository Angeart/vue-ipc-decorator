<template>
  <div id="app">
    <button @click="testCallFromRenderer()">call test</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from './components/HelloWorld.vue';
import { IpcRendererSend, IpcRendererReceive } from '../../src/index';

@Component({
  components: {
    HelloWorld,
  },
})
export default class App extends Vue {
  @IpcRendererSend()
  testEvent() {
    return 'hoge!!';
  }
  testCallFromRenderer() {
    console.log('triggered');
    (async () => {console.log(await this.testEvent())})();
  }
  @IpcRendererReceive()
  testReceive(data: any) {
    console.log('receive from main process',data)
    return 'hoge'
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
