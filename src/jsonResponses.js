const teams = {};

const respondJSON = (request, response, status, object) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

const addTeam = (request, response, body) => {
  const responseJSON = {
    message: 'Team must have at least one member.',
  };

  if (!body.teamName || !body.team.member1) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 204;

  if (!teams[body.id]) {
    responseCode = 201;
    teams[body.id] = {};
  }

  teams[body.id].id = body.teamID;
  teams[body.id].teamname = body.teamName;
  teams[body.id].team = {};

  for (let i = 0; i < teams[body.id].team.length; i++) {
    teams[body.id].team.push(
      `'member${i + 1}': {
                'nickname': ${teams[body.id].team[i].nickname},
                'species': ${teams[body.id].team[i].species},
                'level': ${teams[body.id].team[i].level},
                'ability': ${teams[body.id].team[i].ability},
                'item': ${teams[body.id].team[i].item},                
                'nature': ${teams[body.id].team[i].nature},
                'IVs': {
                    'HP': ${teams[body.id].team[i].IVs.HP},
                    'attack': ${teams[body.id].team[i].IVs.attack},
                    'defense': ${teams[body.id].team[i].IVs.defense},
                    'special_attack': ${teams[body.id].team[i].IVs.special_attack},
                    'special_defense': ${teams[body.id].team[i].IVs.special_defense},
                    'speed': ${teams[body.id].team[i].IVs.speed}
                }
                'EVs': {
                    'HP': ${teams[body.id].team[i].EVs.HP},
                    'attack': ${teams[body.id].team[i].EVs.attack},
                    'defense': ${teams[body.id].team[i].EVs.defense},
                    'special_attack': ${teams[body.id].team[i].EVs.special_attack},
                    'special_defense': ${teams[body.id].team[i].EVs.special_defense},
                    'speed': ${teams[body.id].team[i].EVs.speed}
                }
            }`,
    );
  }

  if (responseCode === 201) {
    responseJSON.message = 'Team saved successfully.';
  }

  return respondJSON(request, response, responseCode, responseJSON);
};

const updateTeam = (request, response) => {
  const newTeam = {
    createdAt: Date.now(),
  };

  teams[newTeam.createdAt] = newTeam;
  return respondJSON(request, response, 201, newTeam);
};

const getUsers = (request, response) => {
  const responseJSON = {
    teams,
  };

  return respondJSON(request, response, 200, responseJSON);
};

const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  respondJSON(request, response, 404, responseJSON);
};

module.exports = {
  respondJSON,
  addTeam,
  updateTeam,
  getUsers,
  notFound,
};
