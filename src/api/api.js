/** All DOM elements */
const resultList = document.getElementById('resultList');
const inputField = document.getElementById('search');
const searchHistory = document.getElementById('searchHistory');
const deleteSearchHistory = document.getElementById('deleteSearchHistory');
const teamResultContainer = document.getElementById('teamResultContainer');
const teamInfoHeader = document.getElementById('teamInfoHeader')
const regex = RegExp('^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$');
const baseURL = 'https://www.thesportsdb.com/api/v1/json/1/searchteams.php';

//function to fetch API data based on input
function fetchData (searchquery) {
  return fetch(baseURL + '?t=' + searchquery)
    .then(function (response) {
      return response.json();
    })
    .then(function (myJson) {
      const data = myJson.teams;
      return data;
    });
}

//Gets input from user, checks user input against regex and runs renderAutocomplete based on result from fetch while using a "debounce"
const autoComplete = debounce(async function () {
    resultList.innerHTML = '';
    const searchquery = inputField.value;
    if(searchquery.length >= 2 && regex.test(searchquery)) {
      const result = await fetchData(searchquery);
      renderAutocomplete(result);
    }
}, 200)


//receives the result from the API  fetch and makes the values available as an autocomplete feature
const renderAutocomplete = results => {
  resultList.innerHTML = '';
    if(results){
    results.forEach(item => {
      const itemLi = document.createElement('li');
      itemLi.classList.add('item');
      itemLi.innerHTML = item.strTeam;
      itemLi.setAttribute('tabindex', '0');
      resultList.appendChild(itemLi);
      itemLi.addEventListener('click', function (event) {
        event.target.style.display = 'none';
        getSelectedTeam(encodeURIComponent(event.target.innerHTML));

        const searchItem = document.createElement('li');
        searchItem.classList.add('search-history-item');

        const clickResult = document.createElement('span');
        clickResult.innerHTML = event.target.innerHTML;

        let timestamp = createTimeStamp(new Date());
        let timestampElement = document.createElement('span');
        timestampElement.innerHTML = timestamp;

        let deleteSearchButton = document.createElement('button');
        deleteSearchButton.innerHTML = 'x';
        deleteSearchButton.addEventListener('click', function (event) {
          event.target.parentNode.remove();
        })

        searchItem.append(clickResult, timestampElement, deleteSearchButton);
        searchHistory.appendChild(searchItem);
      });
    })
  }
}

//creates a debounce that delays a function based on input or default
function debounce (func, interval) {
  var timeout;
  return function () {
    var context = this, args = arguments;
    var later = function () {
      timeout = null;
      func.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, interval || 2000);
  }
}

//clears the search history & teamResul container 
function clearHistory () {
  searchHistory.innerHTML = '';
  teamResultContainer.innerHTML = '';
  teamInfoHeader.classList.add('team-info-header');
}

//fetches a team based on user input
async function getSelectedTeam (search) {
  const result = await fetchData(search);
  const filteredResult = result.filter(item => item.strTeam === decodeURIComponent(search));
  printTeam(filteredResult);
}

//receives a team based on user input and creates a card based on that team 
function printTeam(team) {
  teamInfoHeader.classList.remove('team-info-header');
  teamResultContainer.innerHTML = '';
  let teamImageUrl = team[0].strTeamBadge;
  let teamDescription = team[0].strDescriptionEN;
  let teamName = team[0].strTeam;
  let teamArena = team[0].strStadium
  let teamManager = team[0].strManager
  

  let teamimageEl = '';
    if(teamImageUrl == null || teamImageUrl == '') {
      teamimageEl = document.createElement('p');
      teamimageEl.innerHTML = 'no badge to display';
    }else {
      teamimageEl= document.createElement('img');
      teamimageEl.setAttribute('src', teamImageUrl); 
      teamimageEl.setAttribute('alt', team[0].strTeam + ' badge');
  }

  let teamNameEl = document.createElement('p');
  teamNameEl.innerHTML = 'Team name: ' + teamName;


  let teamArenaEl = document.createElement('p');
  if(teamArena == null || teamArena == '') {
    teamArenaEl.innerHTML = 'No arena found';
  } else {
    teamArenaEl.innerHTML = 'Home arena: ' + teamArena;
  }

  let teamManagerEl = document.createElement('p');
  if(teamManager == null || teamManager == '') {
    teamManagerEl.innerHTML = 'No manager found';
  }else {
    teamManagerEl.innerHTML = 'Manager: ' + teamManager;
  }
  
  let teamDescriptionEl = document.createElement('p');
  teamDescriptionEl.innerHTML = teamDescription;

  let teamInfoContainer = document.createElement('section');
  teamInfoContainer.setAttribute('class', 'team-info-container');
  teamInfoContainer.append(teamimageEl, teamNameEl, teamManagerEl, teamArenaEl);
  
  
  let teamDescriptionContainer = document.createElement('section');
  teamDescriptionContainer.setAttribute('class', 'team-description-container');
  teamDescriptionContainer.append(teamDescriptionEl);

  teamResultContainer.append(teamInfoContainer, teamDescriptionContainer);
}

//function that receives Date.now() object and returns a string with a timestamp
function createTimeStamp(date) {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let minutes = date.getMinutes();
  let sec = date.getSeconds();
  let timestamp = year + '/' + month + '/' + day + ', ' + hour + ':' + minutes + ':' + sec; 
  return timestamp;
}


//eventlistners
inputField.addEventListener('input', autoComplete);
deleteSearchHistory.addEventListener('click', clearHistory);
