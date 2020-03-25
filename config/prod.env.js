module.exports = {
  NODE_ENV: '"production"',
  ENV_CONFIG: '"prod"',
  UPLOADURL:
    '"https://tqdsannex.dgg188.cn/annex/upload_file_name_same_auto_add_name.do"',
  DOWNLOADURL: '"https://tqdsannex.dgg188.cn/annex/download.img"',
  LISTURL: '"https://tqdsannex.dgg188.cn/annex/find_file.do"',
  DELETEURL: '"https://tqdsannex.dgg188.cn/annex/del_file.do"',
  FILEURL: '"https://tqdsannex.dgg188.cn/annex/fuzzy_find_file.do"',
  UPDATEURL: '"https://tqdsannex.dgg188.cn/annex/update_file_state.do"',
  // =============================== cms 上传下载地址 start ===============================================//
  CMSUPLOADURL: '"https://tibosscms.dgg188.cn/api/cms/file/upload.do"',
  CMSDOWNLOADURL: '"https://tibosscms.dgg188.cn/api/cms/file/download.do"',
  CMSLISTURL: '"https://tibosscms.dgg188.cn/api/cms/file/find_file.do"',
  CMSDELETEURL: '"https://tibosscms.dgg188.cn/api/cms/file/del.do"',
  // =============================== cms 上传下载地址 end ==================================================//
  SEARCHPRODUCTURL:
    '"https://tproductapi.dgg188.cn/api/product/v1/search_product.do"', //正式环境改为https://productapi.dgg188.cn/api/product/v1/search_product.do
  // BASE_API: '"https://dmicrouag.dgg188.cn/"', // 测试环境
  BASE_API: '"https://tmicrouag.dgg188.cn/"', // T环境
  SYSCODE: '"qidabao"', //验签系统码
  SECRET: '"9a716fec8877b8fe5fdf277d11973626"', //验签系统秘钥
  ZYGSPrefixRule: '"qdb-zygssc/"', //专业公司前缀转发规则
  loginOutUrlL: '"https://tqdb.dgg188.cn"'
};
