<template>
  <div class="dgg-drop-warp" :class="{'is-focus':isFocus,'is-multiple':isMultiple,'is-disabled':isDisbled}"
       v-Clickoutside="closeFun" ref="warpBox">
    <span class="dgg-input-warp" @click="expandFun" ref="warp">
      <div class="multiple-tag" v-if="multiple">
        <em class="placeholder" v-show="isPlaceholder">{{placeholder}}</em>
       <span v-for="(item, index) in saveData" :key="item.id">
         {{item.name}}
         <em class="el-icon-close" @click.stop="del(item, index)"></em>
       </span>
      </div>
     <input type="text" :name="name" :placeholder="placeholder" ref="input" v-model="text" readonly>
      <i></i>
       <a href="javascript:void(0)" class="dgg-tree-clear el-icon-error" v-if="!disabled" @click.stop="clearFun"></a>
    </span>
    <div class="dgg-drop-expand" :class="{'is-search':isSearch}" ref="drop">
      <span class="search" v-if="search"><input type="text" placeholder="关键词" ref="searchInput"
                                                v-model="searchVal"></span>
      <dgg-tree :id="id" v-bind="$attrs" v-show="hasData" :callback="callback"
                :check="check">
      </dgg-tree>
      <div class="dgg-no-data" v-show="!hasData">{{noData}}</div>
    </div>
  </div>
</template>

<script>
  import Clickoutside from '@/componentsEl/src/utils/clickoutside';
  import lodash from 'lodash'

  export default {
    name: 'dgg-dropztree',
    data() {
      return {
        focued: false,
        searchVal: '',
        text: '',
        hasData: true,
        saveData: [],
        isPlaceholder: true,
        check: {},
        callback: {
          onClick: (event, treeId, treeNode) => {
            let multiple = this.multiple;
            var treeObj = $.fn.zTree.getZTreeObj(treeId);
            if (multiple) {
              if (!treeNode.checked) {
                this.saveData.unshift(treeNode);
              } else {
                this.delData(treeNode);
              }
            } else {
              this.saveData = [];
              this.saveData.unshift(treeNode);
              this.focued = false;
            }
          },
          onCheck: (event, treeId, treeNode) => {
            if (treeNode.checked) {
              this.saveData.unshift(treeNode);
            } else {
              this.delData(treeNode);
            }
          },
          onAsyncSuccess: (event, treeId, treeNode, msg) => {
            this._echoFun();
          }
        }
      }
    },
    props: {
      id: String,
      search: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      width: {
        type: String,
        default: '240px'
      },
      name: String,
      value: {
        type: Array,
        default: []
      },
      placeholder: {
        type: String,
        default: '请选择'
      },
      noData: {
        type: String,
        default: '暂无数据'
      },
      multiple: {
        type: Boolean,
        default: false
      }
    },
    model: {
      prop: 'value',
      event: 'input'
    },
    directives: { Clickoutside },
    methods: {
      expandFun() {
        if (this.disabled) {
          return false;
        }
        this.focued = !this.focued;
        var _this = this;
        this.$nextTick(function() {
          if (_this.focued && _this.search) {
            _this.$refs.searchInput.focus();
          }
        })
      },
      closeFun() {
        this.focued = false;
      },
      delData(treeNode) {
        let delIndex = 0,
          saveData = this.saveData;
        for (var i in saveData) {
          if (saveData[i].id == treeNode.id) {
            delIndex = i;
            break;
          }
        }
        saveData.splice(delIndex, 1);
      },
      del(item, index) {
        var treeObj = $.fn.zTree.getZTreeObj(this.id);
        treeObj.checkNode(item, false, true);
        this.saveData.splice(index, 1);
      },
      //清除选中值
      clearFun() {
        this.saveData = [];
      },
      //单选多选回显
      _echoFun() {
        if (this.multiple) {
          this.saveData = this.value;
          //多选树的回显
          if (this.multiple && this.value.length != 0) {
            var treeObj = $.fn.zTree.getZTreeObj(this.id);
            for (var i in this.value) {
              var node = treeObj.getNodesByParam('id', this.value[i].id, null);
              treeObj.checkNode(node[0], true, true);
              this.value[i] = node[0];
            }
          }
        } else {
          //单选回显
          var getVal = this.value;
          var txt = '';
          for (var i in getVal) {
            (i == 0) && (txt += getVal[i].name);
            (i != 0) && (txt += ',' + getVal[i].name);
          }
          this.text = txt;
        }
      }
    },
    computed: {
      isFocus() {
        return this.focued;
      },
      isMultiple() {
        if (this.multiple) {
          this.check = {
            enable: true,
            chkboxType: { 'Y': '', 'N': '' }
          }
        }
        return this.multiple;
      },
      isSearch() {
        return this.search;
      },
      isDisbled() {
        return this.disabled;
      }
    },
    mounted() {
      this.$refs.warpBox.style.width = this.width;
    },
    watch: {
      searchVal(val) {
        var treeObj = $.fn.zTree.getZTreeObj(this.id);
        treeObj.cancelSelectedNode();
        if (this.searchVal == '') {
          this.hasData = true;
          return false;
        }
        var nodes = treeObj.getNodesByParamFuzzy('name', this.searchVal);
        treeObj.cancelSelectedNode();
        if (nodes.length == 0 && this.searchVal != '') {
          this.hasData = false;
          return false;
        }
        for (var i = 0; i < nodes.length; i++) {
          treeObj.selectNode(nodes[i], true, false);
        }
        this.$refs.searchInput.focus();
        this.hasData = true;
      },
      saveData(val) {
        (val.length != 0) && (this.isPlaceholder = false);
        (val.length == 0) && (this.isPlaceholder = true);
        this.$emit('select', this.saveData);
        this.$emit('input', this.saveData);
        if (!this.multiple) {
          (val.length == 0) && (this.text = '');
          (val.length != 0) && (this.text = val[0].name);
        } else {
          var treeObj = $.fn.zTree.getZTreeObj(this.id);
          treeObj.checkAllNodes(false);
          for (var i in val) {
            treeObj.cancelSelectedNode(val[i]);
            treeObj.checkNode(val[i], true, true);
          }
        }
        this.$nextTick(function() {
          var warpHei = parseInt(window.getComputedStyle(this.$refs.warp).height);
          this.$refs.drop.style.top = warpHei + 4 + 'px';
        })
      }
    }
  }
</script>

<style lang="less">
  @import (reference) "~assets/less/preset.less";

  /*.demo-block .demo-block-control {*/
  /*  position: static;*/
  /*}*/

  .dgg-drop-expand {
    display: none;
  }

  .dgg-drop-warp {
    &.is-multiple {
      .dgg-input-warp {
        width: 100%;

        input {
          display: none;
        }
      }
    }

    &.is-focus {
      .dgg-drop-expand {
        display: block;
      }

      .dgg-input-warp {
        border-color: @main;
      }
    }

    &.is-disabled {
      .dgg-input-warp {
        background-color: @neutral-base;
        cursor: not-allowed;

        input {
          cursor: not-allowed;
          background-color: @neutral-base;
        }
      }
    }
  }

  .dgg-drop-warp,
  .dgg-input-warp {
    position: relative;
    display: inline-block;
    vertical-align: middle;

    .placeholder {
      display: block;
      padding: 0 12px;
      line-height: 22px;
      font-size: 10px;
      color: @neutral-placeholder;
      font-style: normal;
    }

    &:hover {
      .dgg-tree-clear {
        display: block;
      }
    }
  }

  .dgg-input-warp {
    border: 1px @neutral-bg solid;
    border-radius: 2px;
    background-color: #fff;
    min-height: 26px;

    input {
      padding: 0 12px;
      box-sizing: border-box;
      width: 240px;
      line-height: 28px;
      font-size: 12px;
      border: 0;

      &::-webkit-input-placeholder { /* Chrome/Opera/Safari */
        color: @neutral-placeholder;
      }

      &::-moz-placeholder { /* Firefox 19+ */
        color: @neutral-placeholder;
      }

      &:-ms-input-placeholder { /* IE 10+ */
        color: @neutral-placeholder;
      }

      &:-moz-placeholder { /* Firefox 18- */
        color: @neutral-placeholder;
      }

      & + i {
        position: absolute;
        right: 11px;
        top: 50%;
        margin-top: -3px;
        display: block;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 6px 4px 0 4px;
        border-color: @neutral-help transparent transparent transparent;

        &:before {
          content: '';
          display: block;
          position: absolute;
          top: -8px;
          left: -4px;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 6px 4px 0 4px;
          border-color: #fff transparent transparent transparent;
        }
      }
    }
  }

  .dgg-drop-expand {
    position: absolute;
    border: 1px rgba(0, 0, 0, .15) solid;
    top: 32px;
    left: 0;
    right: 0;
    padding: 8px;
    background-color: #fff;
    overflow: auto;
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
    z-index: 999999;

    &.is-search {
      padding-top: 35px;
    }

    .search {
      position: absolute;
      left: 8px;
      right: 8px;
      top: 8px;
    }

    input {
      width: 100%;
      line-height: 24px;
      height: 24px;
      padding: 0 8px;
      box-sizing: border-box;
      border: 1px @neutral-bg solid;
      font-size: 12px;
      border-radius: 2px;

      &::-webkit-input-placeholder { /* Chrome/Opera/Safari */
        color: @neutral-placeholder;
      }

      &::-moz-placeholder { /* Firefox 19+ */
        color: @neutral-placeholder;
      }

      &:-ms-input-placeholder { /* IE 10+ */
        color: @neutral-placeholder;
      }

      &:-moz-placeholder { /* Firefox 18- */
        color: @neutral-placeholder;
      }
    }
  }

  .multiple-tag {
    overflow: hidden;
    padding: 2px;

    span {
      position: relative;
      display: block;
      float: left;
      margin: 2px 4px 2px 0;
      line-height: 20px;
      box-sizing: border-box;
      padding: 0 24px 0 10px;
      border: 1px @neutral-border solid;
      background-color: @neutral-bg;
      font-size: 12px;
      border-radius: 2px;

      em {
        position: absolute;
        display: block;
        top: 50%;
        margin-top: -5px;
        right: 6px;
        font-style: normal;
        cursor: pointer;

        &:hover {
          color: @main;
        }
      }
    }
  }

  .dgg-tree-clear {
    position: absolute;
    right: 8px;
    top: 7px;
    color: @neutral-placeholder;
    display: none;
    background-color: #fff;
  }

  .dgg-no-data {
    text-align: center;
    font-size: 12px;
    padding: 5px 0 0 0;
    color: @neutral-help;
  }
</style>
