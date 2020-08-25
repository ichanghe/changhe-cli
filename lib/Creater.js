const { fetchRepoList,fetchTagList } = require("./request")
const inquirer = require("inquirer")
const { wrapLoading } = require('./util')
const util = require('util')
const path = require('path')
const downloadGitRepo = require('download-git-repo')
const ora = require('ora');


// 创建项目
class Creater {
    constructor(projectName,targetDir){
        this.name = projectName
        this.target = targetDir
        this.downloadGitRepo = util.promisify(downloadGitRepo)
    }
    async fetchReo(){
        let repos = await wrapLoading(fetchRepoList, 'wating fetch template') 
        if(!repos)return ;
        repos = repos.map(item=>item.name)
        let {repo } = await inquirer.prompt({
            name:'repo',
            type:'list',
            choices:repos,
            message:'please choose a template for the project'
        })
        return repo
    }
    async fetchTag(repo){
        let tags =   await wrapLoading(fetchTagList,'waiting fetch tagList',repo)
        let { tag } = await inquirer.prompt({
            name:'tag',
            type:'list',
            choices:tags,
            message:'please choose a tag for the project'
        })
      return tag
    }
    async download(repo, tag){
        // lujing
        let requestUrl = `zhu-cli/${repo}${tag?'#'+tag:''}`
        console.log(requestUrl,'----------')
        const download = ora(`正在下载....${repo}`);
        try {
            download.start();
            //2 、把资源下载到某路径,缓存功能
            await this.downloadGitRepo(requestUrl,path.resolve(process.cwd(),`${repo}@${tag}`))
            download.succeed()
            return this.target
        } catch (error) {
            console.log(error,'error')
            download.fail()

        }
        
    }
    async  create(){
        console.log(this.name)
        // 远程拉取

        // 1、 命令行交互
        let repo = await this.fetchReo()
        console.log(repo,'repo')
        let tag = await this.fetchTag(repo)
        console.log(tag,'---------')
        // 2、 将模板下载下来
        // await this.fetchTag(repo)
        // 3、根据用户的选择动态的生成内容
       await this.download(repo,tag)
        // await this.downloadGitRepo(repo,tag)
    }
}

module.exports = Creater;