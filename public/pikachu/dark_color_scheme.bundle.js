"use strict";(self.webpackChunkpikachu_volleyball=self.webpackChunkpikachu_volleyball||[]).push([[83],{7592:(e,c,t)=>{var o=t(1751);function r(e){document.documentElement.dataset.colorScheme=e;const c=document.querySelector('meta[name="theme-color"]');null!==c&&c.setAttribute("content","dark"===e?"#202124":"#FFFFFF")}!function(){const e=Array.from(document.getElementsByClassName("dark-color-scheme-checkbox")),c=o.U.get("colorScheme");if("dark"===c||"light"===c)e.forEach((e=>{e.checked="dark"===c})),r(c);else{const c=window.matchMedia("(prefers-color-scheme: dark)").matches;r(c?"dark":"light"),e.forEach((e=>{e.checked=c}))}e.forEach((c=>{c.addEventListener("change",(()=>{const t=c.checked?"dark":"light";r(t),o.U.set("colorScheme",t),e.forEach((e=>{e!==c&&(e.checked=c.checked)}))}))}))}()},1751:(e,c,t)=>{t.d(c,{U:()=>o});const o={get:e=>{let c=null;try{c=localStorage.getItem(e)}catch(e){console.error(e)}return c},set:(e,c)=>{try{localStorage.setItem(e,c)}catch(e){console.error(e)}}}}},e=>{e(e.s=7592)}]);
//# sourceMappingURL=dark_color_scheme.bundle.js.map