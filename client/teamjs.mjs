const POKÉAPI_URL_BERRIES = "https://pokeapi.co/api/v2/berry";
const POKÉAPI_URL_ITEMS = "https://pokeapi.co/api/v2/item";
const POKÉAPI_URL_MOVES = "https://pokeapi.co/api/v2/move";
const POKÉAPI_URL_POKÉMON = "https://pokeapi.co/api/v2/pokemon";
const POKÉAPI_URL_NATURES = "https://pokeapi.co/api/v2/nature";
const POKÉAPI_URL_TYPES = "https://pokeapi.co/api/v2/type";

let searchBar;
let teamName;
let teamID;
let results;
let content;
let pokémon;
let moves;
let berries;
let items;
let natures;
let types;

let memberCount = 0;
let deleteButtons;
let nicknameBars;
let levelBars;
let moveSelectors;
let abilityBars;
let itemBars;
let natureBars;

let selectedSpecies;
let chosenNicknames;
let chosenLevels;
let selectedMoves;
let selectedAbilities;
let selectedItems;
let selectedNatures;

let baseHPSections;
let HPIVBars;
let HPEVBars;
let HPEVSliders;
let trueHPSections;
let HPIVs;
let HPEVs;

let baseAttackSections;
let attackIVBars;
let attackEVBars;
let attackEVSliders;
let attackNatureMultipliers;
let trueAttackSections;
let attackIVs;
let attackEVs;

let baseDefenseSections;
let defenseIVBars;
let defenseEVBars;
let defenseEVSliders;
let defenseNatureMultipliers;
let trueDefenseSections;
let defenseIVs;
let defenseEVs;

let baseSpecialAttackSections;
let specialAttackIVBars;
let specialAttackEVBars;
let specialAttackEVSliders;
let specialAttackNatureMultipliers;
let trueSpecialAttackSections;
let specialAttackIVs;
let specialAttackEVs;

let baseSpecialDefenseSections;
let specialDefenseIVBars;
let specialDefenseEVBars;
let specialDefenseEVSliders;
let specialDefenseNatureMultipliers;
let trueSpecialDefenseSections;
let specialDefenseIVs;
let specialDefenseEVs;

let baseSpeedSections;
let speedIVBars;
let speedEVBars;
let speedEVSliders;
let speedNatureMultipliers;
let trueSpeedSections;
let speedIVs;
let speedEVs;

let teamSelector;

// This method readies everything.
const init = async () => {
    searchBar = document.querySelector("#SearchBar");
    results = document.querySelector("#results");
    content = document.querySelector("#content");
    teamName = document.querySelector("#TeamName");
    teamSelector = document.querySelector("#TeamSelector");

    // First, every Pokémon will be inserted into the results column.
    try {
        let result;

        for (let i = 0; i < pokémon.length; i++) {
            result = pokémon[i];

            // The result is displayed. The name, types, and sprite of the Pokémon will be included.
            line += `<div class='result'>`;
            line += `<img class='resultsprite' src="${result["sprites"].front_default}"`;
            line += `" alt="">`

            line += `<div class='resultname'>`;
            line += `${reformatName(result.name)}`;
            line += `</div>`;

            line += `<div class='types'>`;
            for (let j = 0; j < result["types"].length; j++) {
                let type = result["types"][j]["type"].name;
                line += `<div class='type'>`;
                line += `${reformatName(type)}`;
                line += `</div>`;
            }
            line += `</div>`;

            // We also need to show the abilities each Pokémon can have.
            line += `<div class='resultabilities'>`;
            for (let j = 0; i < result["abilities"].length; j++) {
                line += `<p>${reformatName(result["abilities"][j]["ability"].name)}</p>`;
            }
            line += `</div>`;

            // We also show the base stats.
            line += `<p class="ResultHPLabel">HP</p>`;
            line += `<p class="ResultAttackLabel">Attack</p>`;
            line += `<p class="ResultDefenseLabel">Defense</p>`;
            line += `<p class="ResultSpecialAttackLabel">Special Attack</p>`;
            line += `<p class="ResultSpecialDefenseLabel">Special Defense</p>`;
            line += `<p class="ResultSpeedLabel">Speed</p>`;

            line += `<p class="ResultBaseHP">${result["stats"][0].base_stat}</p>`;
            line += `<p class="ResultBaseAttack">${result["stats"][1].base_stat}</p>`;
            line += `<p class="ResultBaseDefense">${result["stats"][2].base_stat}</p>`;
            line += `<p class="ResultBaseSpecialAttack">${result["stats"][3].base_stat}</p>`;
            line += `<p class="ResultBaseSpecialDefense">${result["stats"][4].base_stat}</p>`;
            line += `<p class="ResultBaseSpeed">${result["stats"][5].base_stat}</p>`;

            // Each result will have the name, as formatted for use with the API, hidden within it, mostly for the sake of adding to the team.
            line += `<div class="HiddenName">${result.name}</div>`;

            line += `</div>`;
        }
    }
    catch (error) {
        console.error("Error loading data:", error);
    }

    searchBar.addEventListener('keyup', search);
    teamSelector.addEventListener('change', loadTeam);
    document.querySelector("#TeamSave").addEventListener('click', saveTeam);

    let isTeamSaved = false;

    // for (let i = 0; i < document.querySelector("#TeamSelector").options; i++) {
    //     if (teamSelector.value === teamID) {
    //         isTeamSaved = true;
    //     }
    // }

    // We pull the teams from the server, then insert them into the team selector.
    const response = await fetch('/getTeams');
    const teamData = await response.json();

    Object.values(teamData).forEach(team => {
        teamSelector.innerHTML += `<option value="${team.id}">${team.name}</option>`;
    });

    teamSelector.addEventListener('change', async () => {
        teamID = teamSelector.value;
        const team = await loadTeam(teamSelector.value);
        displayLoadedTeam(team);
    });

    // There will be an alert if a team isn't saved manually.
    document.querySelector("#NewTeam").addEventListener('click', () => {
        if (!isteamSaved) {
            if (confirm("This team is unsaved. Are you sure you want to create a new team?")) {
                content.innerHTML = "";
                teamID = generateTeamID();
            }
        }
    });
}

// This method loads six whole endpoints into lists of JSON files for later use.
const loadAllData = async () => {
    try {
        pokémon = await loadData(POKÉAPI_URL_POKÉMON);
        moves = await loadData(POKÉAPI_URL_MOVES);
        berries = await loadData(POKÉAPI_URL_BERRIES);
        items = await loadData(POKÉAPI_URL_ITEMS);
        natures = await loadData(POKÉAPI_URL_NATURES);
        types = await loadData(POKÉAPI_URL_TYPES);
    } catch (error) {
        console.error("Error loading data:", error);
        throw error;
    }
}

// A helper function that generates a random ID to save a new team under.
const generateTeamID = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let teamID = ""

    for (let i = 0; i < 14; i++) {
        teamID += Math.round(Math.random() * characters.length);
    }

    return teamID;
}

// Handles responses.
const handleResponse = async (response, parseResponse) => {
    switch (response.status) {
        case 200:
            console.log(`${response.status}`);
            break;
        case 201:
            console.log(`${response.status}`);
            break;
        case 204:
            console.log(`${response.status}`);
            return;
        case 400:
            console.log(`${response.status}`);
            break;
        case 404:
            console.log(`${response.status}`);
            break;
        default:
            console.log(`${response.status}`);
            break;
    }

    if (parseResponse && response.status === 200) {
        let obj = await response.json();
        displayLoadedTeam(json.parse(obj));
    }
};

// Saves the current team to the server.
const saveTeam = async (content) => {
    // First, we start setting up the JSON; we'll have the ID and name at the highest level, then the team.
    let savedTeam = {
        'teamID': teamID,
        'teamName': teamName,
        'team': {}
    }

    // This loop will add the members to the team section.
    for (let i = 0; i < memberCount; i++) {
        savedTeam.team.push(
            `'member${i + 1}': {
                'nickname': ${nicknameBars[i].value},
                'species': ${selectedSpecies[i]},
                'ability': ${selectedAbilities[i]},
                'item': ${selectedItems[i]},                
                'nature': ${selectedNatures[i]},
                'IVs': {
                    'HP': ${HPIVs[i]},
                    'attack': ${attackIVs[i]},
                    'defense': ${defenseIVs[i]},
                    'special_attack': ${specialattackIVs[i]},
                    'special_defense': ${specialDefenseIVs[i]},
                    'speed': ${speedIVs[i]}
                }
                'EVs': {
                    'HP': ${HPEVs[i]},
                    'attack': ${attackEVs[i]},
                    'defense': ${defenseEVs[i]},
                    'special_attack': ${specialattackEVs[i]},
                    'special_defense': ${specialDefenseEVs[i]},
                    'speed': ${speedEVs[i]}
                }
                'moves': {
                    'move_a': ${moveSelectors[i * 4]},
                    'move_b': ${moveSelectors[(i * 4) + 1]},
                    'move_c': ${moveSelectors[(i * 4) + 2]},
                    'move_d': ${moveSelectors[(i * 4) + 3]}
                }
            }`
        );
    }

    // Handles the POST response.
    let response = await fetch(`/saveTeam/${teamID}`, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
        },
        body: savedTeam,
    });

    handleResponse(response);
};

// Loads a team from the server.
const loadTeam = async (teamID) => {
    let response = await fetch(`/getTeams/${teamID}`, {
        headers: {
            'Accept': 'application/json'
        },
    });

    handleResponse(response, method === 'get');
}

// This will load a saved team to the page.
const displayLoadedTeam = (teamJSON) => {
    // First, we reset the member count.
    memberCount = 0;
    let member;

    // We start by adding a blank section for each Pokémon.
    for (let i = 0; i < teamJSON.team.length; i++) {
        for (let j = 0; j < pokémon; j++) {
            if (teamJSON['team'][`member${i}`][species] === pokémon[i]["species"].name) {
                member = pokémon[i];
            }
        }
        addPokémon(pokémon);
    }

    // This section will load the data from each individual Pokémon where it needs to be.
    for (let i = 0; i < teamJSON.team.length; i++) {
        nicknameBars[i].value = teamJSON.team[i].nickname;
        levelBars[i].value = teamJSON.team[i].level;
        moveSelectors[i * 4].value = teams[body.id].team[i].moves.move_a;
        moveSelectors[(i * 4) + 1].value = teams[body.id].team[i].moves.move_b;
        moveSelectors[(i * 4) + 2].value = teams[body.id].team[i].moves.move_c;
        moveSelectors[(i * 4) + 3].value = teams[body.id].team[i].moves.move_d;
        abilityBars[i].value = teams[body.id].team[i].ability;
        itemBars[i].value = teams[body.id].team[i].item;
        natureBars[i].value = teams[body.id].team[i].nature;
        HPIVBars[i].value = teams[body.id].team[i].IVs.HP;
        HPEVBars[i].value = teams[body.id].team[i].EVs.HP;
        HPEVSliders[i].value = teams[body.id].team[i].EVs.HP;
        attackIVBars[i].value = teams[body.id].team[i].IVs.attack;
        attackEVBars[i].value = teams[body.id].team[i].EVs.attack;
        attackEVSliders[i].value = teams[body.id].team[i].EVs.attack;
        defenseIVBars[i].value = teams[body.id].team[i].IVs.defense;
        defenseEVBars[i].value = teams[body.id].team[i].EVs.defense;
        defenseEVSliders[i].value = teams[body.id].team[i].EVs.defense;
        specialAttackIVBars[i].value = teams[body.id].team[i].IVs.special_attack;
        specialAttackEVBars[i].value = teams[body.id].team[i].EVs.special_attack;
        specialAttackEVSliders[i].value = teams[body.id].team[i].EVs.special_attack;
        specialDefenseIVBars[i].value = teams[body.id].team[i].IVs.special_defense;
        specialDefenseEVBars[i].value = teams[body.id].team[i].EVs.special_defense;
        specialDefenseEVSliders[i].value = teams[body.id].team[i].EVs.special_defense;
        speedIVBars[i].value = teams[body.id].team[i].IVs.speed;
        speedEVBars[i].value = teams[body.id].team[i].EVs.speed;
        speedEVSliders[i].value = teams[body.id].team[i].EVs.speed;

        attackNatureMultipliers[i].innerHTML = 1.0;
        defenseNatureMultipliers[i].innerHTML = 1.0;
        specialAttackNatureMultipliers[i].innerHTML = 1.0;
        specialDefenseNatureMultipliers[i].innerHTML = 1.0;
        speedNatureMultipliers[i].innerHTML = 1.0;

        // This section properly sets up the nature modifiers.
        for (let j = 0; j < natures.length; j++) {
            if (natureBars.value === natures[j].name) {
                nature = natures[j];
            }
        }

        if (nature["increased_stat"].name === "attack") {
            attackNatureMultipliers[i].innerHTML = 1.1;
        }
        else if (nature["increased_stat"].name === "defense") {
            defenseNatureMultipliers[i].innerHTML = 1.1;
        }
        else if (nature["increased_stat"].name === "special_attack") {
            specialAttackNatureMultipliers[i].innerHTML = 1.1;
        }
        else if (nature["increased_stat"].name === "special_defense") {
            specialDefenseNatureMultipliers[i].innerHTML = 1.1;
        }
        else if (nature["increased_stat"].name === "speed") {
            speedNatureMultipliers[i].innerHTML = 1.1;
        }

        if (nature["decreased_stat"].name === "attack") {
            attackNatureMultipliers[i].innerHTML = 0.9;
        }
        else if (nature["decreased_stat"].name === "defense") {
            defenseNatureMultipliers[i].innerHTML = 0.9;
        }
        else if (nature["decreased_stat"].name === "special_attack") {
            specialAttackNatureMultipliers[i].innerHTML = 0.9;
        }
        else if (nature["decreased_stat"].name === "special_defense") {
            specialDefenseNatureMultipliers[i].innerHTML = 0.9;
        }
        else if (nature["decreased_stat"].name === "speed") {
            speedNatureMultipliers[i].innerHTML = 0.9;
        }

        // The stats are recalculated here.
        trueHPSections[i].innerHTML = Math.floor(((2 * Number(baseHPSections[i].innerHTML) + HPIVs[i] + Math.floor(HPEVs[i] / 4)) * chosenLevels[i]) / 100) + chosenLevels[i] + 10;
        trueAttackSections[i].innerHTML = Math.floor((Math.floor(((2 * Number(baseAttackSections[i].innerHTML) + attackIVs[i] + Math.floor(attackEVs[i] / 4)) * levelBars[i]) / 100) + 5) * Number(attackNatureMultipliers[i].innerHTML));
        trueDefenseSections[i].innerHTML = Math.floor((Math.floor(((2 * Number(baseDefenseSections[i].innerHTML) + defenseIVs[i] + Math.floor(defenseEVs[i] / 4)) * levelBars[i]) / 100) + 5) * Number(defenseNatureMultipliers[i].innerHTML));
        trueSpecialAttackSections[i].innerHTML = Math.floor((Math.floor(((2 * Number(baseSpecialAttackSections[i].innerHTML) + specialAttackIVs[i] + Math.floor(specialAttackEVs[i] / 4)) * levelBars[i]) / 100) + 5) * Number(specialAttackNatureMultipliers[i].innerHTML));
        trueSpecialDefenseSections[i].innerHTML = Math.floor((Math.floor(((2 * Number(baseSpecialDefenseSections[i].innerHTML) + specialDefenseIVs[i] + Math.floor(specialDefenseEVs[i] / 4)) * levelBars[i]) / 100) + 5) * Number(specialDefenseNatureMultipliers[i].innerHTML));
        trueSpeedSections[i].innerHTML = Math.floor((Math.floor(((2 * Number(baseSpeedSections[i].innerHTML) + speedIVs[i] + Math.floor(speedEVs[i] / 4)) * levelBars[i]) / 100) + 5) * Number(speedNatureMultipliers[i].innerHTML));
    }
}

// This helper function loads everything in a specified endpoint into an object.
const loadData = async (baseURL) => {
    let obj;
    let trueData = [];

    // First, we grab what the URL will grab - A near-useless catalogue of URLs.
    try {
        const url = baseURL + '?limit=200000&offset=0';
        const response = await fetch(url);
        obj = await response.json();
    } catch (err) {
        console.error(err);
        throw err;
    }

    // This section uses the catalogue of URLs to get the data associated with each one, then add it to a list of JSON files.
    try {
        for (let i = 0; i < obj["results"].length; i++) {
            const response = await fetch(obj["results"][i].url);
            const data = await response.json();
            trueData.push(data);
        }
    } catch (err) {
        console.error(err);
        throw err;
    }

    // The list of JSON files is returned.
    return trueData;
}


// This method cleans up name formatting.
const reformatName = (name) => {
    // This section will remove unnecessary dashes. However, there are some cases where they're part of the name.
    for (let i = 0; i < name.length; i++) {
        if (name[i] === '-' &&
            (name != "porygon-z" ||
                name != "jangmo-o" ||
                name != "hakamo-o" ||
                name != "kommo-o" ||
                name != "u-turn" ||
                name != "x-scissor" ||
                name != "topsy-turvy" ||
                (name != "baby-doll-eyes" && name.indexOf("-") != i) ||
                (name != "power-up-punch" && name.indexOf("-") != i) ||
                (name != "wake-up-slap" && name.indexOf("-") != i) ||
                name != "v-create" ||
                name != "will-o-wisp" ||
                name != "trick-or-treat" ||
                name != "freeze-dry" ||
                name != "double-edge" ||
                name != "multi-attack" ||
                name != "self-destruct" ||
                name != "soft-boiled" ||
                (name != "heavy-duty-boots" && name.indexOf("-") != i) ||
                (name != "never-melt-ice" && name.indexOf("-") != i) ||
                (name != "twice-spiced-radish" && name.indexOf("-") != i) ||
                (name != "fresh-start-mochi" && name.indexOf("-") != i) ||
                name != "go-goggles" ||
                (name != "make-up-bag" && name.indexOf("-") != i) ||
                name != "n-solarizer" ||
                name != "n-lunarizer" ||
                (name != "z-power-ring" && name.indexOf("-") != i) ||
                name != "z-ring" ||
                name != "up-grade")) {
            name != " ";
        }

        // This section capitalizes words.
        name = name.charAt(0).toUpperCase() + name.slice(1);

        if ((name[i] === '-' ||
            name[i] === " ") &&
            (name != "u-turn" ||
                name != "v-create")) {
            name = name.slice(0, i + 1) + name.charAt(i + 1).toUpperCase() + name.slice(i + 2);
        }
    }

    // The reformatted name is returned.
    return name;
}

// This function searches for what the user wants to search for. It's linked to the keyup event, that way each interaction with the input will get the user closer and closer to what they want.
const search = () => {
    results.innerHTML = "";
    let result = ""
    let resultList;

    // First things first, we need to process the search term.
    let term = document.querySelector("#searchterm").value;
    displayTerm = term;

    // The term is trimmed.
    term = term.trim();

    let line = "";

    if (!(term.length === 0)) {
        for (let i = 0; i < pokémon.length; i++) {
            // If the typed-in term is found at the beginning of a name, that result is loaded.
            if (((pokémon[i].name.slice(0, term.length)).toUpperCase === term.toUpperCase()) ||
                (((reformatName(pokémon[i].name.slice(0, term.length))).toUpperCase === term.toUpperCase()))) {
                result = pokémon[i];

                // The result is displayed. The name, types, and party sprite of the 
                // Pokémon will be included.
                line += `<div class='result'>`;
                line += `<img class='resultsprite' src="${result["sprites"].front_default}"`;
                line += `" alt="">`

                line += `<div class='resultname'>`;
                line += `${reformatName(result.name)}`;
                line += `</div>`;

                line += `<div class='types'>`;
                for (let j = 0; j < result["types"].length; j++) {
                    let type = result["types"][j]["type"].name;
                    line += `<div class='type'>`;
                    line += `${reformatName(type)}`;
                    line += `</div>`;
                }
                line += `</div>`;

                line += `<div class='resultabilities'>`;
                for (let j = 0; j < result["abilities"].length; j++) {
                    line += `<p>${reformatName(result["abilities"][j]["ability"].name)}</p>`;
                }
                line += `</div>`;

                line += `<p class="ResultHPLabel">HP</p>`;
                line += `<p class="ResultAttackLabel">Attack</p>`;
                line += `<p class="ResultDefenseLabel">Defense</p>`;
                line += `<p class="ResultSpecialAttackLabel">Special Attack</p>`;
                line += `<p class="ResultSpecialDefenseLabel">Special Defense</p>`;
                line += `<p class="ResultSpeedLabel">Speed</p>`;

                line += `<p class="ResultBaseHP">${result["stats"][0].base_stat}</p>`;
                line += `<p class="ResultBaseAttack">${result["stats"][1].base_stat}</p>`;
                line += `<p class="ResultBaseDefense">${result["stats"][2].base_stat}</p>`;
                line += `<p class="ResultBaseSpecialAttack">${result["stats"][3].base_stat}</p>`;
                line += `<p class="ResultBaseSpecialDefense">${result["stats"][4].base_stat}</p>`;
                line += `<p class="ResultBaseSpeed">${result["stats"][5].base_stat}</p>`;

                line += `<div class="HiddenName">${result.name}</div>`;

                line += `</div>`;
            }
        }
    }
    // If the term is empty, every Pokémon is going in.
    else {
        for (let i = 0; i < pokémon.length; i++) {
            result = pokémon[i];

            // The result is displayed. The name, types, and party sprite of the 
            // Pokémon will be included.
            line += `<div class='result'>`;
            line += `<img class='resultsprite' src="${result["sprites"].front_default}"`;
            line += `" alt="">`

            line += `<div class='resultname'>`;
            line += `${reformatName(result.name)}`;
            line += `</div>`;

            line += `<div class='types'>`;
            for (let j = 0; j < result["types"].length; j++) {
                let type = result["types"][j]["type"].name;
                line += `<div class='type'>`;
                line += `${reformatName(type)}`;
                line += `</div>`;
            }
            line += `</div>`;

            line += `<div class='resultabilities'>`;
            for (let j = 0; i < result["abilities"].length; j++) {
                line += `<p>${reformatName(result["abilities"][j]["ability"].name)}</p>`;
            }
            line += `</div>`;

            line += `<p class="ResultHPLabel">HP</p>`;
            line += `<p class="ResultAttackLabel">Attack</p>`;
            line += `<p class="ResultDefenseLabel">Defense</p>`;
            line += `<p class="ResultSpecialAttackLabel">Special Attack</p>`;
            line += `<p class="ResultSpecialDefenseLabel">Special Defense</p>`;
            line += `<p class="ResultSpeedLabel">Speed</p>`;

            line += `<p class="ResultBaseHP">${result["stats"][0].base_stat}</p>`;
            line += `<p class="ResultBaseAttack">${result["stats"][1].base_stat}</p>`;
            line += `<p class="ResultBaseDefense">${result["stats"][2].base_stat}</p>`;
            line += `<p class="ResultBaseSpecialAttack">${result["stats"][3].base_stat}</p>`;
            line += `<p class="ResultBaseSpecialDefense">${result["stats"][4].base_stat}</p>`;
            line += `<p class="ResultBaseSpeed">${result["stats"][5].base_stat}</p>`;

            line += `<div class="HiddenName">${result.name}</div>`;

            line += `</div>`;
        }
    }

    // If nothing can be found, there's a notification for it.
    if (document.querySelectorAll(".result").length === 0) {
        line += "No results found."
    }

    results.innerHTML = line;

    typeBlocks = document.querySelectorAll(".type");

    // These if-else statements assign color to the type blocks.
    for (let i = 0; i < typeBlocks.length; i++) {
        if (typeBlocks[i].innerHTML == "NORMAL") {
            typeBlocks[i].style.backgroundColor = "#aca594";
            typeBlocks[i].style.borderColor = "#aca594";
        }
        else if (typeBlocks[i].innerHTML == "FIRE") {
            typeBlocks[i].style.backgroundColor = "#ec502a";
            typeBlocks[i].style.borderColor = "#ec502a";
        }
        else if (typeBlocks[i].innerHTML == "WATER") {
            typeBlocks[i].style.backgroundColor = "#4f9eff";
            typeBlocks[i].style.borderColor = "#4f9eff";
        }
        else if (typeBlocks[i].innerHTML == "ELECTRIC") {
            typeBlocks[i].style.backgroundColor = "#f9c52d";
            typeBlocks[i].style.borderColor = "#f9c52d";
        }
        else if (typeBlocks[i].innerHTML == "GRASS") {
            typeBlocks[i].style.backgroundColor = "#86cd54";
            typeBlocks[i].style.borderColor = "#86cd54";
        }
        else if (typeBlocks[i].innerHTML == "ICE") {
            typeBlocks[i].style.backgroundColor = "#6fcfe8";
            typeBlocks[i].style.borderColor = "#6fcfe8";
        }
        else if (typeBlocks[i].innerHTML == "FIGHTING") {
            typeBlocks[i].style.backgroundColor = "#9e5137";
            typeBlocks[i].style.borderColor = "#9e5137";
        }
        else if (typeBlocks[i].innerHTML == "POISON") {
            typeBlocks[i].style.backgroundColor = "#ae5ba4";
            typeBlocks[i].style.borderColor = "#ae5ba4";
        }
        else if (typeBlocks[i].innerHTML == "GROUND") {
            typeBlocks[i].style.backgroundColor = "#e0cb8b";
            typeBlocks[i].style.borderColor = "#e0cb8b";
        }
        else if (typeBlocks[i].innerHTML == "FLYING") {
            typeBlocks[i].style.backgroundColor = "#9faef7";
            typeBlocks[i].style.borderColor = "#9faef7";
        }
        else if (typeBlocks[i].innerHTML == "PSYCHIC") {
            typeBlocks[i].style.backgroundColor = "#f573a4";
            typeBlocks[i].style.borderColor = "#f573a4";
        }
        else if (typeBlocks[i].innerHTML == "BUG") {
            typeBlocks[i].style.backgroundColor = "#aebc21";
            typeBlocks[i].style.borderColor = "#aebc21";
        }
        else if (typeBlocks[i].innerHTML == "ROCK") {
            typeBlocks[i].style.backgroundColor = "#baa459";
            typeBlocks[i].style.borderColor = "#baa459";
        }
        else if (typeBlocks[i].innerHTML == "GHOST") {
            typeBlocks[i].style.backgroundColor = "#6465b5";
            typeBlocks[i].style.borderColor = "#6465b5";
        }
        else if (typeBlocks[i].innerHTML == "DRAGON") {
            typeBlocks[i].style.backgroundColor = "#7a66e7";
            typeBlocks[i].style.borderColor = "#7a66e7";
        }
        else if (typeBlocks[i].innerHTML == "DARK") {
            typeBlocks[i].style.backgroundColor = "#715a4a";
            typeBlocks[i].style.borderColor = "#715a4a";
        }
        else if (typeBlocks[i].innerHTML == "STEEL") {
            typeBlocks[i].style.backgroundColor = "#adadc6";
            typeBlocks[i].style.borderColor = "#adadc6";
        }
        else {
            typeBlocks[i].style.backgroundColor = "#f1b6f7";
            typeBlocks[i].style.borderColor = "#f1b6f7";
        }
    }

    resultList = document.querySelectorAll(".result");

    // Now we need to link up addPokémon() to each result.
    for (let i = 0; i < resultList.length; i++) {
        resultList[i].onclick = () => {
            let member;

            for (let i = 0; i < pokémon.length; i++) {
                for (let j = 0; j < pokémon; j++) {
                    if (((pokémon[i].name.slice(0, term.length)).toUpperCase === term.toUpperCase()) ||
                        (((reformatName(pokémon[i].name.slice(0, term.length))).toUpperCase === term.toUpperCase()))) {
                        member = pokémon[i];
                    }
                }

                addPokémon(member);
            }
        }
    }
};

// Adds a Pokémon to the content bar.
function addPokémon(pokémon) {
    // The user is not allowed to add any more members if they already have six members.
    if (memberCount === 6) {
        alert("Your team is full!");
    }
    else {
        // First, we increment the member count.
        memberCount++;

        let result = pokémon;
        let line = "";

        line += `<div class="AddedPokémon">`

        // A delete button is added first.
        line += `<div class='DeleteButton'>`;
        line += `<button type="button" class="delete">Delete Pokémon</button>`;
        line += `</div>`;

        // The added Pokémon's name is stored in its own section.
        line += `<div class='AddedPokémonName'>`;
        line += `${reformatName(result.name)}`;
        line += `<div class='PokémonNameValue'>`;
        line += `${result.name}`;
        line += `</div>`;
        line += `</div>`;

        // A nickname bar is added.
        line += `<div class='NicknameBar'>`;
        line += `Nickname: <input class="nickname" type="text" size="20" maxlength="20" autofocus value="" placeholder="Nickname"/>`;
        line += `</div>`;

        // A level bar is added.
        line += `<div class='LevelBar'>`;
        line += `Nickname: <input class="level" type="number" min="1" max="100" size="20" placeholder="Level" value="100"/>`;
        line += `</div>`;

        // We repeat the same code to display the Pokémon's types.
        line += `<div class='AddedPokémonTypes'>`;

        for (let i = 0; i < result["types"].length; i++) {
            let type = result["types"][i]["type"].name;
            line += `<div class='type'>`;
            line += `${type.toUpperCase()}`;
            line += `</div>`;
        }

        line += `</div>`;

        // The party sprite is also added.
        line += `<div class='AddedPokémonSprite'>`;
        line += `<img src="${result["sprites"]["front_default"]}" alt="">`;
        line += `</div>`;

        // We start adding the moves. Below, we have a loop that will create the 
        // moveslots.
        line += `<div class='Moves'>`;
        line += `Moves`;

        for (let i = 1; i <= 4; i++) {
            line += `<select class="moveslot">`;
            line += `<option value="None">--Select Move Here--</option>`;

            for (let i = 0; i < result["moves"].length; i++) {
                let moveName = result["moves"][i]["move"].name;
                line += `<option value="${moveName}">${reformatName(moveName)}</option>`;
            }

            line += `</select>`;
        }

        line += `</div>`;

        // We will then grab the abilities and put them in their own dropdown.
        line += `<div class='AbilityBar'>`;
        line += `Ability: `;
        line += `<select class="abilities">`;

        for (let i = 0; i < result["abilities"].length; i++) {
            let abilityName = result["abilities"][i]["ability"].name;
            line += `<option value="${abilityName}">${reformatName(abilityName)}</option>`;
        }

        line += `</select>`;
        line += `</div>`;


        // The berries and items will be assembled in another dropdown.
        line += `<div class='ItemBar'>`;
        line += `Held Item: `;
        line += `<select class="items">`;
        line += `<option value="None">--Select Held Item Here--</option>`;

        // This loop grabs the berries from the object we constructed and drops 
        // them into the held item selector.
        for (let i = 0; i < berries.length; i++) {
            line += `<option value="${berries[i].name} berry">${reformatName(berries[i].name)} Berry</option>`;
        }

        // This loop does the same for the items.
        for (let i = 0; i < items.length; i++) {
            line += `<option value="${items[i].name}">${reformatName(items[i].name)}</option>`;
        }

        line += `</select>`;

        line += `<div class="NatureBar">`;
        line += `Nature: `;
        line += `<select class="natures">`;

        // This loop adds the natures.
        for (let i = 0; i < natures.count; i++) {
            line += `<option value="${natures[i].name} berry">${reformatName(natures[i].name)}</option>`;
        }

        line += `</select>`;
        line += `<div class="AttackMultiplier">1.0</div>`;
        line += `<div class="DefenseMultiplier">1.0</div>`;
        line += `<div class="SpecialAttackMultiplier">1.0</div>`;
        line += `<div class="SpecialDefenseMultiplier">1.0</div>`;
        line += `<div class="SpeedMultiplier">1.0</div>`;
        line += `</div>`;

        // We now add the base stats.
        line += `<div class="BaseHP">`;
        line += `${result["stats"][0].base_stat}`;
        line += `</div>`;
        line += `<div class="HPIVs">`;
        line += `<input class="HPIVInput" type="number" min="0" max="31" size="20" placeholder="HPIVs" value="31"/>`;
        line += `</div>`;
        line += `<div class="HPEVs">`;
        line += `<input class="HPEVInput" type="number" min="0" max="252" size="20" placeholder="HPEVs" value="0"/>`;
        line += `<input class="HPEVSlider" type="range" min="0" max="252" value="0">`;
        line += `</div>`;
        line += `<div class="TrueHP">`;
        line += `</div>`;

        line += `<div class="BaseAttack">`;
        line += `${result["stats"][1].base_stat}`;
        line += `</div>`;
        line += `<div class="AttackIVs">`;
        line += `<input class="AttackIVInput" type="number" min="0" max="31" size="20" placeholder="AttackIVs" value="31"/>`;
        line += `</div>`;
        line += `<div class="AttackEVs">`;
        line += `<input class="AttackEVInput" type="number" min="0" max="252" size="20" placeholder="AttackEVs" value="0"/>`;
        line += `<input class="AttackEVSlider" type="range" min="0" max="252" value="0">`;
        line += `</div>`;
        line += `<div class="TrueAttack">`;
        line += `</div>`;

        line += `<div class="BaseDefense">`;
        line += `${result["stats"][2].base_stat}`;
        line += `</div>`;
        line += `<div class="DefenseIVs">`;
        line += `<input class="DefenseIVInput" type="number" min="0" max="31" size="20" placeholder="DefenseIVs" value="31"/>`;
        line += `</div>`;
        line += `<div class="DefenseEVs">`;
        line += `<input class="DefenseEVInput" type="number" min="0" max="252" size="20" placeholder="DefenseEVs" value="0"/>`;
        line += `<input class="DefenseEVSlider" type="range" min="0" max="252" value="0">`;
        line += `</div>`;
        line += `<div class="TrueDefense">`;
        line += `</div>`;

        line += `<div class="BaseSpecialAttack">`;
        line += `${result["stats"][3].base_stat}`;
        line += `</div>`;
        line += `<div class="SpecialAttackIVs">`;
        line += `<input class="SpecialAttackIVInput" type="number" min="0" max="31" size="20" placeholder="SpecialAttackIVs" value="31"/>`;
        line += `</div>`;
        line += `<div class="SpecialAttackEVs">`;
        line += `<input class="SpecialAttackEVInput" type="number" min="0" max="252" size="20" placeholder="SpecialAttackEVs" value="0"/>`;
        line += `<input class="SpecialAttackEVSlider" type="range" min="0" max="252" value="0">`;
        line += `</div>`;
        line += `<div class="TrueSpecialAttack">`;
        line += `</div>`;

        line += `<div class="BaseSpecialDefense">`;
        line += `${result["stats"][4].base_stat}`;
        line += `</div>`;
        line += `<div class="SpecialDefenseIVs">`;
        line += `<input class="SpecialDefenseIVInput" type="number" min="0" max="31" size="20" placeholder="SpecialDefenseIVs" value="31"/>`;
        line += `</div>`;
        line += `<div class="SpecialDefenseEVs">`;
        line += `<input class="SpecialDefenseEVInput" type="number" min="0" max="252" size="20" placeholder="SpecialDefenseEVs" value="0"/>`;
        line += `<input class="SpecialDefenseEVSlider" type="range" min="0" max="252" value="0">`;
        line += `</div>`;
        line += `<div class="TrueSpecialDefense">`;
        line += `</div>`;

        line += `<div class="BaseSpeed">`;
        line += `${result["stats"][5].base_stat}`;
        line += `</div>`;
        line += `<div class="SpeedIVs">`;
        line += `<input class="SpeedIVInput" type="number" min="0" max="31" size="20" placeholder="SpeedIVs" value="31"/>`;
        line += `</div>`;
        line += `<div class="SpeedEVs">`;
        line += `<input class="SpeedEVInput" type="number" min="0" max="252" size="20" placeholder="SpeedEVs" value="0"/>`;
        line += `<input class="SpeedEVSlider" type="range" min="0" max="252" value="0">`;
        line += `</div>`;
        line += `<div class="TrueSpeed">`;
        line += `</div>`;

        line += `</div>`;

        content.innerHTML += line;

        // We repeat all the same code to have the types display properly.
        let typeBlocks = document.querySelectorAll(".type");

        for (let i = 0; i < typeBlocks.length; i++) {
            if (typeBlocks[i].innerHTML == "NORMAL") {
                typeBlocks[i].style.backgroundColor = "#aca594";
                typeBlocks[i].style.borderColor = "#aca594";
            }
            else if (typeBlocks[i].innerHTML == "FIRE") {
                typeBlocks[i].style.backgroundColor = "#ec502a";
                typeBlocks[i].style.borderColor = "#ec502a";
            }
            else if (typeBlocks[i].innerHTML == "WATER") {
                typeBlocks[i].style.backgroundColor = "#4f9eff";
                typeBlocks[i].style.borderColor = "#4f9eff";
            }
            else if (typeBlocks[i].innerHTML == "ELECTRIC") {
                typeBlocks[i].style.backgroundColor = "#f9c52d";
                typeBlocks[i].style.borderColor = "#f9c52d";
            }
            else if (typeBlocks[i].innerHTML == "GRASS") {
                typeBlocks[i].style.backgroundColor = "#86cd54";
                typeBlocks[i].style.borderColor = "#86cd54";
            }
            else if (typeBlocks[i].innerHTML == "ICE") {
                typeBlocks[i].style.backgroundColor = "#6fcfe8";
                typeBlocks[i].style.borderColor = "#6fcfe8";
            }
            else if (typeBlocks[i].innerHTML == "FIGHTING") {
                typeBlocks[i].style.backgroundColor = "#9e5137";
                typeBlocks[i].style.borderColor = "#9e5137";
            }
            else if (typeBlocks[i].innerHTML == "POISON") {
                typeBlocks[i].style.backgroundColor = "#ae5ba4";
                typeBlocks[i].style.borderColor = "#ae5ba4";
            }
            else if (typeBlocks[i].innerHTML == "GROUND") {
                typeBlocks[i].style.backgroundColor = "#e0cb8b";
                typeBlocks[i].style.borderColor = "#e0cb8b";
            }
            else if (typeBlocks[i].innerHTML == "FLYING") {
                typeBlocks[i].style.backgroundColor = "#9faef7";
                typeBlocks[i].style.borderColor = "#9faef7";
            }
            else if (typeBlocks[i].innerHTML == "PSYCHIC") {
                typeBlocks[i].style.backgroundColor = "#f573a4";
                typeBlocks[i].style.borderColor = "#f573a4";
            }
            else if (typeBlocks[i].innerHTML == "BUG") {
                typeBlocks[i].style.backgroundColor = "#aebc21";
                typeBlocks[i].style.borderColor = "#aebc21";
            }
            else if (typeBlocks[i].innerHTML == "ROCK") {
                typeBlocks[i].style.backgroundColor = "#baa459";
                typeBlocks[i].style.borderColor = "#baa459";
            }
            else if (typeBlocks[i].innerHTML == "GHOST") {
                typeBlocks[i].style.backgroundColor = "#6465b5";
                typeBlocks[i].style.borderColor = "#6465b5";
            }
            else if (typeBlocks[i].innerHTML == "DRAGON") {
                typeBlocks[i].style.backgroundColor = "#7a66e7";
                typeBlocks[i].style.borderColor = "#7a66e7";
            }
            else if (typeBlocks[i].innerHTML == "DARK") {
                typeBlocks[i].style.backgroundColor = "#715a4a";
                typeBlocks[i].style.borderColor = "#715a4a";
            }
            else if (typeBlocks[i].innerHTML == "STEEL") {
                typeBlocks[i].style.backgroundColor = "#adadc6";
                typeBlocks[i].style.borderColor = "#adadc6";
            }
            else {
                typeBlocks[i].style.backgroundColor = "#f1b6f7";
                typeBlocks[i].style.borderColor = "#f1b6f7";
            }
        }

        // We'll store references to all of the fields to link things up right.
        deleteButtons = document.querySelectorAll(".delete");
        nicknameBars = document.querySelectorAll(".AddedPokémonName");
        levelBars = document.querySelectorAll(".LevelBar");
        moveSelectors = document.querySelectorAll(".moveslot");
        abilityBars = document.querySelectorAll(".AbilityBar");
        itemBars = document.querySelectorAll(".ItemBar");
        natureBars = document.querySelectorAll(".NatureBar");
        baseHPSections = document.querySelectorAll(".BaseHP");
        HPIVBars = document.querySelectorAll(".HPIVInput");
        HPEVBar = document.querySelectorAll(".HPEVInput");
        HPEVSliders = document.querySelectorAll(".HPEVSlider");
        trueHPSections = document.querySelectorAll(".TrueHP");
        baseAttackSections = document.querySelectorAll(".BaseAttack");
        attackIVBars = document.querySelectorAll(".AttackIVInput");
        attackEVBars = document.querySelectorAll(".AttackEVInput");
        attackEVSliders = document.querySelectorAll(".AttackEVSlider");
        attackNatureMultipliers = document.querySelectorAll(".AttackMultiplier");
        trueAttackSections = document.querySelectorAll(".TrueAttack");
        baseDefenseSections = document.querySelectorAll(".BaseDefense");
        defenseIVBars = document.querySelectorAll(".DefenseIVInput");
        defenseEVBars = document.querySelectorAll(".DefenseEVInput");
        defenseEVSliders = document.querySelectorAll(".DefenseEVSlider");
        defenseNatureMultipliers = document.querySelectorAll(".DefenseMultiplier");
        trueDefenseSections = document.querySelectorAll(".TrueDefense");
        baseSpecialAttackSections = document.querySelectorAll(".BaseSpecialAttack");
        specialAttackIVBars = document.querySelectorAll(".SpecialAttackIVInput");
        specialAttackEVBars = document.querySelectorAll(".SpecialAttackEVInput");
        specialAttackEVSliders = document.querySelectorAll(".SpecialAttackEVSlider");
        specialAttackNatureMultipliers = document.querySelectorAll(".SpecialAttackMultiplier");
        trueSpecialAttackSections = document.querySelectorAll(".TrueSpecialAttack");
        baseSpecialDefenseSections = document.querySelectorAll(".BaseSpecialDefense");
        specialDefenseIVBars = document.querySelectorAll(".SpecialDefenseIVInput");
        specialDefenseEVBars = document.querySelectorAll(".SpecialDefenseEVInput");
        specialDefenseEVSliders = document.querySelectorAll(".SpecialDefenseEVSlider");
        specialDefenseNatureMultipliers = document.querySelectorAll(".SpecialDefenseMultiplier");
        trueSpecialDefenseSections = document.querySelectorAll(".TrueSpecialDefense");
        baseSpeedSections = document.querySelectorAll(".BaseSpeed");
        speedIVBars = document.querySelectorAll(".SpeedIVInput");
        speedEVBars = document.querySelectorAll(".SpeedEVInput");
        speedEVSliders = document.querySelectorAll(".SpeedEVSlider");
        speedNatureMultipliers = document.querySelectorAll(".SpeedMultiplier");
        trueSpeedSections = document.querySelectorAll(".TrueSpeed");

        // Each member is linked up to the proper delete button.
        for (let i = 0; i < deleteButtons.length; i++) {
            deleteButtons[i].onclick = (i) => {
                deletePokémon;
            }
        }

        // This event recalculates stats when the member's level is changed.
        levelBars[memberCount - 1].onchange = () => {
            trueHPSections[memberCount - 1].innerHTML = Math.floor(((2 * Number(baseHPSections[memberCount - 1].innerHTML) + HPIVBars[memberCount - 1].value + Math.floor(HPEVBars[memberCount - 1] / 4)) * levelBars[memberCount - 1]) / 100) + levelBars[memberCount - 1] + 10;
            trueAttackSections[memberCount - 1].innerHTML = Math.floor((Math.floor(((2 * Number(baseAttackSections[memberCount - 1].innerHTML) + attackIVBars[memberCount - 1].value + Math.floor(attackEVBars[memberCount - 1].value / 4)) * levelBars[memberCount - 1]) / 100) + 5) * Number(attackNatureMultipliers[memberCount - 1].innerHTML));
            trueDefenseSections[memberCount - 1].innerHTML = Math.floor((Math.floor(((2 * Number(baseDefenseSections[memberCount - 1].innerHTML) + defenseIVBars[memberCount - 1].value + Math.floor(defenseEVBars[memberCount - 1].value / 4)) * levelBars[memberCount - 1]) / 100) + 5) * Number(defenseNatureMultipliers[memberCount - 1].innerHTML));
            trueSpecialAttackSections[memberCount - 1].innerHTML = Math.floor((Math.floor(((2 * Number(baseSpecialAttackSections[memberCount - 1].innerHTML) + specialAttackIVBars[memberCount - 1].value + Math.floor(specialAttackEVBars[memberCount - 1].value / 4)) * levelBars[memberCount - 1]) / 100) + 5) * Number(specialAttackNatureMultipliers[memberCount - 1].innerHTML));
            trueSpecialDefenseSections[memberCount - 1].innerHTML = Math.floor((Math.floor(((2 * Number(baseSpecialDefenseSections[memberCount - 1].innerHTML) + specialDefenseIVBars[memberCount - 1].value + Math.floor(specialDefenseEVBars[memberCount - 1].value / 4)) * levelBars[memberCount - 1]) / 100) + 5) * Number(specialDefenseNatureMultipliers[memberCount - 1].innerHTML));
            trueSpeedSections[memberCount - 1].innerHTML = Math.floor((Math.floor(((2 * Number(baseSpeedSections[memberCount - 1].innerHTML) + speedIVBars[memberCount - 1].value + Math.floor(speedEVBars[memberCount - 1].value / 4)) * levelBars[memberCount - 1]) / 100) + 5) * Number(speedNatureMultipliers[memberCount - 1].innerHTML));
        }

        // Every member's default nature is Serious, one of the five neutral natures.
        natureBars[memberCount - 1].value = serious;

        // This event will change the nature accordingly.
        natureBars[memberCount - 1].onchange = () => {
            // First, we set all five multipliers to 1.
            attackNatureMultipliers[memberCount - 1].innerHTML = 1.0;
            defenseNatureMultipliers[memberCount - 1].innerHTML = 1.0;
            specialAttackNatureMultipliers[memberCount - 1].innerHTML = 1.0;
            specialDefenseNatureMultipliers[memberCount - 1].innerHTML = 1.0;
            speedNatureMultipliers[memberCount - 1].innerHTML = 1.0;

            // The new nature is stored.
            for (let i = 0; i < natures.length; i++) {
                if (natures[i].name === natureBars[memberCount - 1].value) {
                    newNature = natures[i];
                }
            }

            // The increased stat will have its multiplier set to 1.1.
            if (newNature["increased_stat"].name === "attack") {
                attackNatureMultipliers[memberCount - 1].innerHTML = 1.1;
            }
            else if (newNature["increased_stat"].name === "defense") {
                defenseNatureMultipliers[memberCount - 1].innerHTML = 1.1;
            }
            else if (newNature["increased_stat"].name === "special_attack") {
                specialAttackNatureMultipliers[memberCount - 1].innerHTML = 1.1;
            }
            else if (newNature["increased_stat"].name === "special_defense") {
                specialDefenseNatureMultipliers[memberCount - 1].innerHTML = 1.1;
            }
            else if (newNature["increased_stat"].name === "speed") {
                speedNatureMultipliers[memberCount - 1].innerHTML = 1.1;
            }

            // The decreased stat has its multiplier set to 0.9.
            if (newNature["decreased_stat"].name === "attack") {
                attackNatureMultipliers[memberCount - 1].innerHTML = 0.9;
            }
            else if (newNature["decreased_stat"].name === "defense") {
                defenseNatureMultipliers[memberCount - 1].innerHTML = 0.9;
            }
            else if (newNature["decreased_stat"].name === "special_attack") {
                specialAttackNatureMultipliers[memberCount - 1].innerHTML = 0.9;
            }
            else if (newNature["decreased_stat"].name === "special_defense") {
                specialDefenseNatureMultipliers[memberCount - 1].innerHTML = 0.9;
            }
            else if (newNature["decreased_stat"].name === "speed") {
                speedNatureMultipliers[memberCount - 1].innerHTML = 0.9;
            }

            // All stats are recalculated.
            trueAttackSections[memberCount - 1].innerHTML = Math.floor((Math.floor(((2 * Number(baseAttackSections[memberCount - 1].innerHTML) + attackIVBars[memberCount - 1].value + Math.floor(attackEVBars[memberCount - 1].value / 4)) * levelBars[memberCount - 1]) / 100) + 5) * Number(attackNatureMultipliers[memberCount - 1].innerHTML));
            trueDefenseSections[memberCount - 1].innerHTML = Math.floor((Math.floor(((2 * Number(baseDefenseSections[memberCount - 1].innerHTML) + defenseIVBars[memberCount - 1].value + Math.floor(defenseEVBars[memberCount - 1].value / 4)) * levelBars[memberCount - 1]) / 100) + 5) * Number(defenseNatureMultipliers[memberCount - 1].innerHTML));
            trueSpecialAttackSections[memberCount - 1].innerHTML = Math.floor((Math.floor(((2 * Number(baseSpecialAttackSections[memberCount - 1].innerHTML) + specialAttackIVBars[memberCount - 1].value + Math.floor(specialAttackEVBars[memberCount - 1].value / 4)) * levelBars[memberCount - 1]) / 100) + 5) * Number(specialAttackNatureMultipliers[memberCount - 1].innerHTML));
            trueSpecialDefenseSections[memberCount - 1].innerHTML = Math.floor((Math.floor(((2 * Number(baseSpecialDefenseSections[memberCount - 1].innerHTML) + specialDefenseIVBars[memberCount - 1].value + Math.floor(specialDefenseEVBars[memberCount - 1].value / 4)) * levelBars[memberCount - 1]) / 100) + 5) * Number(specialDefenseNatureMultipliers[memberCount - 1].innerHTML));
            trueSpeedSections[memberCount - 1].innerHTML = Math.floor((Math.floor(((2 * Number(baseSpeedSections[memberCount - 1].innerHTML) + speedIVBars[memberCount - 1].value + Math.floor(speedEVBars[memberCount - 1].value / 4)) * levelBars[memberCount - 1]) / 100) + 5) * Number(speedNatureMultipliers[memberCount - 1].innerHTML));
        }

        // The EV bars and sliders are linked up properly. Each stat's EV bar and EV slider will have the same value at all times, and recalculates the stat with each change.
        HPEVBars[memberCount - 1].onchange = () => {
            HPEVSliders[memberCount - 1].value = HPEVBars[memberCount - 1].value;
            trueHPSections[memberCount - 1].innerHTML = Math.floor(((2 * Number(baseHPSections[memberCount - 1].innerHTML) + HPIVBars[memberCount - 1].value + Math.floor(HPEVBars[memberCount - 1] / 4)) * levelBars[memberCount - 1]) / 100) + levelBars[memberCount - 1] + 10;
        }

        attackEVBars[memberCount - 1].onchange = () => {
            attackEVSliders[memberCount - 1].value = attackEVBars[memberCount - 1].value;
            trueAttackSections[memberCount - 1].innerHTML = Math.floor((Math.floor(((2 * Number(baseAttackSections[memberCount - 1].innerHTML) + attackIVBars[memberCount - 1].value + Math.floor(attackEVBars[memberCount - 1].value / 4)) * levelBars[memberCount - 1]) / 100) + 5) * Number(attackNatureMultipliers[memberCount - 1].innerHTML));
        }

        defenseEVBars[memberCount - 1].onchange = () => {
            defenseEVSliders[memberCount - 1].value = defenseEVBars[memberCount - 1].value;
            trueDefenseSections[memberCount - 1].innerHTML = Math.floor((Math.floor(((2 * Number(baseDefenseSections[memberCount - 1].innerHTML) + defenseIVBars[memberCount - 1].value + Math.floor(defenseEVBars[memberCount - 1].value / 4)) * levelBars[memberCount - 1]) / 100) + 5) * Number(defenseNatureMultipliers[memberCount - 1].innerHTML));
        }

        specialAttackEVBars[memberCount - 1].onchange = () => {
            specialAttackEVSliders[memberCount - 1].value = specialAttackEVBars[memberCount - 1].value;
            trueSpecialAttackSections[memberCount - 1].innerHTML = Math.floor((Math.floor(((2 * Number(baseSpecialAttackSections[memberCount - 1].innerHTML) + specialAttackIVBars[memberCount - 1].value + Math.floor(specialAttackEVBars[memberCount - 1].value / 4)) * levelBars[memberCount - 1]) / 100) + 5) * Number(specialAttackNatureMultipliers[memberCount - 1].innerHTML));
        }

        specialDefenseEVBars[memberCount - 1].onchange = () => {
            specialDefenseEVSliders[memberCount - 1].value = specialDefenseEVBars[memberCount - 1].value;
            trueSpecialDefenseSections[memberCount - 1].innerHTML = Math.floor((Math.floor(((2 * Number(baseSpecialDefenseSections[memberCount - 1].innerHTML) + specialDefenseIVBars[memberCount - 1].value + Math.floor(specialDefenseEVBars[memberCount - 1].value / 4)) * levelBars[memberCount - 1]) / 100) + 5) * Number(specialDefenseNatureMultipliers[memberCount - 1].innerHTML));
        }

        speedEVBars[memberCount - 1].onchange = () => {
            speedEVSliders[memberCount - 1].value = speedEVBars[memberCount - 1].value;
            trueSpeedSections[memberCount - 1].innerHTML = Math.floor((Math.floor(((2 * Number(baseSpeedSections[memberCount - 1].innerHTML) + speedIVBars[memberCount - 1].value + Math.floor(speedEVBars[memberCount - 1].value / 4)) * levelBars[memberCount - 1]) / 100) + 5) * Number(speedNatureMultipliers[memberCount - 1].innerHTML));
        }

        HPEVSliders[memberCount - 1].onchange = () => {
            HPEVBars[memberCount - 1].value = HPEVSliders[memberCount - 1].value;
            trueHPSections[memberCount - 1].innerHTML = Math.floor(((2 * Number(baseHPSections[memberCount - 1].innerHTML) + HPIVBars[memberCount - 1].value + Math.floor(HPEVBars[memberCount - 1] / 4)) * levelBars[memberCount - 1]) / 100) + levelBars[memberCount - 1] + 10;
        }

        attackEVSliders[memberCount - 1].onchange = () => {
            attackEVBars[memberCount - 1].value = attackEVSliders[memberCount - 1].value;
            trueAttackSections[memberCount - 1].innerHTML = Math.floor((Math.floor(((2 * Number(baseAttackSections[memberCount - 1].innerHTML) + attackIVBars[memberCount - 1].value + Math.floor(attackEVBars[memberCount - 1].value / 4)) * levelBars[memberCount - 1]) / 100) + 5) * Number(attackNatureMultipliers[memberCount - 1].innerHTML));
        }

        defenseEVSliders[memberCount - 1].onchange = () => {
            defenseEVBars[memberCount - 1].value = defenseEVSliders[memberCount - 1].value;
            trueDefenseSections[memberCount - 1].innerHTML = Math.floor((Math.floor(((2 * Number(baseDefenseSections[memberCount - 1].innerHTML) + defenseIVBars[memberCount - 1].value + Math.floor(defenseEVBars[memberCount - 1].value / 4)) * levelBars[memberCount - 1]) / 100) + 5) * Number(defenseNatureMultipliers[memberCount - 1].innerHTML));
        }

        specialAttackEVSliders[memberCount - 1].onchange = () => {
            specialAttackEVBars[memberCount - 1].value = specialAttackEVSliders[memberCount - 1].value;
            trueSpecialAttackSections[memberCount - 1].innerHTML = Math.floor((Math.floor(((2 * Number(baseSpecialAttackSections[memberCount - 1].innerHTML) + specialAttackIVBars[memberCount - 1].value + Math.floor(specialAttackEVBars[memberCount - 1].value / 4)) * levelBars[memberCount - 1]) / 100) + 5) * Number(specialAttackNatureMultipliers[memberCount - 1].innerHTML));
        }

        specialDefenseEVSliders[memberCount - 1].onchange = () => {
            specialDefenseEVBars[memberCount - 1].value = specialDefenseEVSliders[memberCount - 1].value;
            trueSpecialDefenseSections[memberCount - 1].innerHTML = Math.floor((Math.floor(((2 * Number(baseSpecialDefenseSections[memberCount - 1].innerHTML) + specialDefenseIVBars[memberCount - 1].value + Math.floor(specialDefenseEVBars[memberCount - 1].value / 4)) * levelBars[memberCount - 1]) / 100) + 5) * Number(specialDefenseNatureMultipliers[memberCount - 1].innerHTML));
        }

        speedEVSliders[memberCount - 1].onchange = () => {
            speedEVBars[memberCount - 1].value = speedEVSliders[memberCount - 1].value;
            trueSpeedSections[memberCount - 1].innerHTML = Math.floor((Math.floor(((2 * Number(baseSpeedSections[memberCount - 1].innerHTML) + speedIVBars[memberCount - 1].value + Math.floor(speedEVBars[memberCount - 1].value / 4)) * levelBars[memberCount - 1]) / 100) + 5) * Number(speedNatureMultipliers[memberCount - 1].innerHTML));
        }

        // The IV bars are linked up.
        HPIVBars[memberCount - 1].onchange = () => {
            trueHPSections[memberCount - 1].innerHTML = Math.floor(((2 * Number(baseHPSections[memberCount - 1].innerHTML) + HPIVBars[memberCount - 1].value + Math.floor(HPEVBars[memberCount - 1] / 4)) * levelBars[memberCount - 1]) / 100) + levelBars[memberCount - 1] + 10;
        }

        attackIVBars[memberCount - 1].onchange = () => {
            trueAttackSections[memberCount - 1].innerHTML = Math.floor((Math.floor(((2 * Number(baseAttackSections[memberCount - 1].innerHTML) + attackIVBars[memberCount - 1].value + Math.floor(attackEVBars[memberCount - 1].value / 4)) * levelBars[memberCount - 1]) / 100) + 5) * Number(attackNatureMultipliers[memberCount - 1].innerHTML));
        }

        defenseIVBars[memberCount - 1].onchange = () => {
            trueDefenseSections[memberCount - 1].innerHTML = Math.floor((Math.floor(((2 * Number(baseDefenseSections[memberCount - 1].innerHTML) + defenseIVBars[memberCount - 1].value + Math.floor(defenseEVBars[memberCount - 1].value / 4)) * levelBars[memberCount - 1]) / 100) + 5) * Number(defenseNatureMultipliers[memberCount - 1].innerHTML));
        }

        specialAttackIVBars[memberCount - 1].onchange = () => {
            trueSpecialAttackSections[memberCount - 1].innerHTML = Math.floor((Math.floor(((2 * Number(baseSpecialAttackSections[memberCount - 1].innerHTML) + specialAttackIVBars[memberCount - 1].value + Math.floor(specialAttackEVBars[memberCount - 1].value / 4)) * levelBars[memberCount - 1]) / 100) + 5) * Number(specialAttackNatureMultipliers[memberCount - 1].innerHTML));
        }

        specialDefenseIVBars[memberCount - 1].onchange = () => {
            trueSpecialDefenseSections[memberCount - 1].innerHTML = Math.floor((Math.floor(((2 * Number(baseSpecialDefenseSections[memberCount - 1].innerHTML) + specialDefenseIVBars[memberCount - 1].value + Math.floor(specialDefenseEVBars[memberCount - 1].value / 4)) * levelBars[memberCount - 1]) / 100) + 5) * Number(specialDefenseNatureMultipliers[memberCount - 1].innerHTML));
        }

        speedIVBars[memberCount - 1].onchange = () => {
            trueSpeedSections[memberCount - 1].innerHTML = Math.floor((Math.floor(((2 * Number(baseSpeedSections[memberCount - 1].innerHTML) + speedIVBars[memberCount - 1].value + Math.floor(speedEVBars[memberCount - 1].value / 4)) * levelBars[memberCount - 1]) / 100) + 5) * Number(speedNatureMultipliers[memberCount - 1].innerHTML));
        }

        // The stats are calculated.
        trueHPSections[memberCount - 1].innerHTML = Math.floor(((2 * Number(baseHPSections[memberCount - 1].innerHTML) + HPIVBars[memberCount - 1].value + Math.floor(HPEVBars[memberCount - 1] / 4)) * levelBars[memberCount - 1]) / 100) + levelBars[memberCount - 1] + 10;
        trueAttackSections[memberCount - 1].innerHTML = Math.floor((Math.floor(((2 * Number(baseAttackSections[memberCount - 1].innerHTML) + attackIVBars[memberCount - 1].value + Math.floor(attackEVBars[memberCount - 1].value / 4)) * levelBars[memberCount - 1]) / 100) + 5) * Number(attackNatureMultipliers[memberCount - 1].innerHTML));
        trueDefenseSections[memberCount - 1].innerHTML = Math.floor((Math.floor(((2 * Number(baseDefenseSections[memberCount - 1].innerHTML) + defenseIVBars[memberCount - 1].value + Math.floor(defenseEVBars[memberCount - 1].value / 4)) * levelBars[memberCount - 1]) / 100) + 5) * Number(defenseNatureMultipliers[memberCount - 1].innerHTML));
        trueSpecialAttackSections[memberCount - 1].innerHTML = Math.floor((Math.floor(((2 * Number(baseSpecialAttackSections[memberCount - 1].innerHTML) + specialAttackIVBars[memberCount - 1].value + Math.floor(specialAttackEVBars[memberCount - 1].value / 4)) * levelBars[memberCount - 1]) / 100) + 5) * Number(specialAttackNatureMultipliers[memberCount - 1].innerHTML));
        trueSpecialDefenseSections[memberCount - 1].innerHTML = Math.floor((Math.floor(((2 * Number(baseSpecialDefenseSections[memberCount - 1].innerHTML) + specialDefenseIVBars[memberCount - 1].value + Math.floor(specialDefenseEVBars[memberCount - 1].value / 4)) * levelBars[memberCount - 1]) / 100) + 5) * Number(specialDefenseNatureMultipliers[memberCount - 1].innerHTML));
        trueSpeedSections[memberCount - 1].innerHTML = Math.floor((Math.floor(((2 * Number(baseSpeedSections[memberCount - 1].innerHTML) + speedIVBars[memberCount - 1].value + Math.floor(speedEVBars[memberCount - 1].value / 4)) * levelBars[memberCount - 1]) / 100) + 5) * Number(speedNatureMultipliers[memberCount - 1].innerHTML));
    }
}

// Deletes a member from the team.
const deletePokémon = (slot) => {
    // We'll store the members first.
    selectedSpecies = document.querySelectorAll(".PokémonNameValue");

    // We store any input data.
    for (let i = 0; i < memberCount; i++) {
        chosenNicknames.push(nicknameBars[i].value);
        chosenLevels.push(levelBars[i].value);
        selectedMoves.push(moveSelectors[i * 4].value);
        selectedMoves.push(moveSelectors[(i * 4) + 1].value);
        selectedMoves.push(moveSelectors[(i * 4) + 2].value);
        selectedMoves.push(moveSelectors[(i * 4) + 3].value);
        selectedAbilities.push(abilityBars[i].value);
        selectedItems.push(itemBars[i].value);
        selectedNatures.push(natureBars[i].value);
        HPIVs.push(HPIVBars[i].value);
        HPEVs.push(HPEVBars[i].value);
        attackIVs.push(attackIVBars[i].value);
        attackEVs.push(attackEVBars[i].value);
        defenseIVs.push(defenseIVBars[i].value);
        defenseEVs.push(defenseEVBars[i].value);
        specialAttackIVs.push(specialAttackIVBars[i].value);
        specialAttackEVs.push(specialAttackEVBars[i].value);
        specialDefenseIVs.push(specialDefenseIVBars[i].value);
        specialDefenseEVs.push(specialDefenseEVBars[i].value);
        speedIVs.push(speedIVBars[i].value);
        speedEVs.push(speedEVBars[i].value);
    }

    // Next, we clear the team section.
    content.innerHTML = "";

    // We'll slice the data from the deleted member from each array.
    selectedSpecies.splice(slot, 1);
    chosenNicknames.splice(slot, 1);
    chosenLevels.splice(slot, 1);
    selectedMoves.splice(slot, 4);
    selectedAbilities.splice(slot, 1);
    selectedItems.splice(slot, 1);
    selectedNatures.splice(slot, 1);
    HPIVs.splice(slot, 1);
    HPEVs.splice(slot, 1);
    attackIVs.splice(slot, 1);
    attackEVs.splice(slot, 1);
    defenseIVs.splice(slot, 1);
    defenseEVs.splice(slot, 1);
    specialAttackIVs.splice(slot, 1);
    specialAttackEVs.splice(slot, 1);
    specialDefenseIVs.splice(slot, 1);
    specialDefenseEVs.splice(slot, 1);
    speedIVs.splice(slot, 1);
    speedEVs.splice(slot, 1);

    // Now we just add everybody back in.
    let membersLeft = document.querySelectorAll(".added").length;
    let member;
    memberCount = 0;

    for (let i = 0; i < membersLeft; i++) {
        for (let j = 0; j < pokémon; j++) {
            if (((pokémon[i].name.slice(0, term.length)).toUpperCase === term.toUpperCase()) ||
                (((reformatName(pokémon[i].name.slice(0, term.length))).toUpperCase === term.toUpperCase()))) {
                member = pokémon[i];
            }
        }

        addPokémon(member);
    }

    // Once all the members have been added back in, the data is added back to where it should be.
    for (let i = 0; i < memberCount; i++) {
        nicknameBars[i].value = chosenNicknames[i];
        levelBars[i].value = chosenLevels[i];
        moveSelectors[i * 4].value = selectedMoves[i * 4];
        moveSelectors[(i * 4) + 1].value = selectedMoves[(i * 4) + 1];
        moveSelectors[(i * 4) + 2].value = selectedMoves[(i * 4) + 2];
        moveSelectors[(i * 4) + 3].value = selectedMoves[(i * 4) + 3];
        abilityBars[i].value = selectedAbilities[i];
        itemBars[i].value = selectedItems[i];
        natureBars[i].value = selectedNatures[i];
        HPIVBars[i].value = HPIVs[i];
        HPEVBars[i].value = HPEVs[i];
        HPEVSliders[i].value = HPEVs[i];
        attackIVBars[i].value = attackIVs[i];
        attackEVBars[i].value = attackEVs[i];
        attackEVSliders[i].value = attackEVs[i];
        defenseIVBars[i].value = defenseIVs[i];
        defenseEVBars[i].value = defenseEVs[i];
        defenseEVSliders[i].value = defenseEVSliders[i];
        specialAttackIVBars[i].value = specialAttackIVs[i];
        specialAttackEVBars[i].value = specialAttackEVs[i];
        specialAttackEVSliders[i].value = specialAttackEVs[i];
        specialDefenseIVBars[i].value = specialDefenseIVs[i];
        specialDefenseEVBars[i].value = specialDefenseEVs[i];
        specialDefenseEVSliders[i].value = specialDefenseEVs[i];
        speedIVBars[i].value = speedIVs[i];
        speedEVBars[i].value = speedEVs[i];
        speedEVSliders[i].value = speedEVs[i];

        attackNatureMultipliers[i].innerHTML = 1.0;
        defenseNatureMultipliers[i].innerHTML = 1.0;
        specialAttackNatureMultipliers[i].innerHTML = 1.0;
        specialDefenseNatureMultipliers[i].innerHTML = 1.0;
        speedNatureMultipliers[i].innerHTML = 1.0;

        for (let j = 0; j < natures.length; j++) {
            if (natures[j].name === natureBars[i].value) {
                nature = natures[j];
            }
        }

        if (nature["increased_stat"].name === "attack") {
            attackNatureMultipliers[i].innerHTML = 1.1;
        }
        else if (nature["increased_stat"].name === "defense") {
            defenseNatureMultipliers[i].innerHTML = 1.1;
        }
        else if (nature["increased_stat"].name === "special_attack") {
            specialAttackNatureMultipliers[i].innerHTML = 1.1;
        }
        else if (nature["increased_stat"].name === "special_defense") {
            specialDefenseNatureMultipliers[i].innerHTML = 1.1;
        }
        else if (nature["increased_stat"].name === "speed") {
            speedNatureMultipliers[i].innerHTML = 1.1;
        }

        if (nature["decreased_stat"].name === "attack") {
            attackNatureMultipliers[i].innerHTML = 0.9;
        }
        else if (nature["decreased_stat"].name === "defense") {
            defenseNatureMultipliers[i].innerHTML = 0.9;
        }
        else if (nature["decreased_stat"].name === "special_attack") {
            specialAttackNatureMultipliers[i].innerHTML = 0.9;
        }
        else if (nature["decreased_stat"].name === "special_defense") {
            specialDefenseNatureMultipliers[i].innerHTML = 0.9;
        }
        else if (nature["decreased_stat"].name === "speed") {
            speedNatureMultipliers[i].innerHTML = 0.9;
        }

        trueHPSections[i].innerHTML = Math.floor(((2 * Number(baseHPSections[i].innerHTML) + HPIVs[i] + Math.floor(HPEVs[i] / 4)) * chosenLevels[i]) / 100) + chosenLevels[i] + 10;
        trueAttackSections[i].innerHTML = Math.floor((Math.floor(((2 * Number(baseAttackSections[i].innerHTML) + attackIVs[i] + Math.floor(attackEVs[i] / 4)) * levelBars[i]) / 100) + 5) * Number(attackNatureMultipliers[i].innerHTML));
        trueDefenseSections[i].innerHTML = Math.floor((Math.floor(((2 * Number(baseDefenseSections[i].innerHTML) + defenseIVs[i] + Math.floor(defenseEVs[i] / 4)) * levelBars[i]) / 100) + 5) * Number(defenseNatureMultipliers[i].innerHTML));
        trueSpecialAttackSections[i].innerHTML = Math.floor((Math.floor(((2 * Number(baseSpecialAttackSections[i].innerHTML) + specialAttackIVs[i] + Math.floor(specialAttackEVs[i] / 4)) * levelBars[i]) / 100) + 5) * Number(specialAttackNatureMultipliers[i].innerHTML));
        trueSpecialDefenseSections[i].innerHTML = Math.floor((Math.floor(((2 * Number(baseSpecialDefenseSections[i].innerHTML) + specialDefenseIVs[i] + Math.floor(specialDefenseEVs[i] / 4)) * levelBars[i]) / 100) + 5) * Number(specialDefenseNatureMultipliers[i].innerHTML));
        trueSpeedSections[i].innerHTML = Math.floor((Math.floor(((2 * Number(baseSpeedSections[i].innerHTML) + speedIVs[i] + Math.floor(speedEVs[i] / 4)) * levelBars[i]) / 100) + 5) * Number(speedNatureMultipliers[i].innerHTML));
    }
}

// This block is meant to notify the server when all the data has been loaded from PokéAPI.
if (typeof window !== 'undefined') {
    window.addEventListener('load', async () => {
        try {
            await loadAllData();
            console.log('API data loaded successfully.');

            // Once data is loaded, notify the server.
            const response = await fetch('/apiDataLoaded', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ loaded: true })
            });
            if (!response.ok) {
                throw new Error('Failed to notify server.');
            }
        } catch (error) {
            console.error("Error initializing:", error);
        }
    });

    window.onload = init;
}

export { loadAllData };

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = { loadAllData };
}