var express = require('express'); //importar express
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; //APi va a vivir en este puerto

var uri = "mongodb+srv://user_web:hola123@avotar-umbnv.mongodb.net/sistemadevotacion?retryWrites=true&w=majority";

var mongoose = require('mongoose');
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'error de conexion'));
db.once('openUri', function(){
    console.log("Me conecté a mongodb");
})

var router = express.Router();


router.use(function(req, res, next){
    next();
});//funcion habilita el middleware

router.get('/', function(req, res){
    res.json({
        mensaje: "keep alive"
    });
});


//Models declaration
var Survey = require('./app/models/survey');

//post and get surveys
router.route('/surveys').post(async function(req, res){
    var survey = new Survey();

    survey.title = req.body.title;
    survey.startDate = req.body.startDate;
    survey.endDate = req.body.endDate;
    survey.creationDate = req.body.creationDate;
    survey.questions = [];
    survey.city = req.body.city;
    survey.state = req.body.state;
    survey.isPublish = false;

    // if(!survey.title || !survey.startDate || !survey.endDate || !survey.creationDate || !survey.city || !survey.state){
    //     res.status(400).send(err);
    //     return;
    // }

    try {
        await survey.save(function (err){
            if(err){
                if(!survey.title || !survey.startDate || !survey.endDate || !survey.creationDate || !survey.city || !survey.state){
                    res.status(400).send(err);
                    return;
                }
                res.status(500).send(err);
            }else{
                res.json({mensaje: "Encuesta creada"});
            }
        });

    } catch(error){
        res.status(500).send(err);
    }
})
.get(function (req, res){
    limite = 5;
    Survey.find(function(err, surveys){
        if(err){
            res.status(500).send(err);
        }
        res.status(200).send(surveys);
    });
});

//get specific survey, delete specific survey and update specific survey
router
  .route("/surveys/:id_survey")
  .get(function (req, res) {
    Survey.findById(req.params.id_survey, function (error, survey) {
      if (error) {
        res.status(404).send({ message: "not found" });
        return;
      }
      if (survey == null) {
        res.status(404).send({ survey: "not found" });
        return;
      }
      res.status(200).send(survey);
    });
  })
  .delete(function (req, res) {
    Survey.remove(
      {
        _id: req.params.id_survey,
      },
      function (err, alumno) {
        if (err) {
          res.status(404).send(err);
          return;
        }
        res.status(200).send({ mensaje: "borrado con exito" });
      }
    );
  })
  .put(function (req, res) {
    Survey.findById(req.params.id_survey, async function (err, survey) {
      if (err) {
        res.send(err);
        return;
      }
      if(survey.isPublish == false){
        survey.isPublish = true;
      }else{
        survey.isPublish = false;
      }
      await survey.save(function (err) {
        if (err) {
          res.status(500).send(err);
          return;
        }
        res.json({ message: "encuesta actualizada" });
      });
    });
  });

router
  .route("/surveys/turn/:id_survey")
  .put(function (req, res) {
    Survey.findById(req.params.id_survey, async function (err, survey) {
      if (err) {
        res.status(404).send(err);
        return;
      }
      if(survey.isPublish == false){
        survey.isPublish = true;
      }else{
        survey.isPublish = false;
      }
      await survey.save(function (err) {
        if (err) {
          res.status(500).send(err);
          return;
        }
        res.json({ message: "encuesta actualizada" });
      });
    });
  });

app.use('/api', router); //url base de nuestro api que tiene las rutas en el router

app.listen(port); //abre el puerto que escucha

console.log("servidor arriba");