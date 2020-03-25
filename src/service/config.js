/*
 * 前端静态配置
 * @author kraml
 * @date 2019年8月2日
 *
 *----------------------------------------------------------------------
 *
 *
 */
const config = {
  // baseUrl:"http://172.16.23.218:8080/", //梁明亮
  // baseUrl: "http://172.16.22.146:8080/", // 姜宁
  baseUrl: process.env.BASE_API, // 开发环境 后端测试地址  全局配置
  baseEnv: process.env.ENV_CONFIG,
  uploadUrl: process.env.UPLOADURL,
  downloadUrl: process.env.DOWNLOADURL,
  listUrl: process.env.LISTURL,
  fileUrl: process.env.FILEURL,
  deleteUrl: process.env.DELETEURL,
  updateUrl: process.env.UPDATEURL,
  sysCode: process.env.SYSCODE,
  secret: process.env.SECRET,
  searchProductUrl: process.env.SEARCHPRODUCTURL,
  // -------------------------------CMS 图片上传地址 ------------------ start
  cmsUploadUrl: process.env.CMSUPLOADURL,
  cmsDownloadUrl: process.env.CMSDOWNLOADURL,
  cmsListUrl: process.env.CMSLISTURL,
  cmsDeleteUrl: process.env.CMSDELETEURL
  // -------------------------------CMS 图片上传地址 ------------------ end
};
export default config;
