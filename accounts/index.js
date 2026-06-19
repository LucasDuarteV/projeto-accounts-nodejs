const chalk = require('chalk')
const inquirer = require('inquirer')

const fs = require('fs')
const { error } = require('console')

operation()

function operation(){
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
    }]).then((answer =>{
        console.log(answer)
    })).catch(error => {
        console.log(error)
    })
}
