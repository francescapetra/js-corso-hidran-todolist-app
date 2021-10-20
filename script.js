function Todolist() {

    let ultodo, input, btnAll, btnTodo, btnCompleted;

    //questo è l'oggetto che assumerà todoObj
    let todos = [
        // {
        //     id: 0,
        //     text: 'Go shopping',
        //     completed: false
        // },
        // {
        //     id: 0,
        //     text: 'Go to school',
        //     completed: false
        // },
        // {
        //     id: 0,
        //     text: 'Do homework',
        //     completed: true
        // },
    ];

    //dopo aver svuotato l'oggetto, creiamo una funzione per la local storage

    const loadTodosFromLocalStorage = () => {

        const localTodos = localStorage.getItem('todos');

        if (localTodos) {

            const todoArr = JSON.parse(localTodos);

            if (todoArr) {
                
                todos  = todoArr;
            }
        }

    };
    //dobbiamo salvare
    const saveTodosToLocalStorage = () => {

        localStorage.setItem('todos', JSON.stringify(todos));

    };



    const removeTodo = id => {
        //riceve ogni elemento true
        todos = todos.filter(todo => todo.id !== id);
        console.log(todos);


        saveTodosToLocalStorage();

        ultodo.removeChild(ultodo.querySelector('#todo-' + id));
       
    };

    const toggleTodo = (id, ele) => {
        //l'elemento che ha l'id fa uno switch del completed
        todos = todos.map( ele => {
            if (ele.id === id) {
                ele.completed = !ele.completed;
            }
            return ele;
        });
        saveTodosToLocalStorage();
        //console.log(todos);

        const oldClass = ele.classList.contains('completed') ? 'completed' : 'uncomplete';
        const newClass = oldClass === 'completed' ? 'uncomplete' : 'completed';

        ele.classList.replace(oldClass, newClass);


        //se ha la class completed toglila e se non ce l'ha mettila
        ele.parentNode.classList.toggle('completed');
       
    };
    //creaiamo la struttura in html equivalente a questa manuale:
    /*
       <li class="completed">
               <span class="completed"></span>
               Todo1
               <span class="cross"></span>
           </li>
        */
//quando creiamo un li riceviamo il testo, lo stato e l'id e ci serve anche per il delete
    const createLi = ({text, id, completed}) => {
    //creiamo i li dove todoObj è quello che gli passiamo su
        const li = document.createElement('li');
    //l'd è corretto metterlo a stringa
        li.id = 'todo-' + id;
        if (completed) {
            li.classList.add('completed');
        }
    //creiamo gli span check
        const spancheck = document.createElement('span');

    //se nell'oggetto il completed è true add la classe completed oppure uncomlpete
        spancheck.classList.add(completed ? 'completed' : 'uncomplete');

    //creiamo gli span cross e aggiungi la classe cross e aggiungiamo l'evento al click
        const spancross = document.createElement('span');
        spancross.classList.add('cross');

        spancheck.addEventListener('click', (e) => {
            toggleTodo(id, e.target);
        });

        spancross.addEventListener('click', (e) => {
            removeTodo(id);
        });


    ///creiamo un elemento di testo per mettere il text dell'oggetto sopra
        const textNode = document.createTextNode(text);

    //attacchiamo la struttura
        li.appendChild(spancheck);
        li.appendChild(textNode);
        li.appendChild(spancross);

    //ritorniamo i li completi
        return li;

       
    };

    //funzione helper per il keyup della input
    const addNewTodo = (todo) => {
        
        todos.unshift(todo);
        saveTodosToLocalStorage();

        const li = createLi(todo);
        const firstLi = ultodo.firstChild;

        if (!firstLi) {
            ultodo.appendChild(li);
        }else {
            ultodo.insertBefore(li, firstLi);
        }
        //console.log(todos);   
    }


    const addTodo = (e) =>{
        //alert(e.target.value);
        //console.log(e);//seleziona l'evento resta in ascolto keyup keycode 13

        const key = e.keyCode,
            ele = e.target;
        //console.log(key,ele);
        
        if (key === 13 && ele.value.trim().length > 2 ) {
            
            const todo = {
                text: ele.value.trim(),
                id: todos.length,
                completed: false,
            };

            addNewTodo(todo);
            ele.value= ""; //puliamo il campo
        }
    };


//restituisce i parziali
    const renderTodos = (todoType) => {
    //pulire la lista sennò aggiunge cliccando i bottoni, quindi cerca tutti gli li in lista   
        const lis= ultodo.querySelectorAll('li');

        if (lis) {
    //riceviamo gli elementi e puliamo ogni volta chiamiamo il  metodo render      
            lis.forEach( li => ultodo.removeChild(li));
        }

    //nel bottone la logica è tornare true o false a seconda del todo
        const currentTodos = todos.filter(todo =>{

            if (todoType === "all"){

                return todo;
            }

            return (todoType === "completed") ? todo.completed : !todo.completed;
        });

        
        //prendo l'oggetto todos faccio un map per creare un array e come metodo passo la creazione degli li di sopra
        currentTodos.map(todo => createLi(todo))
        //ciclo con un foreach per appendere all'ul
            .forEach(li => ultodo.appendChild(li));

    }

    const toggleBtnClasses = (target, btns = []) => {
    //attivo la classe e metto il disabled
        target.classList.toggle('active');
        target.setAttribute('disabled', true);
        //agli altri rimuovo classe e metto disabled
        btns.forEach(btn => {
            btn.removeAttribute('disabled');
            btn.classList.remove('active');

        });
    }
    const addListeners = () => {

        btnAll = document.querySelector('#btnAll');

        btnCompleted = document.querySelector('#btnCompleted');

        btnTodo = document.querySelector('#btnTodo');


        btnAll.addEventListener('click', e => {

            toggleBtnClasses(e.target, [btnTodo, btnCompleted]);
            renderTodos('all');
        });

        btnCompleted.addEventListener('click', e => {

            toggleBtnClasses(e.target, [btnAll, btnTodo]);
            renderTodos('completed');
        });

        btnTodo.addEventListener('click', e => {

            toggleBtnClasses(e.target, [btnAll, btnCompleted]);
            renderTodos('uncomplete');

        });
    };

//restituisce tutta la lista
    const renderTodoList = () => {

        loadTodosFromLocalStorage();
    
    //creo una function e seleziono l'ul dell'html
        ultodo = document.querySelector('ul#todolist');

    //se l'ul non esiste già lo creo
        if (!ultodo) {
            ultodo = document.createElement('ul');
            ultodo.id = 'todolist';//metto l'id
            document.body.appendChild(ultodo);//lo appendo al body
        }
        //const lis = todos.map( todo => createLi(todo));
        renderTodos('all');

    //facciamo l'accesso all'elemento input
        input = document.querySelector('#todo');
        //if ! exist
        if (!input) {
            input = document.createElement('input');
            input.id = 'todo';//metto l'id
            input.name = 'todo';
            input.placeholder = 'Add new Todo';
            ultodo.parentNode.insertBefore(input, ultodo);//lo appendo aggiungendolo prima della lista
        }
    //aggiungiamo un olistner alla input per restare in ascolto del keyup, riferimento alla funzione senza () non esecuzione
        
        input.addEventListener('keyup', addTodo);

        //fare il disabled dei pulsanti quando sono cliccati
        addListeners();
    };

    return {
        getTodos: function () {
            return todos; //return di function Todolist() wrapper
        },
        init: function () {
            renderTodoList();//return di function renderTodos() appende la struttura all'ul
        }

    }
}
//renderTodos();
const myTodo = Todolist();//salvo il return nella variabile

myTodo.init();//prendo il return e lo rendo alla function principale

//console.log(myTodo.getTodos());//array dell'oggetto (3) [{…}, {…}, {…}]

console.log(myTodo);//{getTodos: ƒ, init: ƒ}
                    // getTodos: ƒ()
                    // init: ƒ()
                    // [[Prototype]]: Object