const express = require('express');
const app = express();
const axios = require('axios')
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = process.env.PORT || 3000;


var developersBio = {};
var gitBody;

app.post('/api/developers' , (req,res) =>{

    const github_id = req.body.github_id;
    const output_id = github_id;
    developersBio[github_id] = req.body;
    res.send(developersBio);
})

app.get('/api/developer/:id', function (req, res) {
    
    const userId = req.params.id;
    let devBio = developersBio[userId];
    //console.log('githubId ' + devBio.github_id);
    
    axios(`https://api.github.com/users/${userId}`)
    .then(response => {
        console.log(response.status);
        gitBody = response;
        devBio['avatar_url'] = gitBody.data.avatar_url;
        devBio['name'] = gitBody.data.name;
        devBio['company'] = gitBody.data.company;
        devBio['blog'] = gitBody.data.blog;
        devBio['location'] = gitBody.data.location;
        devBio['bio'] = gitBody.data.bio;
        devBio['email'] = gitBody.data.email;
        devBio['reposURL'] = gitBody.data.repos_url;
        const reposUrl = JSON.stringify(gitBody.data.repos_url);
        //console.log(JSON.stringify(reposUrl));
        //res.status(200).send(devBio);
        return gitBody;
    })
    .then(gitBody =>
    {
        //calling github API to fetch all repos
        axios("https://api.github.com/users/CallmeAkshit/repos").
        then(response =>{
        console.log(response.data)
        let reposBody = response.data;
        
        const arrOfRepos = [];
        for (const obj of reposBody)
        {
            //arr.push(obj.html_url);
            arrOfRepos.push(
            {
             'name':obj.name,
             'html_url':obj.html_url, 
             'description':obj.description,
             'updated_at':obj.updated_at
            });
        }
        devBio['reposArray'] = arrOfRepos;
    
        console.log(devBio);
        res.status(200).send(devBio);
        })
    });
        
    
    
  });

  app.get('/api/developers', (req,res) =>{

    const arrOfProfiles = [];
    for(let obj in developersBio)
    {
        axios(`https://api.github.com/users/${obj.github_id}`)
        .then(response => {
            console.log(response.status);
            gitBody = response;
            const avatar_url = gitBody.data.avatar_url;
            console.log(avatar_url);
            console.log(obj['github_id']);
            arrOfProfiles.push(
                {
                    "id":obj['github_id'],
                    "avatar_url":avatar_url
                }
            );
            res.send(arrOfProfiles);
            return gitBody;
        })

    }
    
})

app.delete('/api/developer/:id', function (req, res) {
    res.send('Got a DELETE request at /user');
  });

app.listen(port, () => {
  console.log(`Server listening at port: ${port}`)
});

