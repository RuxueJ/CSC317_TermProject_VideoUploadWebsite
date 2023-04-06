var url = "https://jsonplaceholder.typicode.com/albums/2/photos";

async function fetchWithString(){

    try{
        var response = await fetch(url);
        var data = await response.json();
        var number = data.length; 
        var numberTag = document.getElementById("number-tag");
        numberTag.textContent = "Number of Photos: "+number;
        var htmlString = data.reduce(function(prev, element){

        return prev + `<div class = "card">
        <img class = "card-image" src="${element.thumbnailUrl}" >
        <p class = "card-title">${element.title}</p>
      </div>`
        }, "");
        document.getElementById("picture-container").innerHTML = htmlString;
        // console.log(htmlString);

        let cards = document.getElementsByClassName('card');
        [...cards].forEach(function(element){
            element.addEventListener('click',fadeOut);
            element.addEventListener('click',function(){
                console.log(number);
                number--;
                numberTag.textContent = "Number of Photos: "+ number;
            });
        })

    }catch(error){
        console.log(error);
    }
} 

function fadeOut(ev) {
    var divEle =  ev.currentTarget;
    let timer = setInterval(function(){

        let ele = divEle.querySelector('img');
        
        // console.log(currentOpacity);
        if(ele.style.opacity==""){
            ele.style.opacity=1
        }
        let currentOpacity = ele.style.opacity;
        if(currentOpacity>0){
            ele.style.opacity = (currentOpacity - 0.2).toString();
            // console.log(ele.style.opacity)
        }
        else{ 
            clearInterval(timer);
            divEle.remove();
            // console.log(--number);
            }
   }, 10)
  }

fetchWithString();
