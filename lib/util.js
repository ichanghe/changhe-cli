const ora = require('ora')
async function sleep(n){
    return new Promise((resolve,reject)=>setTimeout(resolve,n))
}
async function wrapLoading(fn,message,...args){
    const spinner  = ora(message);
    spinner.start();
    try {
        let repos = await fn(...args)
        spinner.succeed()
        return repos; 
    } catch (error) {
        console.log(error)
        spinner.fail('request failed,refetch')
        await sleep(1000);
        return wrapLoading(fn,message,...args);
    }  
}
module.exports = {
    sleep,
    wrapLoading
}