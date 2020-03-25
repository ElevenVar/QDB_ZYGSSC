import method from "@/api/method";
export function genera_tetemplate(params) {
  return method.post(
    `${process.env.ZYGSPrefixRule}api/portal/base/handingOrder/abandon_file.do`,
    params
  ); //  测试接口
}
