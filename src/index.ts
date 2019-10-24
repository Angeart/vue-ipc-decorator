import { ipcRenderer, ipcMain } from 'electron-better-ipc';
import { createDecorator } from 'vue-class-component';
import Vue from 'vue';
import { BrowserWindow } from 'electron';

const _toKebabCaseRegex = /\B([A-Z])/g;
const toKebabCase = (str: string) => str.replace(_toKebabCaseRegex, '-$1').toLowerCase();
const pipe = <R>(f:(a?:R) => R, ...rf:Array<(a?:R) => R>) => rf.reduceRight((p,n) => v => n(p(v)), f);
/**
 * decorator of ipcRenderer Send function
 * @param event the name of event, default used by function name
 * @return Method Decorator
 */
export function IpcRendererSend(event?: string) {
    return function(_target: Vue, key: string, descripter: PropertyDescriptor) {
        event = event ? toKebabCase(event): undefined;
        key = toKebabCase(key);
        const origin = descripter.value as Function;
        descripter.value = async function (...args: any[]) {
            return ipcRenderer.callMain(event || key, origin.apply(this, args));
        }
    }
}

/**
 * decorator of ipcRenderer Receive function
 * @param event the name of event, default used by function name
 * @return Method Decorator
 */
export function IpcRendererReceive(event?: string) {
    return createDecorator((componentOptions, key) => {
        if (!componentOptions.methods) {
            return
        }
        const origin = componentOptions.methods[key]
        event = event ? toKebabCase(event): undefined;
        key = toKebabCase(key);
        console.dir(componentOptions)
        const originMounted = componentOptions.mounted || (() => {});
        componentOptions.mounted = pipe(function (this: Vue) {
            console.log('ipc receive mounted')
            ipcRenderer.answerMain(event || key, (...args: any[]) => {
                console.dir(origin)
                return origin.apply(this, args)
            });
        }, originMounted)
    })
}

/**
 * decorator of ipcMain Send function
 * @param event the name of event, default used by function name
 * @return Method Decorator
 */
export function IpcMainSend(event?: string) {
    return function(_target: Object, key: string, descripter: PropertyDescriptor) {
        event = event ? toKebabCase(event): undefined;
        key = toKebabCase(key);
        const origin = descripter.value as Function;
        descripter.value = async function (...args: any[]) {
            const window = BrowserWindow.getFocusedWindow();
            if (!window) {
                console.error('vue-ipc-decorator','cannot get the focused window');
                return;
            }
            return ipcMain.callRenderer(window, event || key, origin.apply(this, args));
        }
    }
}

/**
 * decorator of ipcMain Send function
 * @param event the name of event, default used by function name
 * @return Method Decorator
 */
export function IpcMainReceive(event?: string) {
    return function(target: Object, key: string, descripter: PropertyDescriptor) {
        event = event ? toKebabCase(event): undefined;
        key = toKebabCase(key);
        const origin = descripter.value as Function;
        console.log('ipc main receive decorator')
        console.dir(target.constructor)
        const register = function (this: typeof target) {
            console.log('registered')
            ipcMain.answerRenderer(event || key, (...args: any[]) => {
                return origin.apply(this, args)
            });
        }
        register.apply(target);
    }
}
