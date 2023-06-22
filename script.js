const bot = './assets/bot.svg' 
const user = './assets/user.svg'

const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

let loadInterval

// Prints dots in a sequental manner as it waits for a response
let loader = element => {
    element.textContent = ''

    loadInterval = setInterval(() => {
        element.textContent += '.'

        if (element.textContent === '....') {
            element.textContent = ''
        }
    }, 300)
}

// Mimics how ChatGPT displays its responses, one character at a time
let typeText = (element, text) => {
    let index = 0

    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index)
            index++
        } else {
            clearInterval(interval)
        }
    }, 20)
}

// Each AI response gets an unique ID
let generateUniqueId = () => {
    const timestamp = Date.now()
    const randomNumber = Math.random()
    const hexadecimalString = randomNumber.toString(16)

    return `id-${timestamp}-${hexadecimalString}`
}

let chatStripe = (isAi, value, uniqueId) => {
    return (
        `
        <div class="wrapper ${isAi ? 'ai' : 'user'}">
            <div class="chat">
                <div class="profile">
                    <img 
                        src=${isAi ? bot : user}
                        alt=${isAi ? 'bot' : 'user'}
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
        `
    )
}

let setEnableForm = b => {
    if (b) {
        form.querySelector('textarea').removeAttribute('disabled')
        form.querySelector('button').removeAttribute('disabled')
    } else {
        form.querySelector('textarea').setAttribute('disabled', '')
        form.querySelector('button').setAttribute('disabled', '')
    }
}

const handleSubmit = async e => {
    e.preventDefault()
    const data = new FormData(form)

    chatContainer.innerHTML += chatStripe(false, data.get('prompt'), 0)

    form.reset()

    const uniqueId = generateUniqueId()
    chatContainer.innerHTML += chatStripe(true, '', uniqueId)

    chatContainer.scrollTop = chatContainer.scrollHeight

    const messageDiv = document.getElementById(uniqueId)

    loader(messageDiv)

    // disables form until a response is received
    setEnableForm(false)

    // should focus the form at the end
    // setEnableForm(true)
    // form.querySelector('textarea').focus() 
}

form.addEventListener('submit', handleSubmit)
form.addEventListener('keydown', e => {
    if (e.keyCode == 13) {
        handleSubmit(e)
        return // returns so a newline is ignored
    }
})

form.querySelector('textarea').focus()