const path = require('path')
const fs = require('fs-extra')
const Inquirer = require('inquirer')
module.exports = async function (projectName,options){
    const cwd = process.cwd()
    console.log(cwd)
    const targetDir = path.join(cwd,projectName)
    if(fs.existsSync(targetDir)){
        await fs.remove(targetDir)
    }else{
        // 提示用湖是否确定要覆盖
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