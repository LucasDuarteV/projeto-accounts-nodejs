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
                getAccountBalance()
                break

            case 'Depositar':
                deposit()
                break
            
            case 'Sacar':
                withDrawn()
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

        inquirer.prompt([
            {
                name: 'amount',
                message: 'Quanto você deseja depositar'
            }
        ]).then(answer =>{

            const amount = answer['amount']
            addAmount(accountName , amount)
            operation()

        }).catch(error => console.log(error))


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

function addAmount(accountName , amount){

    const accountData = getAccount(accountName)

    if(!amount){
        console.log(chalk.bgRed.black("Ocorreu um erro!"))
        return deposit()
    }
    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)
    fs.writeFileSync(`accounts/${accountName}.json`,
        JSON.stringify(accountData)
    )

    console.log(chalk.green(`Foi depositado o valor de R$ ${amount} na sua conta!!!`))
}

function getAccount(accountName){
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`,
        {
            encoding: 'utf-8',
            flag: 'r'
        }
    )
    return JSON.parse(accountJSON)
}

function getAccountBalance(){
    inquirer.prompt([{
        name: 'accountName',
        message: 'Qual o nome da sua conta?'
    }]).then((answer =>
    
        {
            const accountName = answer['accountName']
            if(!checkAccount(accountName)){
                return getAccountBalance()
            }

            const accountData = getAccount(accountName)
            console.log(chalk.bgBlue.black(`Olá, o saldo da sua conta é de R$ ${accountData.balance}`))
            operation()
        }
    ))
    .catch(err => console.log(err))
}

function withDrawn(){
    inquirer.prompt([{
        name: 'accountName',
        message: 'Qual nome da sua conta?'
    }
]).then((answer =>{
    const accountName = answer['accountName']

    if(!checkAccount(accountName)){
        return withDrawn()
    }

    inquirer.prompt([{
        name: 'amount',
        message: 'Qual quantia você deseja sacar?'
    }]).then((answer =>{
        const amount = answer['amount']

        removeAmount(accountName, amount)

    })).catch(error => console.log(error))
})).catch(error => console.log(error))
}

function removeAmount(accountName,amount){
    const accountData = getAccount(accountName)
    if(!amount){
        console.log(chalk.bgRed('Ocorreu um erro'))
        return withDrawn()
    }

    if(accountData.balance < amount){
        console.log(chalk.bgRed.black("Valor indisponivel"))
        return withDrawn()
    }

    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData)
    )

    console.log(chalk.green(`Foi realizado um saque de R$${amount} reais da sua conta!`))
    operation()
}