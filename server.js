import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import {connectDB} from './lib/db.js'

import authRoutes from './routes/auth.js'
import projectRoutes from './routes/projects.js';
import taskRoutes from './routes/tasks.js';
import userRoutes from './routes/users.js';



dotenv.config();

connectDB()

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: ['http://localhost:5173', 'https://project-management-tool-pmt.netlify.app/'], credentials: true }))


app.use('/api/auth',authRoutes);
app.use('/api/projects' ,projectRoutes);
app.use('/api/tasks',taskRoutes);
app.use('/api/users',userRoutes)

const port = process.env.PORT

app.listen(port, ()=>{
    console.log(`The server is running at port ${port}`)
})
