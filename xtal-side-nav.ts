import {XtalElement} from 'xtal-element/xtal-element.js';
import { define } from 'trans-render/define.js';
import { createTemplate, newRenderContext } from "xtal-element/utils.js";
const mainTemplate = createTemplate(/* html*/`
<span id="opener" style="font-size:30px;cursor:pointer">&#9776; <slot name="title"></slot></span>
<div id="mySidenav" class="sidenav">
    <a id="closebtn">&times;</a>
    <slot id="slot"></slot>
</div>
<style>
    :host {
        display: block;
    }

    .sidenav {
        height: 100%;
        width: 0;
        position: fixed;
        z-index: 10;
        top: 0;
        left: 0;
        background-color: #111;
        overflow-x: hidden;
        transition: 0.5s;
        padding-top: 60px;
    }

    .sidenav a {
        padding: 8px 8px 8px 32px;
        text-decoration: none;
        font-size: 25px;
        color: #818181;
        display: block;
        transition: 0.3s;
    }

    .sidenav a:hover {
        color: #f1f1f1;
    }

    .sidenav #closebtn {
        position: absolute;
        cursor:pointer;
        top: 0;
        right: 25px;
        font-size: 36px;
        margin-left: 50px;
    }

    @media screen and (max-height: 450px) {
        .sidenav {
            padding-top: 15px;
        }
        .sidenav a {
            font-size: 18px;
        }
    }
</style>
`);
export class XtalSideNav extends XtalElement{
    static get is(){return 'xtal-side-nav';}
    get eventContext(){
        return {};
    }
    get mainTemplate(){
        return mainTemplate;
    }
    _initContext = newRenderContext({});
    get initContext() {
      return this._initContext;
    }
    get ready(){
        return true;
    }
    onPropsChange(){
        if(!super.onPropsChange()) return false;
        this.initShadowRoot();
    }
    openMenu(e){
        this.setWidth(250);
    }
    setWidth(width){
        this.shadowRoot.getElementById('mySidenav').style.width = width + 'px';
    }
    _boundOpener;
    closeMenu(e){
        this.setWidth(0);
    }
    _boundCloser;
    _opener: HTMLElement;
    _closer: HTMLElement;
    _slot: HTMLSlotElement;
    initShadowRoot() {
        this._opener = this.shadowRoot.getElementById('opener') as HTMLElement;
        this._boundOpener = this.openMenu.bind(this);
        this._opener.addEventListener('click', this._boundOpener);
        this._closer = this.shadowRoot.getElementById('closebtn') as HTMLElement;
        this._boundCloser = this.closeMenu.bind(this);
        this._closer.addEventListener('click', this._boundCloser);
        this._slot = this.shadowRoot.getElementById('slot') as HTMLSlotElement; 
        this._slot.addEventListener('click', this._boundCloser);
    }
    disconnectedCallback(){
        this._opener.removeEventListener('click', this._boundOpener);
        this._closer.removeEventListener('click', this._boundCloser);
        this._slot.removeEventListener('click', this._boundCloser);
    }
}

define(XtalSideNav);