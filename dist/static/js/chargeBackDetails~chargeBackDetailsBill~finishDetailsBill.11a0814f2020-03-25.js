(window.webpackJsonp=window.webpackJsonp||[]).push([["chargeBackDetails~chargeBackDetailsBill~finishDetailsBill"],{"17/p":function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=f(a("EPZ6")),n=f(a("omC7")),r=f(a("unDg")),o=f(a("bS4n")),i=f(a("cLjf")),l=f(a("hDQ3")),d=a("8t5x"),c=f(a("ejB8")),u=f(a("J+lr"));function f(e){return e&&e.__esModule?e:{default:e}}t.default={name:"billComponent",components:{orderStatusIconComponents:c.default},data:function(){var e=this;return{props:{lazy:!0,lazyLoad:function(){var t=(0,l.default)(i.default.mark(function t(a,s){var n,r;return i.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(n=0===a.level?null:a.data.code,0!==a.level){t.next=7;break}return t.next=4,e.get_area();case 4:t.t0=t.sent,t.next=10;break;case 7:return t.next=9,e.get_area({code:n});case 9:t.t0=t.sent;case 10:200===(r=t.t0).code&&(r.data.forEach(function(e,t){e.value=e.code,e.label=e.name}),s(r.data));case 12:case"end":return t.stop()}},t,e)}));return function(e,a){return t.apply(this,arguments)}}()},caseVenueText:"案件管辖地",baseInfoMaterialList:[],flscChannel:[],flscChannelText:"",baseInfoMaterialVal:{plaintiffIdCard:"原告身份信息",defendantIdCard:"被告身份信息",otherPartyIdCard:"对方身份证信息",address:"地址",phoneNumber:"电话",clientIdCard:"身份证复印件",householdRegister:"户口本"},rules:{"clientInfo.clientName":[{required:!0,message:"请输入姓名",trigger:"blur"}],"clientInfo.clientContact":[{required:!0,message:"请输入联系电话",trigger:"blur"},{message:"请输入正确的手机号",trigger:"blur",pattern:/^0?(13|14|15|16|17|18|19)[0-9]{9}$/i}],clientHaveIdCard:[{required:!0,message:"请选择是否有身份证号",trigger:"blur"}],clientSexCode:[{required:!0,message:"请选择性别",trigger:"blur"}],clientIsParty:[{required:!0,message:"请选择是否为当事人",trigger:"blur"}]},orderBusiness:{update:"",trialInfo:{},caseDetail:{},clientInfo:{},caseContent:{},lawCaseInfo:{},caseMaterial:{otherMaterial:"",baseInfoMaterial:{}},caseDefendantList:[],casePlaintiffList:[],otherPartyInfoList:[]},originalOrderBusiness:{},trailLeval:[],update:!1,disabled:!1,texts:[],courtPage:{currentPage:1,start:1,limit:10},courts:[],orginClientContact:"",courtSearch:"",courtSelect:"",loading:!1,courtSelectPlaceholder:"请选择审理法院"}},computed:(0,o.default)({},(0,d.mapState)(["userId","transactionItem","orderStatus","orderStatusName"])),watch:{"orderBusiness.clientInfo.clientIsParty":function(){}},mounted:function(){var e=(0,l.default)(i.default.mark(function e(){var t,a;return i.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return this.getCourt(),this.getOrderBusiness(),e.next=4,this.refuse_code_tree_book_list({code:"QDS_BOTTOM_SHEET_TRAIL_LEVEL",type:1,level:1});case 4:return 200===(t=e.sent).code&&(this.trailLeval=t.data),e.next=8,this.refuse_code_tree_book_list({code:"SC_FLSC_CHANNEL",type:1,level:1});case 8:200===(a=e.sent).code&&(this.flscChannel=a.data);case 10:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}(),activated:function(){},created:function(){},beforeDestroy:function(){},methods:(0,o.default)({},(0,d.mapActions)("teamSettingModule",["get_area"]),(0,d.mapActions)("transactionModule",["get_order_business","edit_bottom_sheet","get_court_with_page"]),(0,d.mapActions)("receiveModule",["refuse_code_tree_book_list"]),{getOrderStatusSealName:function(){switch(this.transactionItem.orderStatus){case this.orderStatus.QDS_SC_ORDER_FINISH:return"已完结";case this.orderStatus.QDS_SC_ORDER_REFUND:return"已退单";default:return""}},getCourtSearch:function(e){this.courts=[],this.getCourt((0,o.default)({},this.courtPage,{courtName:e}))},getCourt:function(){var e=(0,l.default)(i.default.mark(function e(t){var a,s,n;return i.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t&&(this.courtPage=t),a=(0,o.default)({},this.courtPage),e.next=4,this.get_court_with_page(a);case 4:200===(s=e.sent).code&&(this.courts.pop(),(n=this.courts).push.apply(n,(0,r.default)(s.data.records)),s.data.totalCount!==this.courts.length&&this.courts.push({id:"all",courtName:"更多"}));case 6:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}(),getMoreCourt:function(){var e=(0,l.default)(i.default.mark(function e(t){var a=this;return i.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:"all"===t&&this.courtPage.start++&&this.getCourt(),"all"===t&&this.$nextTick(function(){a.courtSelect=""}),"all"!==t&&(this.courtSelectPlaceholder="请选择审理法院");case 3:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}(),getOrderBusiness:function(){var e=(0,l.default)(i.default.mark(function e(){var t,a;return i.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.get_order_business({id:this.transactionItem.id});case 2:if(200===(t=e.sent).code){for(a in this.orderBusiness=t.data.sheetData,this.orderBusiness.update="更新时间："+t.data.updateTime,0===this.orderBusiness.caseDefendantList.length&&this.orderBusiness.caseDefendantList.push({defendantName:"",defendantSexCode:"",defendantContact:"",defendantHaveIdCar:""}),0===this.orderBusiness.otherPartyInfoList.length&&this.orderBusiness.otherPartyInfoList.push({otherPartyName:"",otherPartySexCode:"",otherPartyContact:"",otherPartyHaveIdCar:""}),0===this.orderBusiness.casePlaintiffList.length&&this.orderBusiness.casePlaintiffList.push({plaintiffName:"",plaintiffSexCode:"",plaintiffContact:"",plaintiffHaveIdCar:""}),this.courtSelectPlaceholder=this.orderBusiness.trialInfo.trailCourt?this.orderBusiness.trialInfo.trailCourt:"请选择审理法院",this.courtSelect=this.orderBusiness.trialInfo.trailCourtId?this.orderBusiness.trialInfo.trailCourtId:"",this.flscChannelText=this.orderBusiness.lawCaseInfo.caseChannel,this.orderBusiness.caseMaterial.baseInfoMaterial)"1"===this.orderBusiness.caseMaterial.baseInfoMaterial[a]&&this.baseInfoMaterialList.push(this.baseInfoMaterialVal[a]);this.originalOrderBusiness=JSON.parse((0,n.default)(this.orderBusiness)),this.orderBusiness.lawCaseInfo.caseAreaName.length>0&&(this.caseVenueText=this.orderBusiness.lawCaseInfo.caseAreaName),this.orginClientContact=this.orderBusiness.clientInfo.clientContact}case 4:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}(),changeCaseVenueText:function(e){this.orderBusiness.lawCaseInfo.caseAreaCode=e.join(",");var t=this.$refs.caseArea.getCheckedNodes()[0],a=t.data.name;t.parent&&(a=t.parent.data.name+","+a),t.parent&&t.parent.parent&&(a=t.parent.parent.data.name+","+a),this.orderBusiness.lawCaseInfo.caseAreaName=a},edit:function(){var e=(0,l.default)(i.default.mark(function e(t){var a,r,o,l,d,c,f,p,g=this;return i.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if("cancelEdit"!==t){e.next=5;break}this.orderBusiness=JSON.parse((0,n.default)(this.originalOrderBusiness)),e.next=40;break;case 5:if("save"!==t){e.next=40;break}if(!this.orderBusiness.clientInfo||!(0,s.default)(this.orderBusiness.clientInfo).length){e.next=15;break}if(this.orderBusiness.clientInfo.clientName){e.next=10;break}return u.default.error({message:"请输入委托人姓名"}),e.abrupt("return");case 10:if(/^0?(13|14|15|16|17|18|19)[0-9]{9}$/i.test(this.orderBusiness.clientInfo.clientContact)||this.orderBusiness.clientInfo.clientContact===this.orginClientContact){e.next=13;break}return u.default.error({message:"请输入委托人联系方式"}),e.abrupt("return");case 13:e.next=17;break;case 15:return u.default.error({message:"请输入委托人信息"}),e.abrupt("return");case 17:for(d in this.orderBusiness.caseDefendantList=this.orderBusiness.caseDefendantList.filter(function(e){return e.defendantName||e.defendantContact}),this.orderBusiness.casePlaintiffList=this.orderBusiness.casePlaintiffList.filter(function(e){return e.plaintiffName||e.plaintiffContact}),this.orderBusiness.otherPartyInfoList=this.orderBusiness.otherPartyInfoList.filter(function(e){return e.otherPartyName||e.otherPartyContact}),a=this.orderBusiness,r=a.caseMaterial,o=a.lawCaseInfo,l=a.trialInfo,r.baseInfoMaterial)this.baseInfoMaterialList.includes(this.baseInfoMaterialVal[d])?r.baseInfoMaterial[d]="1":r.baseInfoMaterial[d]="0";return o.caseChannel=this.flscChannelText,(c=this.flscChannel.filter(function(e){return e.code===g.flscChannelText})).length&&c[0].name&&(o.caseChannelName=c[0].name),this.courtSelect&&(l.trailCourtId=this.courtSelect),f=JSON.parse((0,n.default)(this.orderBusiness.otherPartyInfoList)),this.orderBusiness.otherPartyInfoList=[],f.forEach(function(e){e.otherPartyName&&g.orderBusiness.otherPartyInfoList.push(e)}),!this.orderBusiness.otherPartyInfoList.length&&this.orderBusiness.otherPartyInfoList.push([]),p={id:this.transactionItem.id,sheetData:(0,n.default)(this.orderBusiness)},e.next=34,this.edit_bottom_sheet(p);case 34:if(200!==e.sent.code){e.next=39;break}this.getOrderBusiness(),e.next=40;break;case 39:return e.abrupt("return");case 40:this.update=!this.update,this.disabled=!this.disabled;case 42:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}(),addDSR:function(){this.orderBusiness.otherPartyInfoList.push({otherPartyName:"",otherPartySexCode:"",otherPartyContact:"",otherPartyHaveIdCar:""})},removeDSR:function(e){this.orderBusiness.otherPartyInfoList.splice(e,1)},addPlaintiff:function(){this.orderBusiness.casePlaintiffList.push({plaintiffName:"",plaintiffSexCode:"",plaintiffContact:"",plaintiffHaveIdCar:""})},removePlaintiff:function(e){this.orderBusiness.casePlaintiffList.splice(e,1)},addAccused:function(){this.orderBusiness.caseDefendantList.push({defendantName:"",defendantSexCode:"1",defendantContact:"",defendantHaveIdCar:1})},removeaAccused:function(e){this.orderBusiness.caseDefendantList.splice(e,1)}})}},"1bz1":function(e,t,a){"use strict";var s=a("dZqw");a.n(s).a},RNEU:function(e,t,a){"use strict";a.r(t);var s=a("bJak"),n=a("vFI9");for(var r in n)"default"!==r&&function(e){a.d(t,e,function(){return n[e]})}(r);a("1bz1");var o=a("ZrdR"),i=Object(o.a)(n.default,s.a,s.b,!1,null,null,null);i.options.__file="billComponent.vue",t.default=i.exports},bJak:function(e,t,a){"use strict";var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("div",{staticClass:"billComponent"},[a("dgg-form",{staticClass:"demo-ruleForm",attrs:{model:e.orderBusiness,"labdgg-width":"100px",rules:e.rules}},[a("div",{staticClass:"form-top"},[a("div",{staticClass:"time-left"},[a("dgg-icon",{attrs:{slot:"icon","svg-width":"14px","svg-height":"14px","icon-class":"dgg_time"},slot:"icon"}),e._v(" "),a("span",{domProps:{innerHTML:e._s(e.orderBusiness.update)}})],1),e._v(" "),a("div",{staticClass:"dggBtn"},[e.update?a("dgg-button",{attrs:{type:"primary","dgg-icon":"dgg_save"},on:{click:function(t){return e.edit("save")}}},[e._v("保存")]):e._e(),e._v(" "),e.update?a("dgg-button",{attrs:{type:"primary","dgg-icon":"dgg_save"},on:{click:function(t){return e.edit("cancelEdit")}}},[e._v("取消")]):e._e(),e._v(" "),e.getOrderStatusSealName()||e.update?e._e():a("dgg-button",{attrs:{type:"primary","dgg-icon":"dgg_edit"},on:{click:function(t){return e.edit()}}},[e._v("编辑")])],1)]),e._v(" "),a("div",{staticClass:"form-content"},[a("div",{staticClass:"content"},[a("h3",[e._v("案件信息")]),e._v(" "),a("dgg-row",[a("dgg-col",{attrs:{span:20}},[a("dgg-form-item",{attrs:{label:"签单时间：",prop:"signTime"}},[a("span",{domProps:{innerHTML:e._s(e.orderBusiness.lawCaseInfo.signTime)}})])],1),e._v(" "),a("dgg-col",{attrs:{span:20}},[a("dgg-form-item",{attrs:{label:"案件类型：",prop:"caseTypeName"}},[a("span",{domProps:{innerHTML:e._s(e.orderBusiness.lawCaseInfo.caseTypeName?e.orderBusiness.lawCaseInfo.caseTypeName:"无")}})])],1),e._v(" "),e._e()],1),e._v(" "),a("dgg-row",[a("dgg-col",{attrs:{span:20}},[a("dgg-form-item",{attrs:{label:"案件管辖地：",prop:"caseVenue"}},[e.update?a("el-cascader",{ref:"caseArea",attrs:{props:e.props,placeholder:e.caseVenueText},on:{change:e.changeCaseVenueText}}):a("span",{domProps:{innerHTML:e._s(e.orderBusiness.lawCaseInfo.caseAreaName?e.orderBusiness.lawCaseInfo.caseAreaName:"无")}})],1)],1),e._v(" "),a("dgg-col",{attrs:{span:20}},[a("dgg-form-item",{attrs:{label:"详细地址：",prop:"caseAreaAddress"}},[e.update?a("dgg-input",{model:{value:e.orderBusiness.lawCaseInfo.caseAreaAddress,callback:function(t){e.$set(e.orderBusiness.lawCaseInfo,"caseAreaAddress",t)},expression:"orderBusiness.lawCaseInfo.caseAreaAddress"}}):a("span",{domProps:{innerHTML:e._s(e.orderBusiness.lawCaseInfo.caseAreaAddress?e.orderBusiness.lawCaseInfo.caseAreaAddress:"无")}})],1)],1)],1)],1),e._v(" "),a("div",{staticClass:"content"},[a("h3",[e._v("审理信息")]),e._v(" "),a("dgg-row",[a("dgg-col",{attrs:{span:20}},[a("dgg-form-item",{attrs:{label:"案号：",prop:"caseNo"}},[e.update?a("dgg-input",{model:{value:e.orderBusiness.trialInfo.caseNo,callback:function(t){e.$set(e.orderBusiness.trialInfo,"caseNo",t)},expression:"orderBusiness.trialInfo.caseNo"}}):a("span",{domProps:{innerHTML:e._s(e.orderBusiness.trialInfo.caseNo?e.orderBusiness.trialInfo.caseNo:"无")}})],1)],1),e._v(" "),a("dgg-col",{attrs:{span:20}},[a("dgg-form-item",{attrs:{label:"审理法院：",prop:"trailCourt"}},[e.update?a("el-select",{attrs:{filterable:"",remote:"","reserve-keyword":"",placeholder:e.courtSelectPlaceholder,"remote-method":e.getCourtSearch,loading:e.loading},on:{change:e.getMoreCourt},model:{value:e.courtSelect,callback:function(t){e.courtSelect=t},expression:"courtSelect"}},e._l(e.courts,function(e){return a("el-option",{key:e.id,attrs:{label:e.courtName,value:e.id}})}),1):a("span",{domProps:{innerHTML:e._s(e.orderBusiness.trialInfo.trailCourt?e.orderBusiness.trialInfo.trailCourt:"无")}})],1)],1),e._v(" "),a("dgg-col",{attrs:{span:20}},[a("dgg-form-item",{attrs:{label:"联系方式：",prop:"trailContact"}},[e.update?a("dgg-input",{attrs:{maxlength:11},on:{input:function(t){e.orderBusiness.trialInfo.trailContact=e.orderBusiness.trialInfo.trailContact.replace(/[^\d]/g,"")}},model:{value:e.orderBusiness.trialInfo.trailContact,callback:function(t){e.$set(e.orderBusiness.trialInfo,"trailContact",t)},expression:"orderBusiness.trialInfo.trailContact"}}):a("span",{domProps:{innerHTML:e._s(e.orderBusiness.trialInfo.trailContact?e.orderBusiness.trialInfo.trailContact:"无")}})],1)],1)],1),e._v(" "),a("dgg-row",[a("dgg-col",{attrs:{span:20}},[a("dgg-form-item",{attrs:{label:"审理级别：",prop:"trailLevalName"}},[e.update?a("el-select",{attrs:{placeholder:"请选择"},model:{value:e.orderBusiness.trialInfo.trailLevalCode,callback:function(t){e.$set(e.orderBusiness.trialInfo,"trailLevalCode",t)},expression:"orderBusiness.trialInfo.trailLevalCode"}},e._l(e.trailLeval,function(e){return a("el-option",{key:e.code,attrs:{label:e.name,value:e.code}})}),1):a("span",{domProps:{innerHTML:e._s(e.orderBusiness.trialInfo.trailLevalName?e.orderBusiness.trialInfo.trailLevalName:"无")}})],1)],1),e._v(" "),a("dgg-col",{attrs:{span:20}},[a("dgg-form-item",{attrs:{label:"承办法官：",prop:"undertookJudge"}},[e.update?a("dgg-input",{model:{value:e.orderBusiness.trialInfo.undertookJudge,callback:function(t){e.$set(e.orderBusiness.trialInfo,"undertookJudge",t)},expression:"orderBusiness.trialInfo.undertookJudge"}}):a("span",{domProps:{innerHTML:e._s(e.orderBusiness.trialInfo.undertookJudge?e.orderBusiness.trialInfo.undertookJudge:"无")}})],1)],1)],1)],1),e._v(" "),a("div",{staticClass:"content"},[a("h3",[e._v("委托人信息")]),e._v(" "),a("dgg-row",[a("dgg-col",{attrs:{span:20}},[a("dgg-form-item",{attrs:{label:"姓名：",prop:"clientInfo.clientName"}},[e.update?a("dgg-input",{model:{value:e.orderBusiness.clientInfo.clientName,callback:function(t){e.$set(e.orderBusiness.clientInfo,"clientName",t)},expression:"orderBusiness.clientInfo.clientName"}}):a("span",{domProps:{innerHTML:e._s(e.orderBusiness.clientInfo.clientName?e.orderBusiness.clientInfo.clientName:"无")}})],1)],1),e._v(" "),a("dgg-col",{attrs:{span:20}},[a("dgg-form-item",{attrs:{label:"联系电话：",prop:"clientInfo.clientContact"}},[e.update?a("dgg-input",{attrs:{maxlength:11},on:{input:function(t){e.orderBusiness.clientInfo.clientContact=e.orderBusiness.clientInfo.clientContact.replace(/[^\d]/g,"")}},model:{value:e.orderBusiness.clientInfo.clientContact,callback:function(t){e.$set(e.orderBusiness.clientInfo,"clientContact",t)},expression:"orderBusiness.clientInfo.clientContact"}}):a("span",{domProps:{innerHTML:e._s(e.orderBusiness.clientInfo.clientContact?e.orderBusiness.clientInfo.clientContact:"无")}})],1)],1),e._v(" "),a("dgg-col",{attrs:{span:20}},[a("dgg-form-item",{attrs:{label:"有无身份证：",prop:"clientHaveIdCard"}},[e.update?a("dgg-select",{attrs:{placeholder:"请选择"},model:{value:e.orderBusiness.clientInfo.clientHaveIdCard,callback:function(t){e.$set(e.orderBusiness.clientInfo,"clientHaveIdCard",t)},expression:"orderBusiness.clientInfo.clientHaveIdCard"}},[a("dgg-option",{attrs:{label:"有",value:"1"}}),e._v(" "),a("dgg-option",{attrs:{label:"无",value:"0"}})],1):a("span",{domProps:{innerHTML:e._s(1==e.orderBusiness.clientInfo.clientHaveIdCard?"有":"无")}})],1)],1)],1),e._v(" "),a("dgg-row",[a("dgg-col",{attrs:{span:20}},[a("dgg-form-item",{attrs:{label:"性别：",prop:"clientSexCode"}},[e.update?a("dgg-select",{attrs:{placeholder:"请选择"},model:{value:e.orderBusiness.clientInfo.clientSexCode,callback:function(t){e.$set(e.orderBusiness.clientInfo,"clientSexCode",t)},expression:"orderBusiness.clientInfo.clientSexCode"}},[a("dgg-option",{attrs:{label:"男",value:"1"}}),e._v(" "),a("dgg-option",{attrs:{label:"女",value:"0"}})],1):a("span",{domProps:{innerHTML:e._s(1==e.orderBusiness.clientInfo.clientSexCode?"男":"女")}})],1)],1),e._v(" "),a("dgg-col",{attrs:{span:20}},[a("dgg-form-item",{attrs:{label:"是否为当事人：",prop:"clientIsParty"}},[e.update?a("dgg-select",{attrs:{placeholder:"请选择"},model:{value:e.orderBusiness.clientInfo.clientIsParty,callback:function(t){e.$set(e.orderBusiness.clientInfo,"clientIsParty",t)},expression:"orderBusiness.clientInfo.clientIsParty"}},[a("dgg-option",{attrs:{label:"是",value:"1"}}),e._v(" "),a("dgg-option",{attrs:{label:"否",value:"0"}})],1):a("span",{domProps:{innerHTML:e._s(1==e.orderBusiness.clientInfo.clientIsParty?"是":"否")}})],1)],1)],1)],1),e._v(" "),1==e.orderBusiness.clientInfo.clientIsParty?a("div",e._l(e.orderBusiness.otherPartyInfoList,function(t,s){return a("div",{key:s,staticClass:"content"},[a("h3",[e._v("对方当事人\n              "),e.update?a("span",{class:0!==s?"contern-add-btn":"",on:{click:function(t){0==s?e.addDSR():e.removeDSR(s)}}},[a("dgg-icon",{attrs:{"icon-class":"icon_append","svg-width":"13px","svg-height":"13px"}}),e._v("\n              "+e._s(0==s?"增加":"删除")+"\n            ")],1):e._e()]),e._v(" "),a("dgg-row",[a("dgg-col",{attrs:{span:20}},[a("dgg-form-item",{attrs:{label:"姓名：",prop:"sideName"}},[e.update?a("dgg-input",{model:{value:t.otherPartyName,callback:function(a){e.$set(t,"otherPartyName",a)},expression:"item.otherPartyName"}}):a("span",{domProps:{innerHTML:e._s(t.otherPartyName?t.otherPartyName:"无")}})],1)],1),e._v(" "),a("dgg-col",{attrs:{span:20}},[a("dgg-form-item",{attrs:{label:"联系电话：",prop:"sidePhone"}},[e.update?a("dgg-input",{attrs:{maxlength:11},on:{input:function(e){t.otherPartyContact=t.otherPartyContact.replace(/[^\d]/g,"")}},model:{value:t.otherPartyContact,callback:function(a){e.$set(t,"otherPartyContact",a)},expression:"item.otherPartyContact"}}):a("span",{domProps:{innerHTML:e._s(t.otherPartyContact?t.otherPartyContact:"无")}})],1)],1),e._v(" "),a("dgg-col",{attrs:{span:20}},[a("dgg-form-item",{attrs:{label:"性别：",prop:"sideSex"}},[e.update?a("dgg-select",{attrs:{placeholder:"请选择"},model:{value:t.otherPartySexCode,callback:function(a){e.$set(t,"otherPartySexCode",a)},expression:"item.otherPartySexCode"}},[a("dgg-option",{attrs:{label:"男",value:"1"}}),e._v(" "),a("dgg-option",{attrs:{label:"女",value:"0"}})],1):a("span",{domProps:{innerHTML:e._s(1==t.otherPartySexCode?"男":"女")}})],1)],1)],1),e._v(" "),a("dgg-row",[a("dgg-col",{attrs:{span:20}},[a("dgg-form-item",{attrs:{label:"有无身份证：",prop:"card"}},[e.update?a("dgg-select",{attrs:{placeholder:"请选择"},model:{value:t.otherPartyHaveIdCard,callback:function(a){e.$set(t,"otherPartyHaveIdCard",a)},expression:"item.otherPartyHaveIdCard"}},[a("dgg-option",{attrs:{label:"有",value:"1"}}),e._v(" "),a("dgg-option",{attrs:{label:"无",value:"0"}})],1):a("span",{domProps:{innerHTML:e._s(1==t.otherPartyHaveIdCard?"有":"无")}})],1)],1)],1)],1)}),0):e._e(),e._v(" "),0==e.orderBusiness.clientInfo.clientIsParty?a("div",[e._l(e.orderBusiness.casePlaintiffList,function(t,s){return a("div",{key:s,staticClass:"content"},[a("h3",[e._v("案件原告\n              "),e.update?a("span",{class:0!==s?"contern-add-btn":"",on:{click:function(t){0==s?e.addPlaintiff():e.removePlaintiff(s)}}},[a("dgg-icon",{attrs:{"icon-class":"icon_append","svg-width":"13px","svg-height":"13px"}}),e._v("\n              "+e._s(0==s?"增加":"删除")+"\n            ")],1):e._e()]),e._v(" "),a("dgg-row",[a("dgg-col",{attrs:{span:20}},[a("dgg-form-item",{attrs:{label:"姓名：",prop:"sideName"}},[e.update?a("dgg-input",{model:{value:t.plaintiffName,callback:function(a){e.$set(t,"plaintiffName",a)},expression:"item.plaintiffName"}}):a("span",{domProps:{innerHTML:e._s(t.plaintiffName?t.plaintiffName:"无")}})],1)],1),e._v(" "),a("dgg-col",{attrs:{span:20}},[a("dgg-form-item",{attrs:{label:"性别：",prop:"sideSex"}},[e.update?a("dgg-select",{attrs:{placeholder:"请选择"},model:{value:t.plaintiffSexCode,callback:function(a){e.$set(t,"plaintiffSexCode",a)},expression:"item.plaintiffSexCode"}},[a("dgg-option",{attrs:{label:"男",value:"1"}}),e._v(" "),a("dgg-option",{attrs:{label:"女",value:"0"}})],1):a("span",{domProps:{innerHTML:e._s(t.plaintiffSex)}})],1)],1),e._v(" "),a("dgg-col",{attrs:{span:20}},[a("dgg-form-item",{attrs:{label:"联系电话：",prop:"sidePhone"}},[e.update?a("dgg-input",{attrs:{maxlength:11},on:{input:function(e){t.plaintiffContact=t.plaintiffContact.replace(/[^\d]/g,"")}},model:{value:t.plaintiffContact,callback:function(a){e.$set(t,"plaintiffContact",a)},expression:"item.plaintiffContact"}}):a("span",{domProps:{innerHTML:e._s(t.plaintiffContact?t.plaintiffContact:"无")}})],1)],1)],1),e._v(" "),a("dgg-row",[a("dgg-col",{attrs:{span:20}},[a("dgg-form-item",{attrs:{label:"有无身份证：",prop:"card"}},[e.update?a("dgg-select",{attrs:{placeholder:"请选择"},model:{value:t.plaintiffHaveIdCard,callback:function(a){e.$set(t,"plaintiffHaveIdCard",a)},expression:"item.plaintiffHaveIdCard"}},[a("dgg-option",{attrs:{label:"有",value:"1"}}),e._v(" "),a("dgg-option",{attrs:{label:"无",value:"0"}})],1):a("span",{domProps:{innerHTML:e._s(t.plaintiffHaveIdCardStr)}})],1)],1)],1)],1)}),e._v(" "),e._l(e.orderBusiness.caseDefendantList,function(t,s){return a("div",{key:s,staticClass:"content"},[a("h3",[e._v("案件被告\n              "),e.update?a("span",{class:0!==s?"contern-add-btn":"",on:{click:function(t){0==s?e.addAccused():e.removeaAccused(s)}}},[a("dgg-icon",{attrs:{"icon-class":"icon_append","svg-width":"13px","svg-height":"13px"}}),e._v("\n              "+e._s(0==s?"增加":"删除")+"\n            ")],1):e._e()]),e._v(" "),a("dgg-row",[a("dgg-col",{attrs:{span:20}},[a("dgg-form-item",{attrs:{label:"姓名：",prop:"sideName"}},[e.update?a("dgg-input",{model:{value:t.defendantName,callback:function(a){e.$set(t,"defendantName",a)},expression:"item.defendantName"}}):a("span",{domProps:{innerHTML:e._s(t.defendantName?t.defendantName:"无")}})],1)],1),e._v(" "),a("dgg-col",{attrs:{span:20}},[a("dgg-form-item",{attrs:{label:"性别：",prop:"sideSex"}},[e.update?a("dgg-select",{attrs:{placeholder:"请选择"},model:{value:t.defendantSexCode,callback:function(a){e.$set(t,"defendantSexCode",a)},expression:"item.defendantSexCode"}},[a("dgg-option",{attrs:{label:"男",value:"1"}}),e._v(" "),a("dgg-option",{attrs:{label:"女",value:"0"}})],1):a("span",{domProps:{innerHTML:e._s(t.defendantSex)}})],1)],1),e._v(" "),a("dgg-col",{attrs:{span:20}},[a("dgg-form-item",{attrs:{label:"联系电话：",prop:"sidePhone"}},[e.update?a("dgg-input",{attrs:{maxlength:11},on:{input:function(e){t.defendantContact=t.defendantContact.replace(/[^\d]/g,"")}},model:{value:t.defendantContact,callback:function(a){e.$set(t,"defendantContact",a)},expression:"item.defendantContact"}}):a("span",{domProps:{innerHTML:e._s(t.defendantContact?t.defendantContact:"无")}})],1)],1)],1),e._v(" "),a("dgg-row",[a("dgg-col",{attrs:{span:20}},[a("dgg-form-item",{attrs:{label:"有无身份证：",prop:"card"}},[e.update?a("dgg-select",{attrs:{placeholder:"请选择"},model:{value:t.defendantHaveIdCard,callback:function(a){e.$set(t,"defendantHaveIdCard",a)},expression:"item.defendantHaveIdCard"}},[a("dgg-option",{attrs:{label:"有",value:"1"}}),e._v(" "),a("dgg-option",{attrs:{label:"无",value:"0"}})],1):a("span",{domProps:{innerHTML:e._s(t.defendantHaveIdCardStr)}})],1)],1)],1)],1)})],2):e._e(),e._v(" "),a("div",{staticClass:"content textarea-content"},[a("h3",[e._v("案件详情")]),e._v(" "),a("dgg-row",[a("dgg-col",{attrs:{span:24}},[a("dgg-form-item",{attrs:{label:"基本信息：",prop:"caseDetail"}},[e.update?a("dgg-input",{attrs:{type:"textarea",resize:"none",rows:5},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.$root.onEnter(t)}},model:{value:e.orderBusiness.caseDetail.baseInfo,callback:function(t){e.$set(e.orderBusiness.caseDetail,"baseInfo",t)},expression:"orderBusiness.caseDetail.baseInfo"}}):a("span",{domProps:{innerHTML:e._s(e.orderBusiness.caseDetail.baseInfo?e.orderBusiness.caseDetail.baseInfo:"无")}})],1)],1)],1)],1),e._v(" "),a("div",{staticClass:"content textarea-content"},[a("h3",[e._v("案件内容")]),e._v(" "),a("dgg-row",[a("dgg-col",{attrs:{span:24}},[a("dgg-form-item",{attrs:{label:"当事人诉求：",prop:"clientAppeal"}},[e.update?a("dgg-input",{attrs:{type:"textarea",resize:"none",rows:5},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.$root.onEnter(t)}},model:{value:e.orderBusiness.caseContent.clientAppeal,callback:function(t){e.$set(e.orderBusiness.caseContent,"clientAppeal",t)},expression:"orderBusiness.caseContent.clientAppeal"}}):a("span",{domProps:{innerHTML:e._s(e.orderBusiness.caseContent.clientAppeal?e.orderBusiness.caseContent.clientAppeal:"无")}})],1)],1),e._v(" "),a("dgg-col",{attrs:{span:24}},[a("dgg-form-item",{attrs:{label:"面谈时给予方案：",prop:"interviewPlan"}},[e.update?a("dgg-input",{attrs:{type:"textarea",resize:"none",rows:5},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.$root.onEnter(t)}},model:{value:e.orderBusiness.caseContent.interviewPlan,callback:function(t){e.$set(e.orderBusiness.caseContent,"interviewPlan",t)},expression:"orderBusiness.caseContent.interviewPlan"}}):a("span",{domProps:{innerHTML:e._s(e.orderBusiness.caseContent.interviewPlan?e.orderBusiness.caseContent.interviewPlan:"无")}})],1)],1)],1)],1),e._v(" "),a("div",{staticClass:"content textarea-content"},[a("h3",[e._v("案件材料")]),e._v(" "),a("dgg-row",[a("dgg-col",{attrs:{span:24}},[a("dgg-form-item",{attrs:{label:"基础信息材料：",prop:"type"}},[a("dgg-checkbox-group",{model:{value:e.baseInfoMaterialList,callback:function(t){e.baseInfoMaterialList=t},expression:"baseInfoMaterialList"}},[1==e.orderBusiness.clientInfo.clientIsParty?a("dgg-checkbox",{attrs:{disabled:!e.update,label:"对方身份证信息",value:"otherPartyIdCard"}}):e._e(),e._v(" "),a("dgg-checkbox",{attrs:{disabled:!e.update,label:"地址",value:"address"}}),e._v(" "),a("dgg-checkbox",{attrs:{disabled:!e.update,label:"电话",value:"phoneNumber"}}),e._v(" "),a("dgg-checkbox",{attrs:{disabled:!e.update,label:"身份证复印件",value:"clientIdCard"}}),e._v(" "),a("dgg-checkbox",{attrs:{disabled:!e.update,label:"户口本",value:"householdRegister"}}),e._v(" "),1!=e.orderBusiness.clientInfo.clientIsParty?a("dgg-checkbox",{attrs:{disabled:!e.update,label:"原告身份信息",value:"plaintiffIdCard"}}):e._e(),e._v(" "),1!=e.orderBusiness.clientInfo.clientIsParty?a("dgg-checkbox",{attrs:{disabled:!e.update,label:"被告身份信息",value:"defendantIdCard"}}):e._e()],1)],1)],1),e._v(" "),a("dgg-col",{attrs:{span:24}},[a("dgg-form-item",{attrs:{label:"其他资料：",prop:"otherData"}},[e.update?a("dgg-input",{attrs:{resize:"none",rows:3,type:"textarea"},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.$root.onEnter(t)}},model:{value:e.orderBusiness.caseMaterial.otherMaterial,callback:function(t){e.$set(e.orderBusiness.caseMaterial,"otherMaterial",t)},expression:"orderBusiness.caseMaterial.otherMaterial"}}):a("span",{domProps:{innerHTML:e._s(e.orderBusiness.caseMaterial.otherMaterial?e.orderBusiness.caseMaterial.otherMaterial:"无")}})],1)],1)],1)],1)])]),e._v(" "),e.getOrderStatusSealName()?a("div",{staticClass:"finishImg",class:{"back-order-seal-active":"已退单"==e.getOrderStatusSealName()},attrs:{fit:"cover"}},[a("p",{staticClass:"finishImg-title"},[e._v(e._s(e.getOrderStatusSealName()))]),e._v(" "),a("p",{staticClass:"finishImg-time"},[e._v(e._s(e._f("timeFilter")(e.transactionItem.endTime,"YYYY.MM.DD")))])]):e._e()],1),e._v(" "),a("orderStatusIconComponents",{attrs:{storeTransactionItem:e.transactionItem}})],1)},n=[];a.d(t,"a",function(){return s}),a.d(t,"b",function(){return n})},dZqw:function(e,t,a){},vFI9:function(e,t,a){"use strict";a.r(t);var s=a("17/p"),n=a.n(s);for(var r in s)"default"!==r&&function(e){a.d(t,e,function(){return s[e]})}(r);t.default=n.a}}]);