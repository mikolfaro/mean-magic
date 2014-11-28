'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    paginate = require('mongoose-paginate'),
    supergoose = require('supergoose'),
	Schema = mongoose.Schema;

/**
 * Print Schema
 */
var PrintSchema = new Schema({
    card: {
        type: Schema.ObjectId,
        ref: 'Card',
        required: 'Card cannot be blank'
    },
    expansion: {
        type: Schema.ObjectId,
        ref: 'Expansion',
        required: 'Expansion cannot be blank'
    },
    collectorNumber: {
        type: String,
        required: 'Collector number cannot be blank'
    },
    rarity: {
        type: String,
        required: 'Rarity cannot be blank',
        enum: ['Common', 'Uncommon', 'Rare', 'Mythic Rare', 'Timeshifted', 'Basic Land', 'Special']
    },
    flavorText: {
        type: String
    },
    illustrator: {
        type: String
    },
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

// There must be only one collector number for each expansion
PrintSchema.pre('save', true, function (next, done) {
    next();
    var self = this;
    mongoose.models.Print.findOne({ collectorNumber: self.collectorNumber, expansion: self.expansion },
        function (err, print) {
            if(err) {
                done(err);
            } else if(print) {
                self.invalidate('collectorNumber', 'Collector number for expansion already present');
                var valErr = new Error('Collector number for expansion already present');
                done(valErr);
            } else {
                done();
            }
        });
});

PrintSchema.plugin(paginate, {});
PrintSchema.plugin(supergoose, {});
mongoose.model('Print', PrintSchema);
