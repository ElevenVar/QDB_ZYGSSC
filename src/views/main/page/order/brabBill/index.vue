<template>
  <div class="brabBill">
    <div v-show="$route.name ==='brabBill'">
      <div class="tabs-item-head">
        <div>
          <dgg-icon
            :icon-class="searchState? 'icon_screen_selected':'icon_screen'"
            class="dgg-search"
            svg-width="15px"
            svg-height="15px"
            @click="searchState=!searchState"
          />
          <dgg-input
            v-model="searchData"
            :maxlength="30"
            class="search"
            placeholder="地区/产品/合同/客户/生产单号"
            oninput="this.value=this.value.replace(/\s/g,'')"
            onkeyup="if(value.length>30)value=value.slice(0,30)"
          >
            <dgg-icon
              slot="prefix"
              icon-class="dgg-search"
              svg-width="15px"
              svg-height="15px"
            />
          </dgg-input>
          <dgg-button
            v-if="!searchState"
            plain
            class="receive-button default-btn-with"
            @click="searchClick"
          >
            搜 索
          </dgg-button>
          <dgg-button
            v-if="!searchState"
            plain
            class="dgg-button-nocolor default-btn-with"
            @click="resetClick"
          >
            重 置
          </dgg-button>
          <el-tooltip
            effect="dark"
            popper-class="grab-tooltip"
            content="抢单后，可前往“抢单”菜单查看抢单状态，等待后台分配"
            placement="top"
          >
            <div class="fr icon_info">
              <dgg-icon
                icon-class="icon_info"
                svg-width="15px"
                svg-height="30px"
              />
            </div>
          </el-tooltip>
        </div>

        <div
          v-if="searchState"
          class="tabs-item-query"
        >
          <dgg-query
            ref="query"
            :query-list="queryList"
            :can-export="false"
            clear-value
            @resetEvent="resetQuery"
            @search="search"
          />
        </div>
      </div>

      <div class="brabBill-body">
        <dgg-edit-table
          :data="dataList.records"
          :columns="columns"
          :request-data-api="find_grab_order_with_page"
          :params="params"
          :page-info="dataList.totalPage"
        />
      </div>
    </div>
    <fixedNotice type="phone" />
    <router-view />
  </div>
</template>

<script>
// 加载页
// eslint-disable-next-line no-unused-vars
import { mapState, mapActions } from 'vuex';
import moment from 'moment';
import fixedNotice from '@/views/main/page/components/fixedNotice.vue';

export default {
  name: 'BrabBill',
  components: {
    fixedNotice
  },
  data() {
    return {
      activeName: 'first',
      search1: '',
      searchState: false,
      columns: [
        {
          prop: 'productName',
          width: '175',
          label: '业务产品',
          type: 'isrender',
          render: (h, params) => {
            let _iconName = 'icon_civil';
            if (params.row.businessProductCode === 'BUS_YT_FL_FS') {
              _iconName = 'icon_nonlitigation';
            }
            if (params.row.businessProductCode === 'BUS_YT_FL_MSSS') {
              _iconName = 'icon_civil';
            }
            if (params.row.businessProductCode === 'BUS_YT_FL_XZSS') {
              _iconName = 'icon_litigation';
            }
            if (params.row.businessProductCode === 'BUS_YT_FL_XSSS') {
              _iconName = 'icon_criminal';
            }
            if (params.row.businessProductCode === 'BUS_YT_FL_FLGW') {
              _iconName = 'icon_law';
            }
            return (
              <div >
                <div>
                  <dgg-icon
                    class='fl'
                    icon-class={_iconName}
                    style='margin-right:10px;'
                    svg-width='48px'
                    svg-height='23px'
                  />
                </div>
                <span class='dgg-text-ellip ' style='display: block;'>{params.row.commodityName}</span>
              </div>
            );
          }
        },
        {
          prop: 'scOrderNo',
          label: '生产单编号',
          width: '140',
          type: 'isrender',
          render: (h, params) => {
            return (
              <div
                style='color:#10BBB8;cursor: pointer;'
                class='dgg-text-ellip '
                onClick={e => {
                  // this.ruoterJump({
                  //   name: "brabBillDetails",
                  //   params: { id: params.row.id }
                  // });
                }}
              >
                {params.row.scOrderNo}
              </div>
            );
          }
        },
        { prop: 'customerName', width: '200', label: '客户名称' },
        { prop: 'region', width: '120', label: '办理地区' },
        { prop: 'commission', width: '100', label: '佣金/比例' },
        { prop: 'remark', label: '备注' },
        {
          prop: 'order_info',
          width: '120',
          label: '订单信息',
          type: 'isrender',
          render: (h, params) => {
            return (
              <div
                style='color:#10BBB8;cursor: pointer;'
                class='dgg-text-ellip '
                onClick={e => {
                  this.ruoterJump({
                    name: 'brabBillDetails',
                    params: { id: params.row.id }
                  });
                }}
              >
                订单信息
              </div>
            );
          }
        },
        // { prop: 'countDown', width: '110', label: '剩余时间',
        //   type: 'isrender',
        //   render: (h, params) => {
        //     return (
        //       <div style='color:#F10940'>
        //         {moment(params.row.countDown).format('HH:mm:ss')}
        //       </div>
        //     );
        //   }
        // },
        {
          label: '状态',
          width: '120',
          type: 'isrender',
          render: (h, params) => {
            // const _name = this.getorderStatus(params.row.orderStatus);
            const _name = params.row.orderStatus;
            return <div class='dgg-text-ellip'>{_name}</div>;
          }
        }
      ],
      searchData: '',
      paramsData: {},
      paramsSearchData: {}
    };
  },
  computed: {
    ...mapState('orderModule', ['areaOptions', 'orderTeamOptions']),
    ...mapState('brabBillModule', ['dataList', 'commodityOptions']),
    params() {
      return {
        ...this.paramsData
      };
    },
    queryList() {
      return [
        {
          field: 'commodityName',
          type: 'select',
          label: '产品',
          value: '',
          width: '220px',
          options:
            [...[{ label: '全部', value: '' }], ...this.commodityOptions.map(item => {
              return {
                value: item.name,
                label: item.name
              };
            })] || []
        },
        {
          field: 'region',
          type: 'select',
          label: '地区',
          width: '220px',
          value: '',
          options:
            [...[{ label: '全部', value: '' }], ...this.areaOptions.map(item => {
              return {
                value: item.name,
                label: item.name
              };
            })] || []
        },
        {
          field: ['startUserGrabTime', 'endUserGrabTime'],
          type: 'daterange',
          label: '时间',
          width: '220px',
          value: ''
        },
        {
          label: '佣金',
          width: '220px',
          children: [
            {
              field: 'startMoney',
              type: 'input',
              label: 'test1',
              width: '97px',
              placeholder: '最低',
              value: ''
            },
            {
              field: 'endMoney',
              type: 'input',
              label: 'test1',
              width: '97px',
              placeholder: '最高',
              value: ''
            }
          ]
        }
      ];
    }
  },
  watch: {},
  async mounted() {},
  activated() {
    //
  },
  async created() {
    await this.find_product({ proType: 'BUS_YT_FL' });
  },
  beforeDestroy() {
    //
  },
  methods: {
    ...mapActions(['ruoterJump']),
    ...mapActions('brabBillModule', [
      'get_grab_order_page',
      'find_product',
      'find_grab_order_with_page'
    ]),
    change() {
      if (this.$route.name === 'brabBill') {
        this.ruoterJump({ name: 'brabBillDetails' });
      } else {
        this.ruoterJump({ name: 'brabBill' });
      }
    },
    resetQuery() {
      this.searchData = '';
    },
    search(val) {
      this.paramsSearchData = val;
      this.paramsData = this.paramsSearchData;
    },
    searchClick() {
      this.paramsData = {
        searchInfo: this.searchData
      };
    },
    resetClick() {
      this.searchData = '';
      this.paramsData = {};
    }
  }
};
</script>

<style lang="less">
.brabBill {
  width: 100%;
  background: rgba(255, 255, 255, 1);
  min-height: calc(100% - 42px);
  margin-bottom: 36px;
  border-radius: 0 0 6px 6px;
  .search {
    width: 270px;
    height: 30px;
    margin-left: 20px;
    > input {
      background: rgba(240, 242, 245, 1);
      border: none;
    }
  }
  .el-tabs__nav-scroll {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .dgg-search {
    margin-left: 15px;
    cursor: pointer;
  }
  .icon_info {
    cursor: pointer;
    margin-right: 30px;
    line-height: 30px;
  }
  .tabs-item-head {
    min-height: 70px;
    padding: 20px 0px;
  }
  .brabBill-body {
    padding: 0 10px;
  }
  .brabBill-button {
    border-radius: 4px;
    border: 1px solid rgba(16, 187, 184, 1);
  }
}
</style>
