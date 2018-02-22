const express = require('express');
const app = express();
const fs = require('fs');
var bodyParser = require('body-parser');

//install node-arp by using 'npm install node-arp' in nodeServer
const arp = require('node-arp');

app.use(bodyParser.json());

app.use(express.static('public'));

app.post('/api/write',function(req,res){

//Fetch MAC address
arp.getMAC(req.connection.remoteAddress, function(err, mac) {
    if (!err) {
        var MACaddress = mac;
        //Check user already exist
        var obj;
        var content = fs.readFileSync('data.json', 'utf8');
        obj = JSON.parse(content);

        isUserExist = obj.users.includes(MACaddress);

        if(isUserExist === true)
        {
          res.status(404).send('User already exist')
        }
        else{
          //Add user MAC into data.JSON
          obj.users.push(MACaddress);
          //increment values
          obj.scores[0].option1 = obj.scores[0].option1 + req.body.scores[0].option1;
          obj.scores[1].option2 = obj.scores[1].option2 + req.body.scores[1].option2;
          obj.scores[2].option3 = obj.scores[2].option3 + req.body.scores[2].option3;
          obj.scores[3].option4 = obj.scores[3].option4 + req.body.scores[3].option4;

          //update data.json
          fs.writeFile("data.json",JSON.stringify(obj),function(err){
          if(err) throw err;
          console.log('Saved!')
          });

          res.status(200).end();

        }

    }
	else{
		console.log(err);
    res.end();
	}
});


});



app.get('/api/read',function(req,res){

var data;
fs.readFile('data.json', 'utf8', function (err, data) {
  if (err) throw err;
  data  = JSON.parse(data);
  res.send(JSON.stringify(data));
});


})

app.get('/result',function(req,res){

res.sendFile(__dirname +'/public/result.html');

});

app.listen(3000,function(){console.log('Server listening')})
