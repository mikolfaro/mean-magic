'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    extend = require('mongoose-schema-extend'),
    uniqueValidator = require('mongoose-unique-validator'),
    Schema = mongoose.Schema;

/**
 * Card Schema
 */
var CardSchema = new Schema({
    name: {
        type: String,
        required: 'Name cannot be blank',
		trim: true,
        unique: true
    },
    manaCost: {
        type: String
    },
    convertedManaCost: {
        type: String,
        required: true,
        default: '0'
    },
    type: {
        type: String,
        required: 'Type cannot be blank'
    },
    rules: {
        type: String
    },
    transformsInto: {
        type: Schema.ObjectId,
        ref: 'CardSchema'
    },
    created: {
        type: Date,
        default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
}, { discriminatoryKey: '_type', collection: 'cards' });

CardSchema.plugin(uniqueValidator, { message: 'Card name already used' });
mongoose.model('Card', CardSchema);

var CreatureSchema = CardSchema.extend({
    power: {
        type: String,
        required: true,
        match: [/[\d\+-X\*]+/, 'Please fill with a valid power value']
    },
    toughness: {
        type: String,
        required: true,
        match: [/[\d\+-X\*]+/, 'Please fill with a valid toughness value']
    }
});

mongoose.model('Creature', CreatureSchema);

var PlaneswalkerSchema = CardSchema.extend({
    loyalty: {
        type: String
    }
});

mongoose.model('Planeswalker', PlaneswalkerSchema);