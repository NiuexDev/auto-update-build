# Auto Update and Build
基于[h3](https://github.com/unjs/h3)框架，实现的在github发送webhooks时自动下载仓库(`git clone`)并执行自定义命令构建的网站自动化部署工具

## 使用方法
1. 按照文件内的提示填写
2. 将`config.example.json`重命名为`config.json`
3. 运行 `npm run start`
4. 在GitHub上，组织或仓库的设置中，打开`Webhooks`，添加一个Webhook，地址填入运行本服务的服务器的地址
3. 将网站的目录设置为`<DIR>/online`(见下文)


## `config.example.json`格式及说明

使用尖括号`<>`标记的就是需要按需修改的键或者值

- `<REPOSITORY PATH>`: 仓库名称，需要和Github上的仓库名称一致，即需要为`UserName/name`这样的格式。
- `<BRANCH>`: 需要触发更新构建的分支
- `<DIR>`: 网站的目录，程序会将这个目录作为工作目录。
- `<YOUR REPOSITORY URL>`: 仓库的完整地址，用于`git clone`。
- `<YOUR COMMAND>`: 如字面意思，构建需要运行的命令，可以有多条，从上往下依次执行。例如`npm i`, `npm run build`，并不限定于npm，其他语言和工具的命令也都是可以的，但需要**保证环境已配置**。
- `<OUTPUT DIR>`: 构建结束后输出文件的目录，用于将输出目录转移到工作目录下的`online`文件夹，即`<DIR>/online`。

## 其他配置及说明

程序默认运行在`20001`端口，如需修改请更改`config.yml`文件。但更推荐通过nginx等服务反向代理到一个域名，并开启https

## 例子
``` YAML
repository:
    <REPOSITORY PATH>: 
        branch: <BRANCH>
        path: <DIR>
        repository: <YOUR REPOSITORY URL>
        command: 
            - "<YOUR COMMAND ONE> SUCH AS <npm i>"
            - "<YOUR COMMAND TWO> SUCH AS <npm run build>"
        output: <OUTPUT DIR>
    <OTHER REPOSITORY PATH>: 
        branch: main
        path: /www/example.com
        repository: htttp://github.com/example/example.com.git
        command: 
            - "<YOUR COMMAND ONE> SUCH AS <npm i>"
            - "<YOUR COMMAND TWO> SUCH AS <npm run build>"
        output: <OUTPUT DIR>
```