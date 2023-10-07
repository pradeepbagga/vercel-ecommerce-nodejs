const mongoose = require('mongoose');
/*
mongodb+srv://pradeepbecommerce:lpYM1iiF7Yk3YXbe@cluster0.v18w9dg.mongodb.net/ecommerce
mongodb+srv://pradeepbecommerce:<password>@cluster0.v18w9dg.mongodb.net/?retryWrites=true&w=majority
*/

async function main(){
    // await mongoose.connect('mongodb+srv://pradeepbecommerce:lpYM1iiF7Yk3YXbe@cluster0.v18w9dg.mongodb.net/ecommerce')
    await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.v18w9dg.mongodb.net/${process.env.DB_NAME}`)
    console.log('database connected')
}
main().catch((err) => {
    console.log('DATABASE ERROR - ', err);
});