
const form = document.querySelector('form')
const amount = document.getElementById('amount') 
const expense = document.getElementById('expense')
const category = document.getElementById('category')

//seleciona o elemento ul que contem a lista de gastos
const expenseList = document.querySelector('ul')
const expensesTotal = document.querySelector('aside header h2 ')
const expensesQuantity = document.querySelector('aside header p span')

//'oninput' é um evento que ocorre quando o valor do input é alterado
amount.oninput = () => {    
  let value = amount.value.replace(/\D/g, '') //remove tudo que nao for numero

  // Transforma o valor em centavos
  value = Number(value)/100  

  amount.value = FormatCurrencyBRL(value);
}
//função que formata o valor para o padrão brasileiro
function FormatCurrencyBRL(value) {

  //formata o valor  para o padrão brasileiro
  value = value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })

  return value;
}
//'onsubmit' é um evento que ocorre quando o formulario é enviado
form.onsubmit = (event) => {
  event.preventDefault()

  //cria um novo objeto com os dados do formulario
  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date()
  }
  expenseAdd(newExpense)
}
//função que adiciona uma nova despesa
function expenseAdd (newExpense) {
  try {
    //cria um novo elemento 'li' com os dados do novo despesa(ul)
    const expenseItem = document.createElement('li')
    expenseItem.classList.add('expense')

    //cria um novo elemento 'img' com os dados do novo despesa(ul)
    const expenseIcon = document.createElement('img')
    expenseIcon.setAttribute('src', `./src/img/${newExpense.category_id}.svg`) 
    expenseIcon.setAttribute('alt', newExpense.category_name)

    //cria um novo elemento 'div' com os dados do novo despesa(ul)
    const expenseInfo = document.createElement('div')
    expenseInfo.classList.add('expense-info')

    //cria um novo elemento 'strong' com os dados do novo despesa(ul)
    const expenseName = document.createElement('strong')
    expenseName.textContent = newExpense.expense

    //cria um novo elemento 'span' com os dados do novo despesa(ul)
    const expenseCategory = document.createElement('span')
    expenseCategory.textContent = newExpense.category_name

    const expenseAmount = document.createElement('span')
    expenseAmount.classList.add('expense-amount')
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$","")}`

    const removeIcon = document.createElement('img')
    removeIcon.classList.add('remove-icon')
    removeIcon.setAttribute('src', './src/img/remove.svg')
    removeIcon.setAttribute('alt', 'Remover despesa')

    // Adiciona as informações no item da lista
    expenseInfo.append(expenseName, expenseCategory)
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)


    expenseList.append(expenseItem)

    // Remove a despesa
    formClear()

    updateTotals()

  } catch (error) {
    alert('Erro ao adicionar despesa')
    console.log(error)
  }
}
//função que atualiza o total de despesas
function updateTotals() {
  try {
    const items = expenseList.children

    expensesQuantity.textContent = `${items.length} ${items.length > 1 ? 'despesas' : 'despesa'}` 

    let total = 0

    for (let i = 0; i < items.length; i++) {
      const itemAmount = items[i].querySelector('.expense-amount').textContent.replace('R$', '')

      let value = itemAmount.replace(/[^\d,]/g, '').replace(',', '.')


      value = parseFloat(value)

      if(isNaN(value)) {
        return alert('Erro ao atualizar total')
      }

      total += Number(value) //total = total + value

    }

    const symbolBRL = document.createElement('small')
    symbolBRL.textContent = 'R$'

    total =  FormatCurrencyBRL(total).toUpperCase().replace('R$', '')

    expensesTotal.innerHTML = ""

    expensesTotal.append(symbolBRL, total)

  }catch (error) {
    alert('Erro ao atualizar total')
    console.log(error)
  }
}
//evento que ocorre quando o usuario clica no botão de remover despesa
expenseList.addEventListener('click', (event) => {
  if(event.target.classList.contains('remove-icon')) {
    const item = event.target.closest('.expense')
    item.remove()
  }

  updateTotals()
})
//função que limpa o formulario
function formClear() {
  amount.value = ''
  expense.value = ''
  category.value = ''

  expense.focus()

}
