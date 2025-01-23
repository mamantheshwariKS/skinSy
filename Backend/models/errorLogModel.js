const mongoose = require('mongoose')
const Schema = mongoose.Schema

const errorLogSchema = new Schema({
    errorType: {
        type: String,
        required: [true, 'Error Type is required']
    },
    error: {
        type: Schema.Types.Mixed
    },
    errorMessage: {
        type: String
    },
    errorStatusCode: {
        type: Number
    },
    route: {
        type: String
    },
    method: {
        type: String,
        enum: ['POST', 'GET', 'PATCH', 'DELETE']
    },
    payload: {
        type: Schema.Types.Mixed
    },
    headers: {
        type: Schema.Types.Mixed
    }
}, { timestamps: true })

module.exports = mongoose.model('ErrorLogs', errorLogSchema)