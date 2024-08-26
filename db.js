import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    slug: {
        type: String,
        unique: true,
        required: false
    },
    url: {
        type: String,
        required: true
    },
    new_url:{
        type: String,
        required: true,
        unique: true
    }
});

export default mongoose.model('urls', schema)