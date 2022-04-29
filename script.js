let div_selected = {}; 
let choose_results = {};

const infoConteiner = document.querySelector("#barra_laterale"); 
const scritta_iniziale = document.createElement('scritta_iniziale'); 
scritta_iniziale.textContent = "Qui appariranno le info riguardo le nazioni da te scelte :D";
scritta_iniziale.classList.add("scritta_iniziale"); 
infoConteiner.appendChild(scritta_iniziale);

const question_number = document.querySelectorAll(".question-name");

const all_div = document.querySelectorAll('.choice-grid div'); 
for(const box of all_div){ 
    box.addEventListener('click', check);
}  

function check(event){

    const div_clicked = event.currentTarget;
    const image = div_clicked.querySelector('.checkbox');

    for(const box of all_div){
        if(box.dataset.questionId === div_clicked.dataset.questionId){
            const image = box.querySelector('.checkbox');
            image.src = "images/unchecked.png";
            
            
            if(box.dataset.choiceId  != div_clicked.dataset.choiceId){ 
                box.classList.add('unselected');
                box.classList.remove('selected');
                div_clicked.classList.remove('unselected');
            }
        }        
    }    

    image.src = "images/checked.png";
    div_clicked.classList.add('selected'); 
    manda_richiesta(div_clicked);
    addMap(div_clicked);
    infoConteiner.innerHTML = ""

}

function addMap(div_s){

    let sentinella = 0;

    div_selected[div_s.dataset.questionId] = div_s.dataset.choiceId;
    
    for(let key in choose_results){
        if(key === div_s.dataset.choiceId){
            sentinella = 1;
            incrementa(div_s.dataset.choiceId);
        }
    } 

    if(sentinella === 0){
        choose_results[div_s.dataset.choiceId] = '1'; 
    }
    
    sentinella = 0; 
    
    controllo();    

}

function incrementa(choice_id){

    choose_results[choice_id]++;

}

function controllo(){
    
   if(Object.keys(div_selected).length === question_number.length){
        rimuoviClickable();   
        stampa_risultato();
        console.log("EUREKA"); //ultima dipendenza da html fixata--> adesso possiamo aggiungere domande, il codice dovrebbe funzionare ugualmente
   }

   console.log(" " + question_number.length);
   console.log(" " + Object.keys(div_selected).length);

}

function rimuoviClickable(){

    for(const box of all_div){
        box.removeEventListener('click', check);
    }
}

function stampa_risultato(){

    const resultContainer = document.querySelector('#risultato');
    const header = document.createElement('h1'); 
    const paragrafe = document.createElement('p');
    const button = document.createElement('button');

    let max = ottieni_risultato(header, paragrafe);

    for(let key in choose_results){
        if(choose_results[key] == max){
            header.textContent = RESULTS_MAP[key].title; 
            paragrafe.textContent = RESULTS_MAP[key].contents;
        }
    }

    button.textContent = "Ricomincia il quiz";
    button.addEventListener('click', onclick);
    resultContainer.appendChild(header);
    resultContainer.appendChild(paragrafe);
    resultContainer.appendChild(button);
}

function onclick(){
    
    const resultContainer = document.querySelector('#risultato');
    resultContainer.innerHTML = "";
    window.scrollTo(0, 0); //funzione js che mi permette di andare attraverso due coordinate in un punto della pagina, in questo caso 0,0 --> inizio della pagina
    infoConteiner.innerHTML = "";
    infoConteiner.appendChild(scritta_iniziale);
    sentinella = 0;
    choose_results = {};
    div_selected = {};

    for(const box of all_div){
        box.querySelector('.checkbox').src = "images/unchecked.png";
        box.classList.remove('selected');
        box.classList.remove('unselected');
        box.addEventListener('click', check);
    }

}

function ottieni_risultato(){

    let max = 0;

    for(let key in choose_results){
        if(choose_results[key] > max){
            max = choose_results[key]; 
        }
    }

    return max; 
}

/*---------------------------------------------------------------------------------API_MHW3--------------------------------------------------------------------------------------------------------------*/ 

function manda_richiesta(div_clicked){
    let url = "https://restcountries.com/v3.1/name/" + div_clicked.dataset.nation;  
    fetch(url).then(onResponse, onFailure).then(onJson); 
}

function onResponse(response){
    return response.json(); 
}

function onFailure(error){
    console.error("" + error);
}

function onJson(json){

    const doc = json[0];
    console.log(json);


    const header_name = document.createElement("h1");
    const header_area = document.createElement("h2");
    const header_pop = document.createElement("h3"); 
    const header_capital = document.createElement("h4");
    const paragrafe_name = document.createElement("p"); 
    const paragrafe_area = document.createElement("p");   
    const paragrafe_pop = document.createElement("p");
    const paragrafe_capital = document.createElement("p");


    header_name.textContent = "Nome comune del Paese scelto:";
    header_area.textContent =  "Ha un'area (km^2) di:";
    header_pop.textContent = "Una popolazione di: ";
    header_capital.textContent = "La capitale è: "; 

    paragrafe_name.textContent =  doc.name.common;
    paragrafe_area.textContent = doc.area;
    paragrafe_pop.textContent = doc.population + " abitanti";
    paragrafe_capital.textContent = doc.capital[0];  

    header_name.classList.add("info_titoli");
    header_area.classList.add("info_titoli");
    header_pop.classList.add("info_titoli");
    header_capital.classList.add("info_titoli");

    paragrafe_name.classList.add("info_paragrafi");
    paragrafe_area.classList.add("info_paragrafi");
    paragrafe_pop.classList.add("info_paragrafi"); 
    paragrafe_capital.classList.add("info_paragrafi");


    infoConteiner.appendChild(header_name);
    infoConteiner.appendChild(paragrafe_name);
    infoConteiner.appendChild(header_area);
    infoConteiner.appendChild(paragrafe_area);
    infoConteiner.appendChild(header_pop); 
    infoConteiner.appendChild(paragrafe_pop);
    infoConteiner.appendChild(header_capital);
    infoConteiner.appendChild(paragrafe_capital);

}

/*-----------------------------------------------------------------API_OAUTH-----------------------------------------------------------------------------*/


