const express = require("express");
const cors = require("cors");
const {uuid} = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function updateLike(request, response, next){
  const {id} = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0){
    return response.status(400).json({message: 'Repository not found'});
  }

  repositories[repositoryIndex].likes = repositories[repositoryIndex].likes + 1;

  return next();
}

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;
  const project = {id: uuid(), title, url, techs, likes: 0};
  repositories.push(project);
  return response.status(200).json(project);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;
  const repositoryIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if(repositoryIndex < 0){
    return response.status(400).json({message: 'Repository not found'});
  }
  
  repositories[repositoryIndex].title = title;
  repositories[repositoryIndex].url = url;
  repositories[repositoryIndex].techs = techs;

  return response.status(200).json(repositories[repositoryIndex]);
  
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const repositoryIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if(repositoryIndex < 0){
    return response.status(400).json({message: 'Repository not found'});
  }

  repositories.splice(repositoryIndex, 1);
  return response.status(204).json({});
});

app.post("/repositories/:id/like", updateLike, (request, response) => {
  const {id} = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
   return response.status(200).json(repositories[repositoryIndex]);
});

module.exports = app;
