# Vue Ipc Decorator
Write ipc message with class style method is possible

[![CircleCI](https://circleci.com/gh/Angeart/sapphire-cpp/tree/master.svg?style=shield)](https://circleci.com/gh/Angeart/sapphire-cpp/tree/master)
# Install
```bash
yarn add -D vue-ipc-decorator
```

## Recommends
I reccomend use this library with [vue-property-decorator](https://github.com/kaorun343/vue-property-decorator)

[![kaorun343/vue-property-decorator - GitHub](https://gh-card.dev/repos/kaorun343/vue-property-decorator.svg)](https://github.com/kaorun343/vue-property-decorator)

# Usage
## Vanilla Electron with Vue
#### renderer-process
```ts
import { ipcRenderer } from 'electron';
import Vue from 'vue';
import Component from 'vue-class-component';
@Component()
export default class GreetComponent extends Vue {
    //
    // some super awesome implementations...
    //

    // 🤔
    private greet() {
        ipcRenderer.on('greet-response', (ev, data) => {
            console.log('got response!!', data)
        })
        ipcRenderer.send('greet', 'hey!');
    }
}
```
#### main-process
```ts
import { ipcMain } from 'electron';
ipcMain.on('greet', (ev, data) => {
    console.log('greeting from renderer', data)
    ev.sender.send('greet-response','hello')
})
```

## Use with this Library
#### renderer-process
```ts
import { IpcRendererSend } from 'vue-ipc-decorator';
import Vue from 'vue';
import Component from 'vue-class-component';
@Component()
export default class GreetComponent extends Vue {
    //
    // some super awesome implementations...
    //

    // 😎
    @IpcRendererSend()
    private greetFromRenderer() {
        return 'hey!';
    }

    private async greet() {
        // decorated function will be asynchronous function
        let response = await this.greetFromRenderer();
            console.log('got response!!', response)
    }
}
```
#### main-process
```ts
import { IpcMainReceive } from 'vue-ipc-decorator';

class Greet {
  @IpcMainReceive()
  private greetFromRenderer(data: any) {
    console.log('greeting from renderer', data)
    return 'hello'
  }
}
const greeter = new Greet();
```