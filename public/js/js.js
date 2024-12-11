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
    globals._teamid = managerData.members[member].teamid
    localStorage.setItem('teamId', managerData.members[member]._teamid)
    managerData.members[member].premium == 1 ? welcomeDisplay.innerHTML += "*" : " ";

    generateOptions(member, main, globals._teamid)
}

const displayArea = document.getElementById('display-area');

function generateOptions(member, main, param_teamid){
    // console.log(`member key ${member}`)
    // console.log(`main key ${main}`)
    // console.log(`team key ${param_teamid}`)
    // Select the parent element where the button will be appended
    const parentElement = document.getElementById('options'); // Change to your desired container ID

    // Create a new button element
    const viewTeamButton = document.createElement('button');
    const viewClubButton = document.createElement('button');

    // Set attributes and text content for the button
    viewTeamButton.textContent = 'Squad'; // Set the button's label
    viewTeamButton.id = 'team-button';   // Optional: Set an ID for the button
    viewTeamButton.className = 'btn';       // Optional: Add a class for styling

    viewClubButton.textContent = "Team";
    viewClubButton.id = 'club-button'
    viewClubButton.className = 'btn'

    // Add an event listener to the button
    viewTeamButton.addEventListener('click', async () => {
        displayArea.innerHTML = `Fetching...`
        let team = await fetchRugbyData('p',{teamid:param_teamid, m:member, mk:main,},0)
        // alert('Button was clicked!');
        let SortedTeam = Object.values(team.players)
        console.log(SortedTeam);
        
        displayTeam(SortedTeam);
        
    });

    viewClubButton.addEventListener('click', async () => {
        displayArea.innerHTML = `Fetching...`
        let club = await fetchRugbyData('t',{teamid:param_teamid,m:member,mk:main,},0)
        displayClub(club)
    })

    // Append the button to the parent element
    parentElement.appendChild(viewTeamButton);
    parentElement.appendChild(viewClubButton);


}

function displayTeam(team){
    const parent = displayArea;
    displayArea.innerHTML = ``
    team.forEach(player => {
        let header = document.createElement('div')
        header.className = 'player-header'
        header.textContent = `${player.name}`
        parent.appendChild(header)
        let untrainables = document.createElement('div')
        untrainables.textContent = `${Number(player.csr).toLocaleString()} CSR 
        | ${player.age} yo (${player.birthday})
        | ${Number(((player.salary/16).toFixed(0))).toLocaleString()}p.w 
        | ${player.height}cm 
        | ${player.weight}kg
        | ${player.nationality}
        `
        parent.appendChild(untrainables)
    });
}

function displayClub(club){
    const parent = displayArea;
    displayArea.innerHTML = ``;
    let header = document.createElement('div')
    header.textContent = club.teams[globals._teamid].name
    parent.appendChild(header)
}