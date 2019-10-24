import { IpcRendererReceive } from '../../src/index';
import { ipcRenderer, ipcMain } from 'electron-better-ipc';
import Vue, { CreateElement } from 'vue';
import Component from 'vue-class-component';
const mock = jest.fn();
const mountedMock = jest.fn();
mountedMock.mockImplementation(() => mock());
ipcRenderer.answerMain = mountedMock;

describe(IpcRendererReceive, () => {
    describe('send without event name', () => {
        @Component
        class Greeter extends Vue {
            @IpcRendererReceive()
            testGreet() {
            }
            render (h: CreateElement) { h('div')}
            mounted () {
                console.log('mounted on greeter')
            }
        }
        const greeter = new Greeter();

        beforeAll(() => {
            mock.mockClear();
            mountedMock.mockClear();
            if (greeter.$options.mounted) {
                console.info('greeter has monted function')
                console.dir((greeter.$options.mounted as any)[0]);
                (greeter.$options.mounted as any)[0]();
            } else {
                console.warn('greeter not has mounted')
            }
        });
        test('call callMain method', () => {
            expect(mountedMock).toHaveBeenCalled();
            expect(mock).toHaveBeenCalled();
        })
        test('ipc message given function name as a event name', () => {
            expect(mountedMock.mock.calls[0][0]).toBe('test-greet');
        })
    });

    describe('send with event name', () => {
        @Component
        class Greeter extends Vue {
            @IpcRendererReceive('aliasEventName')
            testGreet() {
                return 'greet!!';
            }
            render (h: CreateElement) { h('div')}
        }
        const greeter = new Greeter();

        beforeAll(() => {
            mock.mockClear();
            mountedMock.mockClear();
            if (greeter.$options.mounted) {
                console.info('greeter has monted function')
                greeter.$options.mounted();
            } else {
                console.warn('greeter not has mounted')
            }
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