const express = require('express');
const app = express();
const bodyParser = require('body-parser')
// const cors = require('cors')
const axios = require('axios');
const port = 3000;
const csv = require('csv-parser');
const fs = require('fs');
const { request } = require('http');
const { response } = require('express');
const { log } = require('console');
const upload = require('express-fileupload');


app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use(upload());
// app.use(cors())

app.post('/processFile', (req, res) => {
    //upload file
    // console.log(req);
    if (req.files) {
        console.log(req.files);
        var file = req.files.file;
        var filename = file.name;
        console.log(filename);

        file.mv('./public/uploads/' + filename, (err) => {
            if (err) {
                res.json({ "message": "Error uploading file!", "status": 400 });
            }
            else {
                // res.send("File uploaded");
                //read file just uploaded
                fs.readFile('./public/uploads/' + filename, 'utf8', (err, data) => {
                    if (err) {
                        console.error(err);
                        res.json({ message: "Error reading file!", status: 400 });
                    }
                    // console.log(data);
                    results = data.split("\r\n");
                    res.json({ message: results, status: 200 });
                });
            }
        });
    }


    // let results = ["test"];

});

app.post('/writeFile', async (req, res) => {
    console.log(req.body);
    var req_data = req.body.join("\n");
    console.log(req_data);
    fs.writeFile('./public/output.txt', req_data, err => {
        if (err) {
            console.error(err);
        }
        // file written successfully
    });


});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
