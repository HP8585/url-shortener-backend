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
    }
});

export default mongoose.model('urls', schema)