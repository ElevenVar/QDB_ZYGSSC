<template>
  <div class="case">
    <div v-show="$route.name === 'case'">
      <div class="caseTable">
        <div class="search-box">
          <dgg-input
            v-model="searchKey"
            style="width:270px;"
            class="search-input"
            maxlength="30"
            clearable
            placeholder="案例名称/生产单编号/律师名称"
            @keyup.enter.native="getCaseList(true)"
          >
            <dgg-icon
              slot="prefix"
              icon-class="dgg-search"
              @click="getCaseList(true)"
            />
          </dgg-input>
        </div>
        <div v-loading="loading" v-if="!toIforEmpty" class="case-box">
          <ul class="case-list">
            <li v-for="item in caseList" :key="item.id">
              <h2>
                <span>
                  <dgg-icon :icon-class="caseTypeRef(item.caseType)" />
                  {{ item.caseType }}
                </span>
                {{ item.proType }}
              </h2>
              <div class="case-detail">
                <div class="case-opts">
                  <div class="case-opts-cont">
                    <dgg-button
                      v-if="item.caseStatus !== 'checking'"
                      type="primary"
                      class="vertical-icon"
                      @click="jumpToDetal(item, 'view')"
                    >
                      <dgg-icon
                        svg-width="16px"
                        svg-height="16px"
                        icon-class="icon_view"
                      /><br />
                      查看</dgg-button
                    >
                    <dgg-button
                      v-if="
                        item.caseStatus === 'overrule' ||
                          item.caseStatus === 'edite'
                      "
                      type="primary"
                      class="vertical-icon"
                      @click="releaseCase(item)"
                    >
                      <dgg-icon
                        svg-width="16px"
                        svg-height="16px"
                        icon-class="icon_publish"
                      /><br />发布</dgg-button
                    >
                    <dgg-button
                      v-if="
                        item.caseStatus === 'overrule' ||
                          item.caseStatus === 'edite'
                      "
                      type="primary"
                      class="vertical-icon"
                      @click="jumpToDetal(item)"
                    >
                      <dgg-icon
                        svg-width="16px"
                        svg-height="16px"
                        icon-class="icon_edit1"
                      /><br />
                      编辑</dgg-button
                    >
                    <dgg-button
                      v-if="
                        item.caseStatus === 'overrule' ||
                          item.caseStatus === 'edite'
                      "
                      type="primary"
                      class="vertical-icon"
                      @click="deteleCase(item)"
                    >
                      <dgg-icon
                        svg-width="16px"
                        svg-height="16px"
                        icon-class="icon_delete1"
                      /><br />
                      删除</dgg-button
                    >
                    <dgg-button
                      v-if="item.caseStatus === 'checking'"
                      type="primary"
                      class="vertical-icon"
                      @click="revokeCase(item)"
                    >
                      <dgg-icon
                        svg-width="16px"
                        svg-height="16px"
                        icon-class="icon_withdraw"
                      /><br />
                      撤回</dgg-button
                    >
                  </div>
                </div>
                <h3>{{ item.caseName }}</h3>
                <p>状态：{{ statusText[item.caseStatus] }}</p>
                <div
                  v-for="person in getPartList(item.lawyers)"
                  :key="person.userId"
                  class="people-box"
                >
                  <img
                    :src="person.userFile"
                    @error="imgError(person)"
                    class="person-img"
                  />
                </div>
                <div v-if="item.lawyers.length > 5" class="more-people">
                  <dgg-icon
                    icon-class="dgg-ellipsis"
                    svg-width="18px"
                    svg-height="18px"
                  />
                </div>
                <p class="time">
                  更新时间：<span>{{
                    Number(item.updateTime) | timeFilter("YYYY.MM.DD HH:mm:ss")
                  }}</span>
                </p>
              </div>
            </li>
          </ul>
          <dgg-pagination
            :current-page="currentPage"
            :page-sizes="[8, 32, 64, 80]"
            :page-size="pageSize"
            :total="totalSize"
            layout="sizes, prev, pager, next"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>

        <!-- 模块无数据时 start -->
        <task-bit-map
          v-if="toIforEmpty"
          :show-btn="searchNull ? false : true"
          :synopsis="
            searchNull
              ? '未查询到相关案例，换个关键词试试'
              : '您还没有相关案例哟，点击前往生成'
          "
          class="task-bit-map"
          svg-width="100px"
          svg-height="100px"
          btn-name="前往生成"
          svg-class="icon_nocase"
          @click-back="clickBack"
        />
        <!-- 模块无数据时 end -->
      </div>
    </div>
    <fixedNotice />
    <router-view />
  </div>
</template>

<script>
// 加载页
// eslint-disable-next-line no-unused-vars
import lodash from "lodash";
import { mapState, mapActions } from "vuex";
import fixedNotice from "@/views/main/page/components/fixedNotice.vue";
import TaskBitMap from "./../components/taskBitMap";
import headImg from "@/assets/images/image_head_default.png";
export default {
  name: "Case",
  components: {
    fixedNotice,
    TaskBitMap
  },
  filters: {},
  data() {
    return {
      searchKey: "",
      totalSize: 0,
      toIforEmpty: false,
      searchNull: false,
      pageSize: 8,
      currentPage: 1,
      loading: false,
      caseList: [],
      /* caseTypeRef: {
        type1: {
          name: '民诉',
          icon: 'dgg-user'
        },
        type2: {
          name: '顾问',
          icon: 'dgg-hourglass'
        }
      }, */
      statusText: {
        overrule: "已驳回",
        edite: "草稿",
        checked: "审核通过",
        checking: "待审核"
      }
    };
  },
  computed: {
    ...mapState(["activeRoute"])
  },
  watch: {
    "$route.name": {
      handler(val) {
        if (val === "case" && this.$route.params.isFresh) {
          this.getCaseList();
        }
      }
    }
  },
  async mounted() {
    this.getCaseList();
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
    ...mapActions(["ruoterJump"]),
    ...mapActions("caseModule", [
      "case_query_list",
      "case_del",
      "case_revoke",
      "case_publish"
    ]),
    imgError(it) {
      it.userFile = headImg;
    },
    caseTypeRef(val) {
      switch (val) {
        case "民诉":
          return "icon_civil";
        case "刑诉":
          return "icon_criminal";
        case "法律":
          return "icon_law";
        case "行诉":
          return "icon_litigation";
        case "非诉":
          return "icon_nonlitigation";
        default:
          return "icon_others";
      }
    },
    jumpToDetal(item, isView) {
      this.ruoterJump({
        name: isView === "view" ? "caseDetailsPreview" : "caseGenerate",
        params: {
          caseNo: item.caseNo,
          title: item.caseName,
          from: "case"
        }
      });
    },
    getPartList(list) {
      if (list && list.length > 5) {
        return list.slice(0, 4);
      }
      return list;
    },
    getCaseList(isSearch) {
      if (isSearch) {
        this.currentPage = 1;
      }
      const params = lodash.cloneDeep({
        page: this.currentPage,
        limit: this.pageSize,
        params: {
          complex: this.searchKey
        }
      });
      console.log({ ...params }, "params");
      this.loading = true;
      this.case_query_list({ ...params })
        .then(res => {
          if (res.code === 200) {
            this.caseList = res.data.records || [];
            this.toIforEmpty = res.data.records.length === 0;
            this.totalSize = res.data.totalCount || 0;
            if (this.caseList.length === 0 && this.searchKey) {
              this.searchNull = true;
            } else {
              this.searchNull = false;
            }
          } else {
            this.$message({
              message: res.message,
              type: "error"
            });
          }
          this.loading = false;
        })
        .catch(e => {
          this.loading = false;
        });
    },
    releaseCase(item) {
      // 发布案例
      this.$confirm(
        "案例发布并通过案例中心审核后，可对外展示无法撤回，确定发布？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          const params = {
            caseNo: item.caseNo
          };
          this.case_publish(params)
            .then(res => {
              if (res.code === 200) {
                this.$message({
                  message: "案例保存并发布成功",
                  type: "success"
                });
                this.getCaseList();
              } else {
                this.$message({
                  message: res.message,
                  type: "error"
                });
              }
              this.loading = false;
            })
            .catch(e => {
              this.loading = false;
            });
        })
        .catch(() => {});
    },
    revokeCase(item) {
      // 撤回
      this.$confirm("是否撤回该案例?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const params = {
            caseNo: item.caseNo
          };
          this.case_revoke(params)
            .then(res => {
              if (res.code === 200) {
                this.$message({
                  message: "撤回成功",
                  type: "success"
                });
                this.getCaseList();
              } else {
                this.$message({
                  message: res.message,
                  type: "error"
                });
              }
              this.loading = false;
            })
            .catch(e => {
              this.loading = false;
            });
        })
        .catch(() => {
          //
        });
    },
    deteleCase(item) {
      // 删除案例
      this.$confirm("是否删除该案例?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const params = {
            caseNo: item.caseNo
          };
          this.case_del(params)
            .then(res => {
              if (res.code === 200) {
                // this.$message({
                //   message: "删除成功",
                //   type: "success"
                // });
                this.getCaseList(true);
              } else {
                this.$notify({
                  message: res.message,
                  type: "error",
                  customClass: "dgg-tip-msg"
                });
              }
              this.loading = false;
            })
            .catch(e => {
              this.loading = false;
            });
          // this.getCaseList(true);
        })
        .catch(() => {
          //
        });
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.getCaseList();
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getCaseList();
    },
    // 点击前往生成
    clickBack() {
      this.ruoterJump({
        name: "finish"
      });
    }
  }
};
</script>

<style lang="less">
@import (reference) "~assets/less/preset.less";
.case {
  width: 100%;
  height: 100%;
  .search-box {
    .dgg-icon {
      cursor: pointer;
    }
  }
  .task-bit-map {
    margin: 20vh auto 33vh;
  }
  .caseTable {
    width: 100%;
    height: 100%;
    background: #fff;
    border-radius: 6px;
    padding: 20px 10px;
    box-sizing: border-box;
    margin-bottom: 36px;
    .search-box {
      padding: 10px 20px 20px;
      border-bottom: 1px #e3e4e6 solid;
    }
    .case-box {
      box-sizing: border-box;
    }
    .case-list {
      width: 100%;
      padding: 20px 14px 0 20px;
      display: flex;
      flex-wrap: wrap;
      height: 600px;
      overflow: auto;
      box-sizing: border-box;
      li {
        display: inline-block;
        width: 256px;
        height: 256px;
        margin-right: 32px;
        margin-bottom: 30px;
        line-height: 1;
        background: linear-gradient(
          180deg,
          rgba(240, 242, 245, 1) 0%,
          rgba(176, 176, 176, 1) 100%
        );
        box-shadow: 0px 3px 8px 0px rgba(181, 181, 181, 0.32);
        border-radius: 6px;
        &:nth-child(4n) {
          margin-right: 0;
        }
        &:hover {
          box-shadow: 0px 14px 18px 0px rgba(181, 181, 181, 0.32);
          .case-detail {
            .case-opts {
              opacity: 1;
            }
          }
        }
        h2 {
          display: flex;
          align-items: center;
          height: 40px;
          padding-left: 14px;
          color: #19233c;
          font-size: 13px;
          span {
            display: inline-block;
            min-width: 48px;
            padding: 0 10px 0 6px;
            height: 18px;
            line-height: 18px;
            text-align: center;
            margin-right: 8px;
            border-radius: 10px;
            font-size: 12px;
            font-weight: normal;
            color: #fff;
            box-sizing: border-box;
            background: linear-gradient(
              139deg,
              rgba(193, 199, 208, 1) 0%,
              rgba(138, 144, 155, 1) 100%
            );
          }
        }
        .case-detail {
          position: relative;
          height: calc(100% - 40px);
          padding: 20px 14px 12px;
          background: #fff;
          border-radius: 6px;
          box-shadow: 0px 3px 8px 0px rgba(181, 181, 181, 0.32);
          .case-opts {
            position: absolute;
            left: 0;
            top: 0;
            opacity: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(255, 255, 255, 0.9);
            border-radius: 6px;
            transition: opacity 0.3s;
            .case-opts-cont {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              display: flex;
              justify-content: space-between;
              flex-wrap: wrap;
              .vertical-icon {
                width: 48px;
                height: 48px;
                border-radius: 6px;
                margin-left: 0;
                font-size: 12px;
                padding-top: 6px;
                .dgg-icon {
                  margin-bottom: 4px;
                }
                &:nth-child(3),
                &:nth-child(4) {
                  margin-top: 24px;
                }
              }
            }
          }
          h3 {
            height: 46px;
            margin-bottom: 40px;
            line-height: 22px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            color: #19233c;
            font-size: 16px;
            font-weight: bold;
          }
          p {
            font-size: 13px;
            color: #666873;
          }
          .people-box {
            display: inline-block;
            margin-top: 10px;
            vertical-align: middle;
            & + .people-box {
              margin-left: 10px;
            }
            .person-img {
              object-fit: cover;
            }
          }
          .more-people {
            display: inline-block;
            vertical-align: middle;
            margin-top: 10px;
            margin-left: 6px;
            width: 26px;
            height: 26px;
            line-height: 26px;
            text-align: center;
            border-radius: 100%;
            background-color: #c8cfdb;
            color: #ffffff;
            .dgg-icon {
              vertical-align: middle;
            }
          }
          img {
            border: 1px @main solid;
            border-radius: 100%;
            width: 26px;
            height: 26px;
          }
          .time {
            margin-top: 24px;
            color: #9398a1;
            font-size: 12px;
            span {
              color: #19233c;
            }
          }
        }
      }
    }
  }
}
</style>
