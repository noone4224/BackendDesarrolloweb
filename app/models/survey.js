var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OptionSchema = new Schema ({ //Subdocument in QuestionSchema
    title: {
        type: String,
        required: true
    },
    votes: Number
})

var QuestionSchema = new Schema ({ //Subdocument in SurveySchema
    title: {
        type: String,
        required: true
    }, 
    options: [OptionSchema]
});

var SurveySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    startDate: {
        type: String,
        required: true
    },
    endDate: {
        type: String,
        required: true
    },
    creationDate: {
        type: String,
        required: true
    },
    questions: [QuestionSchema],
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    isPublish: {
        type: Boolean,
        default: false
    }  
});

module.exports = mongoose.model('Survey', SurveySchema);