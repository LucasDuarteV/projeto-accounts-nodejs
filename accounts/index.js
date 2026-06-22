const chalk = require('chalk')
const inquirer = require('inquirer')

const fs = require('fs')

operation()

function operation() {
    inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'O que você deseja fazer?',
        choices: [
            'Criar Conta',
            'Consultar Saldo',
            'Depositar',
            'Sacar',
            'Sair',
        ]
    }]).then((answer => {

        const action = answer.action

        switch (action) {
            case 'Criar Conta':
                createAccount()
                break

            case 'Consultar Saldo':
                break

            case 'Depositar':
                deposit()
                break
            
            case 'Sacar':
                break
            
            case 'Sair':
                console.log(chalk.bgBlue.black('Obrigado por usar o Accounts!'))
                process.exit()
                break

        }

    })).catch(error => {
        console.log(error)
    })
}

function createAccount() {
    console.log(chalk.bgGreen.black('Parabéns por escolher nosso banco!'))
    console.log(chalk.green('Defina as opções da sua conta a seguir'))
    buildAccount()
}

function buildAccount() {
    inquirer.prompt([{
        name: 'accountName',
        message: 'Digite um nome para sua conta:',
    }]).then((answer => {
        const accountName = answer['accountName']

        console.info(accountName)

        if (!fs.existsSync('accounts')) {
            fs.mkdirSync('accounts')
        }

        if (fs.existsSync(`accounts/${accountName}.json`)) {
            console.log(chalk.bgRed.black('Esta conta já existe, escolha outro nome!'))
            buildAccount()
            return
        }

        fs.writeFileSync(`accounts/${accountName}.json`, '{"balance": 0}')

        console.log(chalk.green("Parabéns a sua conta foi criada!"))
        operation()
    })).catch(error => {
        console.log(error)
    })
}

function deposit(){
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        }
    ]).then((answer =>{
        const accountName = answer['accountName']
        if(!checkAccount(accountName)){
            return deposit()
        }

    })).catch(error => {
        console.log(error)
    })
}

function checkAccount(accountName){
    if(!fs.existsSync(`accounts/${accountName}.json`)){
        console.log(chalk.bgRed.black("Essa conta não existe, escolha outro nome!!"))
        return false
    }

    return true
}