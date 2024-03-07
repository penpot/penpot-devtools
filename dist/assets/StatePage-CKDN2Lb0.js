import{d as B,i as M,a as E,A as x,o,c as i,F as R,z as T,q as v,_ as b,u as S,h as _,j as l,w as f,k as m,t as u,B as y,p as F,l as L,v as h,m as g,e as N}from"./index-D13jxU-F.js";import{P as V}from"./PageContainer-CSGhNNGj.js";const $=B("state",()=>{const{sendMessage:r}=M("messaging"),s=E(""),n=x(()=>new RegExp(s.value,"i")),e=E({id:"root",name:"root",type:"unknown:unknown",value:void 0,children:[],state:"unloaded",isExpandable:!0,isExpanded:!1});async function c(t){t.isExpandable&&(t.isExpanded=!t.isExpanded,t.isExpanded&&(t.state==="unloaded"||t.state==="loaded")&&(t.state="loading",await d(t)))}async function d(t){try{const a=await r("state",t.id);t&&(a!=null&&a.type&&(t.type=a.type),a!=null&&a.value&&(t.value=a.value),a!=null&&a.children&&(t.children=a.children),a!=null&&a.isExpandable&&(t.isExpandable=a.isExpandable),t.state="loaded")}catch(a){t&&(t.type="error",t.value=a.message,t.children=[],t.isExpandable=!1,t.state="error")}}async function p(t){d(t)}return{filterRegex:n,filter:s,state:e,refresh:p,toggle:c,tryResolve:d}}),j={__name:"StateTreeList",props:{items:{type:Array,required:!0}},setup(r){const s=r;return(n,e)=>(o(),i("ul",null,[(o(!0),i(R,null,T(s.items,c=>(o(),v(I,{key:c.id,item:c},null,8,["item"]))),128))]))}},q=["transform"],z={__name:"IconArrow",props:{direction:{type:String,default:"right"}},setup(r){const s=r,n=x(()=>{switch(s.direction){case"up":return 270;case"down":return 90;case"left":return 180;case"right":default:return 0}});return(e,c)=>(o(),i("path",{d:"m6 12 4-4-4-4",transform:`rotate(${n.value} 8 8)`},null,8,q))}},A={},P={d:"M2.4 8a6 6 0 111.758 4.242M2.4 8l2.1-2zm0 0L1 5.5z"};function D(r,s){return o(),i("path",P)}const O=b(A,[["render",D]]);function k(r){const s=r;s.__i18n=s.__i18n||[],s.__i18n.push({locale:"",resource:{en:{loading:n=>{const{normalize:e}=n;return e(["Loading..."])}},es:{loading:n=>{const{normalize:e}=n;return e(["Cargando..."])}}}})}const G={class:"item"},H={key:0,class:"arrow"},J={key:1,class:"arrow variable"},K={class:"name"},Q={key:2,class:"value"},U={key:0,class:"loading"},C={__name:"StateTreeItem",props:{item:{type:Object,required:!0}},setup(r){const{t:s}=S(),n=$(),e=r,c=x(()=>e.item.isExpanded?"down":"right");function d(){e.item.isExpandable&&n.toggle(e.item)}function p(){n.refresh(e.item)}return(t,a)=>(o(),i("li",G,[_("div",{class:y(["line",{expanded:e.item.isExpanded}]),onClick:d},[e.item.isExpandable?(o(),i("div",H,[l(m,{size:"1.5rem"},{default:f(()=>[l(z,{direction:c.value},null,8,["direction"])]),_:1})])):(o(),i("div",J,[l(m,{size:"1.5rem"},{default:f(()=>[l(z,{direction:"right"})]),_:1})])),_("div",K,u(e.item.name),1),_("div",{class:y(["type",e.item.type.replace(/:+/g,"-")]),onClick:F(p,["stop"])},[l(m,{class:"reload",size:"0.5rem"},{default:f(()=>[l(O)]),_:1}),L(" "+u(e.item.type),1)],2),e.item.isExpandable?h("",!0):(o(),i("div",Q,u(e.item.value),1))],2),e.item.isExpanded&&e.item.state==="loading"?(o(),i("ul",U,u(g(s)("loading")),1)):h("",!0),e.item.isExpanded&&e.item.state==="loaded"?(o(),v(j,{key:1,items:e.item.children},null,8,["items"])):h("",!0)]))}};typeof k=="function"&&k(C);const I=b(C,[["__scopeId","data-v-f5fb7e47"]]);function w(r){const s=r;s.__i18n=s.__i18n||[],s.__i18n.push({locale:"",resource:{en:{state:n=>{const{normalize:e}=n;return e(["State"])},filter:n=>{const{normalize:e}=n;return e(["Filter"])}},es:{state:n=>{const{normalize:e}=n;return e(["Estado"])},filter:n=>{const{normalize:e}=n;return e(["Filtro"])}}}})}const W={class:"state"},X={__name:"StatePage",setup(r){const{t:s}=S(),n=$();return N(()=>n.refresh()),(e,c)=>(o(),v(V,{title:g(s)("state")},{default:f(()=>[_("div",W,[l(I,{item:g(n).state},null,8,["item"])])]),_:1},8,["title"]))}};typeof w=="function"&&w(X);export{X as default};