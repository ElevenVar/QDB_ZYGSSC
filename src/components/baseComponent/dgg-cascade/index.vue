<template>
  <div
    class="dgg-cascade"
    :id="id"
  >
    <div class="el-input el-input--suffix">
      <input
        type="text"
        v-model="txt"
        :placeholder="placeholder"
        :disabled="disabled"
        readonly
        @click="dataShow"
        class="el-input__inner"
      />
      <span class="el-input__suffix">
        <span class="el-input__suffix-inner">
          <dgg-icon
            icon-class="dgg-up"
            v-if="isShow"
          />
          <dgg-icon
            icon-class="dgg-down"
            v-else
          />
        </span>
      </span>
    </div>
    <div
      class="dggui-distpicker-bus-picker"
      :style="'width:'+ width"
      :class="isShow?'show':''"
    >
      <span
        class="dggui-distpicker-empty"
        @click="clear"
      >清空</span>
      <div class="dggui-distpicker-buspickertab">
        <a class="active">请选择</a>
      </div>
      <div class="dggui-distpicker-buspickercontent">
        <a
          v-for="item in items"
          :id="item.id"
          @click="picker(item)"
          :class="item.checked===true?'active':''"
        >
          {{item.labelName}}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import method from "@/api/method";

export default {
  name: "dgg-cascade",
  componentsName: "级联选择",
  data() {
    return {
      test: true,
      txt: "",
      items: [],
      isShow: false,
      oid: "-1",
      ids: [],
      txts: []
    };
  },
  props: {
    id: "",
    value: {
      type: Array,
      default: function(){
        return [];
      }
    },
    checks: {
      type: Array,
      default: function(){
        return [];
      }
    },
    placeholder: {
      type: String,
      default: ``
    },
    width: {
      type: String,
      default: `400px`
    },
    url: {
      type: String,
      default: `/data/distpicker4.json`
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    dataShow() {
      let that = this;
      that.isShow = !that.isShow;
    },
    getData(id) {
      let that = this;
      that.test = false;
      method
        .get(that.url, { params: { id: id } })
        .then(rep => {
          // console.log(rep)
          if (rep.data && rep.data.length > 0) {
            that.items = rep.data;
          } else {
            that.dataShow();
          }
          that.test = true;
        })
        .catch(error => {
          console.log(error);
        });
    },
    picker(obj) {
      let that = this;
      let pi = $.inArray(obj.pid, that.ids);
      let $tab = $("#" + that.id + " .dggui-distpicker-buspickertab");
      if (that.test !== true) {
        return false;
      }
      if (obj.pid === "-1") {
        if (obj.isSonId !== 0) {
          $tab
            .find("a")
            .eq(0)
            .hide();
          that.ids.splice(0, 1);
          that.txts.splice(0, 1);
        }
      }
      if ($.inArray(obj.id, that.ids) === -1) {
        that.getData(obj.id);
        that.ids.push(obj.id);
        that.txts.push(obj.labelName);
        that.txt = that.txts.join(" / ");
        if (obj.isSonId !== 0) {
          $tab.find("a").removeClass("active");
          $tab.append(
            '<a class="active" oid="' + obj.id + '">' + obj.labelName + "</a>"
          );
        }
        if (obj.pid === that.ids[pi]) {
          that.ids.splice(pi + 1, that.ids.length - pi - 2);
          that.txts.splice(pi + 1, that.txts.length - pi - 2);
          that.txt = that.txts.join(" / ");
        }
        that.tabChange();
        that.$emit("change", {
          ids: that.ids,
          texts: that.txts
        });
      } else {
        that.dataShow();
      }
    },
    tabChange() {
      let that = this;
      let $tab = $("#" + that.id + " .dggui-distpicker-buspickertab");
      $tab
        .find("a")
        .off("click")
        .on("click", e => {
          let $this = $(e.target);
          let i = $this.index();
          that.getData($this.attr("oid"));
          $tab.find("a").removeClass("active");
          $this.addClass("active");
          $this.nextAll().remove();
          that.ids.splice(i, that.ids.length - i);
          that.txts.splice(i, that.txts.length - i);
          that.txt = that.txts.join(" / ");
        });
    },
    clear() {
      let that = this;
      let $tab = $("#" + that.id + " .dggui-distpicker-buspickertab");
      that.isShow = false;
      that.getData("-1");
      that.ids = [];
      that.txts = [];
      that.txt = "";
      $tab
        .find("a")
        .eq(0)
        .show()
        .addClass("active");
      $tab
        .find("a")
        .eq(0)
        .nextAll()
        .remove();
      that.$emit("clear", {
        ids: that.ids,
        texts: that.txts
      });
      that.$emit("change", {
        ids: that.ids,
        texts: that.txts
      });
    }
  },
  mounted() {
    let that = this;
    that.getData("-1");
    that.txt = that.value.join(" / ");
  }
};
</script>

<style lang="less">
.dgg-cascade {
  position: relative;
  user-select: none;
  font-size: 12px;

  .el-input {
    width: 100%;
    height: 26px;
    line-height: 26px;

    .el-input__inner {
      cursor: default;
    }

    .dgg-icon {
      width: 10px;
      height: 10px;
      padding-top: 2px;
    }
  }

  .dggui-distpicker-bus-picker {
    position: absolute;
    left: 0px;
    top: 30px;
    width: 100%;
    min-width: 360px;
    display: none;
    z-index: 5;
    border: 1px solid #e8e8e8;
    border-top: 0;
    margin-top: -1px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    max-height: 360px;
    overflow-y: auto;

    &.show {
      display: block;
    }

    .dggui-distpicker-buspickertab {
      border-bottom: 1px solid #e8e8e8;
      border-top: 1px solid #e8e8e8;
      background: #f9f9fb;
      padding-right: 40px;

      &:after {
        content: "";
        display: block;
        clear: both;
      }

      a {
        display: block;
        float: left;
        padding: 1px 20px;
        border-left: 1px solid #e8e8e8;
        border-bottom: 1px solid transparent;
        color: #4d4d4d;
        text-align: center;
        outline: 0;
        text-decoration: none;
        cursor: pointer;
        margin-bottom: -1px;
        line-height: 32px;
        max-width: 100px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        position: relative;
      }

      > a:first-child {
        border-left: none;
      }

      > a:last-child {
        border-right: 1px solid #e8e8e8;
      }

      > a.active {
        background: #fff;
        border-bottom: 1px solid #fff;
        color: #10bbb8;
      }
    }

    .dggui-distpicker-empty {
      position: absolute;
      right: 10px;
      top: 0px;
      line-height: 32px;
      font-size: 12px;
      color: #8c8c8c;
      cursor: pointer;
    }

    .dggui-distpicker-buspickercontent {
      display: block;
      width: 100%;
      min-height: 10px;
      background-color: #fff;
      padding: 10px 15px;
      box-sizing: border-box;
      overflow: hidden;

      &:after {
        content: "";
        display: block;
        clear: both;
      }

      & a {
        display: block;
        float: left;
        padding: 0 10px;
        outline: 0;
        text-decoration: none;
        white-space: nowrap;
        margin-right: 2px;
        color: #333;
        cursor: pointer;
        line-height: 28px;
      }

      & a:hover {
        border-radius: 2px;
        color: #10bbb8;
      }

      & a.active {
        color: #fff;
        border-radius: 2px;
      }
    }
  }
}
</style>
