import { ipcRenderer } from 'electron-better-ipc';
import { createDecorator } from 'vue-class-component';
import Vue from 'vue';

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
        event = event ? toKebabCase(event): undefined;
        key = toKebabCase(key);
        const origin = componentOptions.provide as Function;
        const originMounted = componentOptions.mounted || (() => {});
        // componentOptions.mounted = function (this: Vue) {
        //     console.log('mounted')
        //     ipcRenderer.answerMain(event || key, (...args: any[]) => {
        //         origin.apply(this, args)
        //     });
        // }
        componentOptions.mounted = pipe(originMounted, function (this: Vue) {
            console.log('mounted')
            ipcRenderer.answerMain(event || key, (...args: any[]) => {
                origin.apply(this, args)
            });
        })
        componentOptions.provide = function () {}
    })
}

