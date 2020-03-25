# 法律生产

> This is a project base on vue and element-ui- 2.11.1

## Build Setup

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080 this is a document show
npm run dev


# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# 版本封版  （当前分支，必须先保证远端是最新的在封版本，打标签）
git tag + 版本号
git push origin  + 版本号
# eslint 格式化代码  格式化src下的 配置过的代码
eslint --fix src
```

## 目录

```
--------------------------------------------------------------------------------
| -- build                                         --项目构建文件
|   |--
| -- config                                        --项目配置文件
|   |--
| -- src                                           --项目主路径
|   |-- api                                            --各个模块请求文件 （如果是整个Iboss项目， 须分模块来写）
|   |-- assets                                         --src文件下的静态文件
|   |-- components                                     --整个项目的公共组件库
|   |-- directive                                      --全局指令
|   |-- filters                                        --全局过滤器
|   |-- icons                                          --全局icons
|   |-- lang                                           --语言文件 （需要应用的话 须手动配置，工作量很大)
|   |-- router                                         --全局路由 （如果是整个Iboss项目， 须分模块来写）
|   |-- store                                          --全局状态管理 （如果是整个Iboss项目， 须分模块来写）
|   |-- styles                                         --特殊样式引用
|   |-- utils                                          --公共方法库
|   |-- vendor                                         --需要引用的第三方js
|   |-- views                                          --整个项目的vue文件，也就是页面
|     |-- login                                          --登陆页面
|     |-- main                                           --全局页面（里面除了特殊页面，须分模块写）
|   |-- App                                            --项目页面主入口
|   |-- main                                           --项目js主入口
| -- static                                        --项目外部静态文件夹
|   |--
| -- .babelrc                                      --babel编译文件
| -- .editorconfig                                 --editor配置文件
| -- .eslintignore                                 --eslint忽略文件
| -- .eslintrc                                     --eslint配置文件
| -- index                                         --项目初始化index文件
| -- package.json                                  --项目初始化配置文件
--------------------------------------------------------------------------------
```

## git 操作命令(公共仓库都是同一个代码仓库， 合并的时候相当于只合并了关于子系统业务的代码和静态页面)

```
  新项目（子项目init） 建立分支没有介绍,

  1. git remote add common xxx
                                     -xxx 新增的git仓库地址 -common 我取的公共仓的名字
  2. git pull common dev:common
                                     拉取公共仓的代码至本地common 仓
  3. git checkout common
                                     切换至本地公共仓库
  4. git pull origin dev --allow-unrelated-histories
                                     自己本地仓允许不同仓库的代码合并
  5. git pull checkout dev      git merge common
                                     切换dev 分支 并 合并公共分支
  总项目，  建立分支没有介绍, 合并公共仓和子项目一样

  1. git remote add item xxx
                                     -xxx 新增的子系统的仓库地址, 可能是多个, item 为子系统名字
  2. git checkout pending
                                     切换至待处理的仓库
  3. git pull item dev
                                     切换至待处理的仓库
  4. git pull origin dev --allow-unrelated-histories
                                     自己本地仓允许不同仓库的代码合并
  5. git pull checkout dev      git merge common
                                     切换dev 分支 并 合并子系统的代码


```

## vscode vue 配置首选项

文件 首选项 设置 打开设置 然后把下面代码复制进去。 然后下载相应的插件。

```
{
    "editor.formatOnSave": true,
    "files.autoSave": "off",
    "editor.tabSize": 2,
    "window.zoomLevel": 1,
    "editor.wordWrap": "wordWrapColumn",
    "editor.wordWrapColumn": 170,
    "vetur.validation.template": false,
    "vetur.format.defaultFormatter.html": "js-beautify-html",
    "git.ignoreMissingGitWarning": true,
    "emmet.syntaxProfiles": {
        "vue-html": "html",
        "vue": "html"
    },
    "eslint.enable": true,
    "eslint.validate": [
        "javascript", {
            "language": "vue",
            "autoFix": true
        }, "html",
        "vue"
    ],
    "eslint.autoFixOnSave": true,
    "prettier.eslintIntegration": true,
    "prettier.stylelintIntegration": true,
    // 强制单引号
    "prettier.singleQuote": true,
    // 尾随逗号
    "prettier.trailingComma": "all",
    // 取消分号
    "prettier.semi": true,
    "git.path": "E:/git/Git/cmd/git.exe",
    "git.enableSmartCommit": true,
    "auto-rename-tag.activationOnLanguage": [
        "html",
        "xml"
    ],
}
```
