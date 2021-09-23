const { exec } = require('child_process');
var fs=require('fs');
var express=require('express');
var app=express();

app.use(express.static('public'))
app.use(express.json());


app.post('/api/run', function(req, res){
	 const code = req.body.code
  const fn = Math.random().toString(36).slice(2)

  fs.writeFileSync(`scripts/${fn}.sh`, code)
	console.log(req.body.code)
exec(`cat scripts/${fn}.sh | docker run -i ubuntu bash`, function(err, stdout, stderr){
					console.log(stdout, err, stderr);
		if (!err){
				res.send({output: stdout});
				 fs.unlink(`scripts/${fn}.sh`, function(err) {
      if (err) {
        console.error(err)
      }
    })
		}
		else if (err) {
				res.send({output: err.toString()});
				 fs.unlink(`scripts/${fn}.sh`, function(err) {
      if (err) {
        console.error(err)
      }
    })
		}
		else {
							res.send({output: stderr.toString()});
							 fs.unlink(`scripts/${fn}.sh`, function(err) {
      if (err) {
        console.error(err)
      }
    })
		}
});
});

app.listen(5050);