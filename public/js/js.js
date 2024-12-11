console.log('Fronted loaded');
import { fetchRugbyData } from "./main-requester.js";
import { capitalize } from "./helper-functions.js";

async function entryPing(){
    let ping = await fetchRugbyData('m',{memberid:1},0)
    console.log('Ping Request: ', ping);
    const gameDate = document.getElementById('game-date')

    gameDate.innerHTML = `Season: ${ping.gameDate.season} 
    | Round: ${ping.gameDate.round} 
    | Day: ${ping.gameDate.day}`
}
entryPing();

const apiSubmitBtn = document.getElementById('api-submit')

let globals = {
    _mainKey:0,
    _memberkey:0,
    _teamid:0,
}

if (localStorage.getItem("memberID")!= null){
    const apiForm = document.getElementById('api-form')
    apiForm.classList.add('hide')
    globals._memberkey = localStorage.getItem("memberID");
    globals._mainKey = localStorage.getItem("mainKey");
    updateManagerInfo(globals._memberkey, globals._mainKey);
}


apiSubmitBtn.addEventListener('click',function(e){
    const form = document.getElementById('api-form');
    const apikey = document.getElementById('api-key').value;

    const match = apikey.match(/m=(\d+)&mk=([a-z0-9]+)/i);
    if (match && match[1]) {
        globals._memberkey = match[1];
        localStorage.setItem("memberID", match[1])
        globals._mainKey = match[2];
        localStorage.setItem("mainKey", match[2])
        console.log(`Member ID : ${globals._memberkey}`);
        console.log(`Main Key : ${globals._mainKey}`);
        form.classList.add('hide');
    } else {
        console.log("No match found.");
    }
    
    updateManagerInfo(globals._memberkey, globals._mainKey);
    
})

async function updateManagerInfo(member, main){
    let managerData = await fetchRugbyData('m',{memberid:member,m:member,mk:main,},0)
    console.log(managerData);
    const welcomeDisplay = document.getElementById('welcome')

    welcomeDisplay.innerHTML = `Welcome, ${capitalize(managerData.members[member].username)}! <hr />`;
    globals._teamid = managerData.members[member]._teamid
    localStorage('teamId', managerData.members[member]._teamid)
    managerData.members[member].premium == 1 ? welcomeDisplay.innerHTML += "*" : " ";

    generateOptions(member, main, globals._teamid)
}

function generateOptions(member, main, teamid){

}