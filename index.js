const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
const dotenv=require('dotenv');
const app=express();
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB connected"))
.catch((err)=>console.log(err));

app.use(cors());
app.use(express.json());

app.use((req,res)=>{
    res.json({
        message:"Hello from server"
    });
})

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
}
);