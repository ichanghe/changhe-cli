const path = require('path')
const fs = require('fs-extra')
const Inquirer = require('inquirer')
const Creator = require('./Creater')
module.exports = async function (projectName,options){
    const cwd = process.cwd()
    console.log(cwd)
    const targetDir = path.join(cwd,projectName)
    if(fs.existsSync(targetDir)){
        if(options.force){
            await fs.remove(targetDir)
        }else{
            // 提示是否确定要覆盖
            let {action } = await  Inquirer.prompt([{name:'action',type:'list',message:`Target directory already exists Pick an action`,choices:[
                {name:'Overwrite',value:'overwrite'},
                {name:'Cancel',value:false}
            ]}])
            if(!action){
                return
            }else if(action === 'overwrite'){
                await fs.remove(targetDir)
            }
        }
        
    }
   const creator = new Creator(projectName,options)
   creator.create();
}
