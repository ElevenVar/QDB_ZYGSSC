<template>
  <dgg-modal
    :modal="modalFiled"
    :hasmodal="false"
    :close-on-click-modal="true"
    title=""
    width="330px"
    class="filed-popper"
    :hasFooter="false"
    @modalAffirm="submit"
    @modalQuit="close"
  >
    <div
      class="ref-case-dialog"
      @click.stop=""
    >
      <dgg-input
        v-model="searchKey"
        style="width:100%;"
        placeholder="搜索擅长标签"
      >
        <dgg-icon
          slot="prefix"
          icon-class="dgg-search"
        />
      </dgg-input>
      <div class="list-wrapper">
        <ul
          v-loading="loading"
          class="list"
        >
          <li
            v-for="item in fieldOptions"
            :key="item.code"
            :class="{active:item.isCheck === 1}"
            class="list-item"
            @click.stop="changeFiled(item)"
          >
            <p>{{ item.name }}</p>
            <dgg-icon
              v-if="item.isCheck"
              icon-class="dgg-check"
              svg-width="12px"
              svg-height="12px"
            />
          </li>
        </ul>
        <p
          v-if="!fieldOptions.length"
          class="bottom-tip"
        >暂无数据</p>
      </div>
    </div>
  </dgg-modal>
</template>

<script>
// 加载页
// eslint-disable-next-line no-unused-vars
import { mapState, mapActions } from 'vuex';
export default {
  name: 'FiledPopper',
  components: {},
  data() {
    return {
      modalFiled: false,
      searchKey: '',
      modalCase: false,
      loading: false,
      cloneFieldList: []
      // tempSelect: []
    };
  },
  computed: {
    ...mapState('personalSettingModule', ['fieldList']),
    noMore() {
      return this.fieldOptions.length >= 6;
    },
    disabled() {
      return this.loading || this.noMore;
    },
    fieldOptions() {
      if (this.searchKey) {
        return this.fieldList.filter(item =>
          item.name.includes(this.searchKey)
        );
      } else {
        return this.fieldList;
      }
    }
  },
  watch: {},
  async mounted() {
    this.cloneFieldList = this.fieldList;
  },
  activated() {
    //
  },
  created() {
    //
  },
  beforeDestroy() {
    //
  },
  methods: {
    ...mapActions('personalSettingModule', ['get_tree_book_list']),
    async showModel(show, labelIds) {
      this.modalFiled = show;
      this.loading = true;
      await this.get_tree_book_list();
      this.loading = false;
      if (labelIds && labelIds.length) {
        this.fieldOptions.forEach(i => {
          if (labelIds.includes(i.code)) {
            i.isCheck = 1;
          } else {
            i.isCheck = 0;
          }
        });
      }
    },
    setCheckedItems(list) {
      if (list) {
        const itemsIds = list.map(it => it.code);
        this.fieldOptions.forEach(item => {
          if (itemsIds.includes(item.code)) {
            item.isCheck = 1;
          }
        });
      }
    },
    changeFiled(item) {
      // if (this.modalFiled) {
      //   this.tempSelect.push(item);
      // }
      this.$set(item, 'isCheck', item.isCheck ? 0 : 1);
      this.$forceUpdate();
      // const checkedList = this.fieldOptions.filter(item => item.isCheck === 1);
      // console.log(this.fieldList, '----------------')
      this.fieldOptions.forEach(item => {
        this.fieldList.forEach(el => {
          if (item.code === el.code) {
            el['isCheck'] = item.isCheck ? 1 : 0
          }
        })
      })
      const checkedList = this.fieldList.filter(item => item.isCheck === 1);
      this.$emit('add-callback', checkedList);
    },
    close() {
      this.searchKey = '';
      this.modalFiled = false;
      // if (this.tempSelect.length) {
      //   this.tempSelect.forEach(item => {
      //     this.changeFiled(item);
      //   })
      // }
      // this.tempSelect = [];
    },
    submit() {
      //
      // console.log(this.fieldList, '----------------')
      this.fieldOptions.forEach(item => {
        this.fieldList.forEach(el => {
          if (item.code === el.code) {
            el['isCheck'] = item.isCheck ? 1 : 0
          }
        })
      })
      const checkedList = this.fieldList.filter(item => item.isCheck === 1);
      this.$emit('add-callback', checkedList);
      this.close();
    }
  }
};
</script>

<style scoped lang="less">
@import (reference) "~assets/less/presetPrivate.less";
@import (reference) "~assets/less/preset.less";
.filed-popper {
  .list-wrapper {
    height: 270px;
    overflow: auto;
    .ml-12 {
      margin-left: 12px;
    }
    .list {
      margin-top: 10px;
      height: 140px;
      overflow: auto;
    }
    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 30px;
      line-height: 30px;
      margin-bottom: 0;
      cursor: pointer;
      color: #666873;
      &.active {
        color: @main;
      }
      p {
        font-size: 12px;
        line-height: 30px;
      }
    }
    .bottom-tip {
      text-align: center;
      margin-bottom: 10px;
    }
  }
}
</style>
