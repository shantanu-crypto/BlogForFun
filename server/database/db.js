import mongoose from 'mongoose'


export const Connection=async(username,password)=>{
    const URL=`mongodb://${username}:${password}@ac-tfwmkby-shard-00-00.fjbjs4o.mongodb.net:27017,ac-tfwmkby-shard-00-01.fjbjs4o.mongodb.net:27017,ac-tfwmkby-shard-00-02.fjbjs4o.mongodb.net:27017/?ssl=true&replicaSet=atlas-13qlb3-shard-0&authSource=admin&retryWrites=true&w=majority`;
    try{
        // URL is required to moke connection with the database
        // jo purane vala URL hai vo deprecate ho chuka hai muje new vala use krna hai issliye hamne  useNewUrlParser ko true kr diya 
       await mongoose.connect(URL,{ useNewUrlParser:true});
       console.log("Database connected successfully");
    }catch(error){
        console.log('Error while connecting with the database', error);
    }
} 

export default Connection;