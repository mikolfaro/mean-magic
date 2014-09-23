'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Expansion Schema
 */
var ExpansionSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Expansion name',
		trim: true
	},
    code: {
        type: String,
        required: 'Code cannot be blank',
        trim: true,
        match: [/\w+/, 'Please fill a valid expansion code'],
        unique: true
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

mongoose.model('Expansion', ExpansionSchema);
