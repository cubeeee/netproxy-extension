/*! For license information please see 648.js.LICENSE.txt */
"use strict";(self.webpackChunkreactjs_chrome=self.webpackChunkreactjs_chrome||[]).push([[648],{961:(e,t,n)=>{!function e(){if("undefined"!=typeof __REACT_DEVTOOLS_GLOBAL_HOOK__&&"function"==typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE)try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(e)}catch(e){console.error(e)}}(),e.exports=n(2551)},2648:(e,t,n)=>{n.d(t,{I9:()=>E});var r,a,o=n(6540),i=n.t(o,2),c=n(961),s=n.t(c,2);function l(){return l=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},l.apply(this,arguments)}(a=r||(r={})).Pop="POP",a.Push="PUSH",a.Replace="REPLACE";const u="popstate";function h(e,t){if(!1===e||null==e)throw new Error(t)}function f(e,t){return{usr:e.state,key:e.key,idx:t}}function p(e,t,n,r){return void 0===n&&(n=null),l({pathname:"string"==typeof e?e:e.pathname,search:"",hash:""},"string"==typeof t?w(t):t,{state:n,key:t&&t.key||r||Math.random().toString(36).substr(2,8)})}function d(e){let{pathname:t="/",search:n="",hash:r=""}=e;return n&&"?"!==n&&(t+="?"===n.charAt(0)?n:"?"+n),r&&"#"!==r&&(t+="#"===r.charAt(0)?r:"#"+r),t}function w(e){let t={};if(e){let n=e.indexOf("#");n>=0&&(t.hash=e.substr(n),e=e.substr(0,n));let r=e.indexOf("?");r>=0&&(t.search=e.substr(r),e=e.substr(0,r)),e&&(t.pathname=e)}return t}var m;!function(e){e.data="data",e.deferred="deferred",e.redirect="redirect",e.error="error"}(m||(m={})),new Set(["lazy","caseSensitive","path","id","index","children"]),Error;const y=["post","put","patch","delete"],v=(new Set(y),["get",...y]);function g(){return g=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},g.apply(this,arguments)}new Set(v),new Set([301,302,303,307,308]),new Set([307,308]),Symbol("deferred");const S=o.createContext(null),b=o.createContext(null);function O(e){let{basename:t="/",children:n=null,location:a,navigationType:i=r.Pop,navigator:c,static:s=!1,future:l}=e;null!=o.useContext(b)&&h(!1);let u=t.replace(/^\/*/,"/"),f=o.useMemo((()=>({basename:u,navigator:c,static:s,future:g({v7_relativeSplatPath:!1},l)})),[u,l,c,s]);"string"==typeof a&&(a=w(a));let{pathname:p="/",search:d="",hash:m="",state:y=null,key:v="default"}=a,O=o.useMemo((()=>{let e=function(e,t){if("/"===t)return e;if(!e.toLowerCase().startsWith(t.toLowerCase()))return null;let n=t.endsWith("/")?t.length-1:t.length,r=e.charAt(n);return r&&"/"!==r?null:e.slice(n)||"/"}(p,u);return null==e?null:{location:{pathname:e,search:d,hash:m,state:y,key:v},navigationType:i}}),[u,p,d,m,y,v,i]);return null==O?null:o.createElement(S.Provider,{value:f},o.createElement(b.Provider,{children:n,value:O}))}o.Component,i.startTransition,new Promise((()=>{})),o.Component,new Set(["application/x-www-form-urlencoded","multipart/form-data","text/plain"]);try{window.__reactRouterVersion="6"}catch(e){}new Map;const _=i.startTransition;function E(e){let{basename:t,children:n,future:a,window:i}=e,c=o.useRef();var s;null==c.current&&(c.current=(void 0===(s={window:i,v5Compat:!0})&&(s={}),function(e,t,n,a){void 0===a&&(a={});let{window:o=document.defaultView,v5Compat:i=!1}=a,c=o.history,s=r.Pop,w=null,m=y();function y(){return(c.state||{idx:null}).idx}function v(){s=r.Pop;let e=y(),t=null==e?null:e-m;m=e,w&&w({action:s,location:S.location,delta:t})}function g(e){let t="null"!==o.location.origin?o.location.origin:o.location.href,n="string"==typeof e?e:d(e);return n=n.replace(/ $/,"%20"),h(t,"No window.location.(origin|href) available to create URL for href: "+n),new URL(n,t)}null==m&&(m=0,c.replaceState(l({},c.state,{idx:m}),""));let S={get action(){return s},get location(){return e(o,c)},listen(e){if(w)throw new Error("A history only accepts one active listener");return o.addEventListener(u,v),w=e,()=>{o.removeEventListener(u,v),w=null}},createHref:e=>t(o,e),createURL:g,encodeLocation(e){let t=g(e);return{pathname:t.pathname,search:t.search,hash:t.hash}},push:function(e,t){s=r.Push;let a=p(S.location,e,t);n&&n(a,e),m=y()+1;let l=f(a,m),u=S.createHref(a);try{c.pushState(l,"",u)}catch(e){if(e instanceof DOMException&&"DataCloneError"===e.name)throw e;o.location.assign(u)}i&&w&&w({action:s,location:S.location,delta:1})},replace:function(e,t){s=r.Replace;let a=p(S.location,e,t);n&&n(a,e),m=y();let o=f(a,m),l=S.createHref(a);c.replaceState(o,"",l),i&&w&&w({action:s,location:S.location,delta:0})},go:e=>c.go(e)};return S}((function(e,t){let{pathname:n="/",search:r="",hash:a=""}=w(e.location.hash.substr(1));return n.startsWith("/")||n.startsWith(".")||(n="/"+n),p("",{pathname:n,search:r,hash:a},t.state&&t.state.usr||null,t.state&&t.state.key||"default")}),(function(e,t){let n=e.document.querySelector("base"),r="";if(n&&n.getAttribute("href")){let t=e.location.href,n=t.indexOf("#");r=-1===n?t:t.slice(0,n)}return r+"#"+("string"==typeof t?t:d(t))}),(function(e,t){!function(e,t){if(!e){"undefined"!=typeof console&&console.warn(t);try{throw new Error(t)}catch(e){}}}("/"===e.pathname.charAt(0),"relative pathnames are not supported in hash history.push("+JSON.stringify(t)+")")}),s)));let m=c.current,[y,v]=o.useState({action:m.action,location:m.location}),{v7_startTransition:g}=a||{},S=o.useCallback((e=>{g&&_?_((()=>v(e))):v(e)}),[v,g]);return o.useLayoutEffect((()=>m.listen(S)),[m,S]),o.createElement(O,{basename:t,children:n,location:y.location,navigationType:y.action,navigator:m,future:a})}var C,L,x,P;s.flushSync,i.useId,"undefined"!=typeof window&&void 0!==window.document&&window.document.createElement,(P=C||(C={})).UseScrollRestoration="useScrollRestoration",P.UseSubmit="useSubmit",P.UseSubmitFetcher="useSubmitFetcher",P.UseFetcher="useFetcher",P.useViewTransitionState="useViewTransitionState",(x=L||(L={})).UseFetcher="useFetcher",x.UseFetchers="useFetchers",x.UseScrollRestoration="useScrollRestoration"},6540:(e,t,n)=>{e.exports=n(5287)}}]);