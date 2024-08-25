import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import helmet  from 'helmet'
import yup from 'yup'
import { nanoid } from 'nanoid'
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import UrlDb from './db.js';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
dotenv.config()

mongoose.connect(process.env.MONGO_URI)

const app = express()
const PORT = process.env.PORT || 4500;

app.use(helmet())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.json())
app.use(express.static('./public'))

// Get __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use path.join
const notFoundPath = path.join(__dirname, 'public/404.html');

app.get('/', (req, res)=>{
    res.json({
        meessage: 'short urls just for you'
    })
})

app.get('/:id', async (req, res, next) => {
    const { id: slug } = req.params;
    try {
        
        const url = await UrlDb.findOne({ slug });
        if (url) {
            return res.redirect(url.url);
        }
        
        return res.status(404).sendFile(notFoundPath)
    } catch (e) {        
        return res.status(404).sendFile(notFoundPath)
    }
});


app.post('/url', async (req, res, next)=>{
    //create a short url
    var { slug, url } = req.body;
    try{
        await schema.validate({
            slug,
            url
        })
        if(!slug){
            slug = nanoid(5);
        }else{
            const existing = await UrlDb.findOne({ slug })
            if(existing){
                throw new Error('Slug already in use. 🍕')
            }
        }
        slug = slug.toLowerCase();

        const newUrl = new UrlDb({
            url,
            slug,
            clicks: 0
        })

        const created = await newUrl.save()

        res.status(200).json(created)
    }catch(e){
        next(e)
    }
})

const schema = yup.object().shape({
    slug: yup.string().trim().matches(/[\w\-]/i),
    url: yup.string().trim().url(),
    
})

app.use((req, res, next) => {
    res.status(404).sendFile(notFoundPath);
});

app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`);
})