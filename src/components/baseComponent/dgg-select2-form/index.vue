<template>
  <select v-model="arr" v-DggSelect2="option" :disabled="disabled"
          :id="option.el" multiple v-if="multiple"></select>
  <select v-model="val" v-DggSelect2="option" :disabled="disabled"
          :id="option.el" v-else></select>
</template>

<script>
  import method from '@/api/method';
  import select2 from 'select2'

  export default {
    name: 'dgg-select2-form',
    componentsName: '下拉搜索',
    data() {
      return {
        val: '',
        arr: []
      }
    },
    props: {
      value: {
        default: ``
      },
      multiple: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      option: Object
    },
    // model: {
    //   prop: 'value'
    // },
    methods: {
      init(){
        let that = this;
        let $el = $('#' + that.option.el);

        if (this.multiple && this.multiple === true) {
          this.arr = this.value;
          $el.select2('val', this.arr);
        } else {
          if (that.value.length > 0) {
            this.val = this.value[0].id;
          } else {
            this.val = '';
          }
          console.log(this.val);
          $el.select2('val', [this.val]);
        }

        $el.on('select2:open', (e) => {
          $('.select2-container--default').addClass('dgg-select2');
        })
        $('.select2-container--default').addClass('dgg-select2');

        $el.on('change', (e) => {
          that.$emit('change', $el.select2('data'))
        });
      },
      getData(){
        let $el = $('#' + this.option.el);
        return $el.select2('data');
      }
    },
    watch: {
      option: {
        handler(val) {
          let $el = $('#' + val.el);
          $el.empty();
          $el.select2(val);
        },
        deep: true,
        immediate: true
      },
      value: {
        handler(val) {
          let $el = $('#' + this.option.el);
          if (this.multiple && this.multiple === true) {
            this.arr = val;
            $el.select2('val', this.arr);
          } else {
            if (val.length > 0) {
              this.val = val[0].id;
            } else {
              this.val = '';
            }
            // this.$nextTick(()=>{
            //   $el.select2('val', [this.val]);
            // })
            $el.select2('val', [this.val]);
          }
        },
        deep: true,
        immediate: true
      }
    },
    async mounted() {
       await this.init();
       await this.$nextTick();
       setTimeout(()=>{
         let $el = $('#' + this.option.el);
         this.$emit('change', $el.select2('data'))
       });
    }
  }
</script>

<style lang="less">
  @import (reference) "~assets/less/preset.less";

  .select2-container--default.dgg-select2 {
    font-size: 12px;

    .select2-selection--single {
      border-color: @neutral-btn;
      border-radius: 2px;

      .select2-selection__rendered {
        padding-left: 12px;
        line-height: 26px;
        font-size: 12px;
      }
      .select2-selection__placeholder {
        color: @neutral-placeholder;
      }

      .select2-selection__arrow {
        b {
          border-top-color: @neutral-help;
          /*border-top-width: 6px;*/

          &:after {
            content: '';
            position: absolute;
            top: -8px;
            left: -4px;
            display: block;
            height: 0;
            width: 0;
            border-color: #fff transparent transparent transparent;
            border-style: solid;
            border-width: 6px 4px 0 4px;
          }
        }
      }

      .select2-selection__clear {
        display: none;
        width: 12px;
        height: 12px;
        margin-top: 7px;
        line-height: 11px;
        border-radius: 12px;
        background-color: @neutral-placeholder;
        color: #fff;
        text-align: center;

        &:hover {
          background-color: @neutral-help;
        }
      }

      &:hover {
        .select2-selection__clear {
          display: block;
        }
      }
    }

    &.select2-container--open {
      .select2-selection--single {
        border-color: @main;

        .select2-selection__arrow {
          b {
            border-bottom-color: @neutral-help;
            border-bottom-width: 6px;

            &:after {
              border-color: transparent transparent #fff transparent;
              border-width: 0 4px 6px 4px;
              top: 2px;
            }
          }
        }
      }

      .select2-selection--multiple {
        &:before,
        &:after {
          border-width: 0 4px 6px 4px;
        }

        &:before {
          border-color: transparent transparent @neutral-help transparent;
        }

        &:after {
          margin-top: 0;
          border-color: transparent transparent #fff transparent;
        }
      }
    }

    .select2-search--dropdown {
      position: relative;

      .select2-search__field {
        border-color: @main;
        font-size: 12px;
        line-height: 19px;
        color: @neutral;
      }

      &:after {
        font-family: element-icons !important;
        speak: none;
        font-style: normal;
        font-weight: 400;
        font-variant: normal;
        text-transform: none;
        line-height: 1;
        vertical-align: baseline;
        display: inline-block;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        content: "\E778";
        position: absolute;
        right: 16px;
        top: 50%;
        margin-top: -6px;
        color: @neutral-placeholder;
        font-weight: bold;
      }
    }

    .select2-results__option--highlighted[aria-selected] {
      background-color: @main-bg;
      color: @neutral;
    }

    .select2-results__option[aria-selected=true] {
      position: relative;
      background-color: @neutral-bg;

      &:after {
        font-family: element-icons !important;
        speak: none;
        font-style: normal;
        font-weight: 400;
        font-variant: normal;
        text-transform: none;
        line-height: 1;
        vertical-align: baseline;
        display: inline-block;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        position: absolute;
        right: 12px;
        content: "\e6da";
        color: @main;
        font-weight: bold;
        top: 50%;
        margin-top: -6px;
      }
    }

    .select2-results {
      & > .select2-results__options {
        max-height: 130px;
        .scrollbar;
      }
    }

    &.select2-container--disabled {
      .select2-selection--single {
        background-color: @neutral-bg;

        .select2-selection__arrow {
          b {
            &:after {
              border-top-color: @neutral-bg;
            }
          }
        }
      }
    }

    .select2-selection--multiple {
      border-radius: 2px;
      border-color: @neutral-btn;
      min-height: 28px;

      &:hover {
        .select2-selection__clear {
          display: block;
        }
      }

      &:before,
      &:after {
        content: '';
        border-style: solid;
        height: 0;
        right: 8px;
        margin-left: -4px;
        position: absolute;
        top: 12px;
        width: 0;
        border-width: 6px 4px 0 4px;
      }

      &:before {
        border-color: @neutral-help transparent transparent transparent;
      }

      &:after {
        margin-top: -2px;
        border-color: #fff transparent transparent transparent;
      }

      .select2-selection__rendered {
        padding: 2px 25px 2px 4px;
        display: block;
      }

      .select2-selection__choice {
        margin: 2px 4px 2px 0;
        background-color: #f7f7f7;
        border-color: @neutral-border;
        border-radius: 2px;
        font-size: 12px;
      }

      .select2-selection__choice__remove {
        float: right;
        margin: 0 0 0 5px;
        color: @neutral-help;
      }

      .select2-selection__clear {
        display: none;
        position: absolute;
        right: 5px;
        margin: 4px 15px 0 0;
        width: 12px;
        height: 12px;
        line-height: 11px;
        border-radius: 12px;
        background-color: @neutral-placeholder;
        color: #fff;
        text-align: center;

        &:hover {
          background-color: @neutral-help;
        }
      }

      .select2-search--inline {
        .select2-search__field {
          margin-left: 10px;
          margin-top: 2.5px;
        }
      }
    }

    &.select2-container--focus {
      .select2-selection--multiple {
        border-color: @main;
      }
    }
  }

  .select2-container--open.dgg-select2 {
    .select2-dropdown--below {
      margin-top: 4px;
      box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
      border: none;
      border-radius: 2px;
    }
  }

  .dgg-select2 {
    .select2-search--dropdown {
      padding: 8px;

      .select2-search__field {
        padding: 1.5px 8px;
        border-radius: 2px;
      }
    }

    .select2-results__option {
      line-height: 28px;
      padding: 0 12px;

      &.select2-results__message {
        text-align: center;
        color: @neutral-placeholder;
      }
    }

    .select2-results {
      /*padding: 0 2px;*/
    }

    .select2-results__options {
      max-height: 140px;
      overflow-x: hidden;
      overflow-y: auto;

      .select2-results__option {
        /*margin: 0 -2px;*/
      }
    }
  }

  .select2-container--default.select2-container--open.select2-container--below.dgg-select2 .select2-selection--single,
  .select2-container--default.select2-container--open.select2-container--below.dgg-select2 .select2-selection--multiple {
    border-bottom-left-radius: 2px;
    border-bottom-right-radius: 2px;
  }

</style>
