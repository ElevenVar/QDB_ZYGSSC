export default {
  name: 'TableExpand',
  functional: true,
  props: {
    row: Object,
    render: Function,
    index: Number,
    column: {
      type: Object,
      default: null
    }
  },
  render: (h, ctx) => {
    // 为渲染的列中的params添加column属性,
    const params = {
      column: ctx.props.column,
      row: ctx.props.row,
      index: ctx.props.index
    }
    if (ctx.props.column) params.column = ctx.props.column
    return typeof ctx.props.render === 'function' && ctx.props.render(h, params)
  }
}
