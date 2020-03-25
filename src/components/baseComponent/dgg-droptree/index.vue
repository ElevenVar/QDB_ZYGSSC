<template>
  <div
    ref="dggDroptree"
    class="dgg-droptree"
  >
    <!-- 下拉选择器 -->
    <el-popover
      ref="popover"
      v-model="visible"
      placement="bottom-start"
      trigger="click"
      @show="onShowPopover"
      @hide="onHidePopover"
    >
      <!-- :readonly="!this.textFocus" -->
      <div
        slot="reference"
        class="inputWrapper"
      >
        <el-input
          ref="input"
          v-model="labelText"
          :readonly="true"
          :style="`width: ${width}px`"
          :class="{'rotate': showStatus }"
          :placeholder="placeholder"
          clearable
          @clear="resetChecked"
          @blur="blurHandle"
        />
        <span class="input--suffix">
          <i
            class="el-icon-circle-close"
            @click.stop="resetChecked"
          />
        </span>
      </div>
      <div
        @click.capture="clickHandle"
        @scroll.capture="scrollHandle"
      >
        <el-input
          v-if="ifSearch"
          v-model="labelModel"
          clearable
          placeholder="请输入关键字搜索"
          @clear="resetChecked"
        />
        <!-- 多选如果只能选最后一级则处理数据 -->
        <el-tree
          v-if="showLastChild"
          ref="tree"
          :style="`min-width:${treeWidth}px`"
          :data="options|handleShowLastChild"
          :props="props"
          :show-checkbox="showCheckbox"
          :filter-node-method="filterNode"
          :default-expanded-keys="selectedTreeValue"
          :default-checked-keys="selectedTreeValue"
          class="dgg-droptree"
          highlight-current
          node-key="id"
          @node-click="onClickNode"
          @check="handleCheckChange"
        />
        <el-tree
          v-else
          ref="tree"
          :style="`min-width:${treeWidth}px`"
          :data="options"
          :props="props"
          :show-checkbox="showCheckbox"
          :filter-node-method="filterNode"
          :default-expanded-keys="selectedTreeValue"
          :default-checked-keys="selectedTreeValue"
          class="dgg-droptree"
          highlight-current
          node-key="id"
          @node-click="onClickNode"
          @check="handleCheckChange"
        />
        <!-- :current-node-key="this.value" -->
      </div>
      <div
        v-if="showhandleBtn"
        style="margin-top:10px; float:right;"
      >
        <a
          href="javascript:void(0)"
          style="border: 1px solid #eee;margin-right:5px;"
          @click="getCheckedNodes"
        >确定</a>
        <a
          href="javascript:void(0)"
          style="border: 1px solid #eee;"
          @click="closeMenu"
        >关闭</a>
      </div>
    </el-popover>
    <span style="margin-left:5px;display:inline-block;vertical-align: top;">
      <a
        v-if="showCloseBtn"
        href="javascript:void(0)"
        @click="resetChecked"
      >清空</a>
    </span>
  </div>
</template>

<script type="text/babel">
/* eslint-disable vue/require-default-prop */

export default {
  name: 'DggDroptree',
  componentsName: '下拉树',
  filters: {
    handleShowLastChild(data) {
      // 除了最后一层的disabled不改变，其他全设置为true
      var mapDisabled = function(data) {
        if (!data.length) {
          return;
        }
        for (const v of data) {
          if (!v.children.length) {
            continue;
          }
          v.disabled = true;
          mapDisabled(v.children);
        }
      };
      mapDisabled(data);
      return data;
    }
  },
  // 绑定(单选)事件
  model: {
    prop: 'value',
    event: 'selected'
  },
  props: {
    // 接受传递过来的参数
    value: [String, Array],
    // 宽度
    width: String,
    // 传递过来的数据
    options: {
      type: Array,
      required: true
    },
    // 输入框占位符
    placeholder: {
      type: String,
      required: false,
      default: '请选择'
    },
    // 是否多选
    showCheckbox: {
      type: Boolean,
      default: false
    },
    // 是否搜索
    ifSearch: {
      type: Boolean,
      default: false
    },
    // 显示确定、取消按钮
    showhandleBtn: {
      type: Boolean,
      default: false
    },
    // 显示确定、取消按钮
    showCloseBtn: {
      type: Boolean,
      default: false
    },
    expandedClear: {
      type: Boolean,
      default: false
    },
    // 树节点配置选项
    props: {
      type: Object,
      required: false,
      default: () => ({
        parent: 'parentId',
        value: 'id',
        label: 'label',
        children: 'children'
      })
    },
    // 是否只展示最后一个子节点
    showLastChild: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 输入框icon显示状态
      showStatus: false,
      // 菜单宽度
      treeWidth: 'auto',
      // 输入框显示的值
      labelModel: '',
      // v-model绑定value的值
      valueModel: '',
      // 输入框显示的值
      labelText: '',
      // 获取焦点
      // textFocus: true,
      // 判断popover是否显示
      visible: false,
      // 失去焦点判断标志
      softFocus: false
    };
  },
  computed: {
    selectedTreeValue() {
      if (typeof this.value === 'string') {
        return [this.value];
      } else {
        return this.value;
      }
    }
  },
  watch: {
    labelModel(val) {
      // this.$refs.tree.filter(val);
    },
    labelText(val) {
      // this.$refs.tree.filter(val);
    },
    value(val) {
      // this.labelModel = this.queryTree(this.options, val);
      this.labelText = this.queryTree(this.options, val);
    }
  },
  created() {
    // 检测输入框原有的值并显示对应的label
    if (this.value) {
      this.labelText = this.queryTree(this.options, this.value);
      // this.labelModel = this.value;
    }

    // 获取输入框宽度同步至树状菜单宽度
    this.$nextTick(() => {
      this.treeWidth = `${(this.width ||
        this.$refs.input.$refs.input.clientWidth) - 24}px`;
    });
  },
  methods: {
    clickHandle() {
      // 继续聚焦不失去焦点
      this.$refs.input.focus();
      this.softFocus = true;
    },
    trueHandle() {
      // console.log(123)
      // 继续聚焦不失去焦点
      this.$refs.input.focus();
      this.softFocus = true;
    },
    scrollHandle() {
      if (!this.softFocus) {
        // 继续聚焦不失去焦点
        this.$refs.input.focus();
        this.softFocus = true;
      }
    },
    blurHandle() {
      // 失去焦点隐藏元素
      setTimeout(() => {
        if (!this.softFocus) {
          this.visible = false;
        }
        // console.log(this.softFocus)
        // this.softFocus = false;
      }, 500);
    },
    // 清空选中节点
    resetChecked() {
      // this.$refs.tree.setCheckedNodes([]);
      // this.$emit("clearVal",this);
      this.$emit('selected', '');
      this.labelModel = '';
      this.labelText = '';
      this.valueModel = '';
      this.$refs.tree.setCheckedKeys([]);
    },
    // 选中节点事件
    handleCheckChange(data) {
      // 继续聚焦不失去焦点
      this.$refs.input.focus();
      this.softFocus = true;
      this.$emit('handle-check-change', data);
    },
    // 获取多选框选中的节点
    getCheckedNodes(e) {
      // 继续聚焦不失去焦点
      this.$refs.input.focus();
      this.softFocus = true;
      // return;
      const treeNodes = this.$refs.tree.getCheckedNodes();
      const c = treeNodes.map(res => res.label);
      this.labelText = c.join(',');
      const ids = treeNodes.map(res => res.id);
      this.valueModel = ids;
      this.$emit('selected', this.valueModel);
      this.$emit('get-checked-nodes', treeNodes);
      this.labelModel = '';
      this.onCloseTree();
    },
    // 关闭下拉树菜单
    closeMenu() {
      this.onCloseTree();
    },
    // 点击节点
    onClickNode(node) {
      // 单选
      if (this.showCheckbox == false) {
        if (this.showLastChild == true) {
          if (node.children.length == 0) {
            this.labelText = node[this.props.label];
            this.valueModel = node[this.props.value];
            this.labelModel = '';
            this.onCloseTree();
          }
        } else {
          // 设置了禁用则无法选择
          if (node.disabled === true) {
            return;
          }
          this.labelText = node[this.props.label];
          this.valueModel = node[this.props.value];
          this.labelModel = '';
          this.onCloseTree();
        }
      }
    },
    // 隐藏下拉树
    onCloseTree() {
      // 隐藏后可失去焦点
      this.softFocus = true;
      this.$refs.popover.showPopper = false;
    },
    // 下拉树显示时触发
    onShowPopover() {
      this.softFocus = false;
      this.showStatus = true;
      this.$refs.tree.filter(false);
      if (this.expandedClear) {
        this.resetChecked();
      }
    },
    // 下拉树隐藏时触发
    onHidePopover() {
      this.showStatus = false;
      //
      // 不是多选触发
      if (!this.showCheckbox) {
        this.valueModel = this.valueModel.toString();
        this.$emit('selected', this.valueModel);
      }
    },
    // 树节点过滤方法
    filterNode(value, data, node) {
      if (!value) return true;
      return data[this.props.label].indexOf(value) !== -1;
    },
    // 搜索下拉树中的 ID
    queryTree(tree, id) {
      let str = '';
      let arr = [];
      arr = arr.concat(tree);
      while (arr.length) {
        const temp = arr.shift();
        if (temp[this.props.children]) {
          arr = arr.concat(temp[this.props.children]);
        }
        if (id instanceof Array) {
          for (const key in id) {
            if (id[key] == temp[this.props.value]) {
              str += temp[this.props.label] + ',';
            }
          }
        } else {
          if (temp[this.props.value] == id) {
            return temp[this.props.label];
          }
        }
      }
      if (str[str.length - 1] === ',') {
        return str.substr(0, str.length - 1);
      } else {
        return str;
      }
    }
  }
};
</script>
