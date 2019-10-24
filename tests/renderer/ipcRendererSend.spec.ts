import { IpcRendererSend } from '../../src/index';
import { ipcRenderer } from 'electron-better-ipc';
import Vue, { CreateElement } from 'vue';
const mock = jest.fn();
ipcRenderer.callMain = mock;

describe(IpcRendererSend, () => {
    describe('send without event name', () => {
        class Greeter extends Vue {
            @IpcRendererSend()
            testGreet() {
                return 'greet!!';
            }
            render (h: CreateElement) { h('div')}
        }
        const greeter = new Greeter();

        beforeAll(() => {
            mock.mockClear();
            greeter.testGreet()
        });
        test('call callMain method', () => {
            expect(mock).toHaveBeenCalled();
        })
        test('ipc message given function name as a event name', () => {
            expect(mock.mock.calls[0][0]).toBe('test-greet');
        })
        test('ipc message given parameter', () => {
            expect(mock.mock.calls[0][1]).toBe('greet!!');
        })
    });

    describe('send with event name', () => {
        class Greeter extends Vue {
            @IpcRendererSend('aliasEventName')
            testGreet() {
                return 'greet!!';
            }
            render (h: CreateElement) { h('div')}
        }
        const greeter = new Greeter();

        beforeAll(() => {
            mock.mockClear();
            greeter.testGreet()
        });
        test('call callMain method', () => {
            expect(mock).toHaveBeenCalled();
        })
        test('ipc message given function name as a event name', () => {
            expect(mock.mock.calls[0][0]).toBe('alias-event-name');
        })
        test('ipc message given parameter', () => {
            expect(mock.mock.calls[0][1]).toBe('greet!!');
        })
    });
})