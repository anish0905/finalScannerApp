const mongoose = require('mongoose');

const sosSchema=new  mongoose.Schema({
    emailId:{
        type:String,
        default:''
    },
    phone:{
        type:String,
        required:true
    },
    uniqueCode:{
        type:Number,
        default: function() {
            // Generate a random 4-digit code
            return Math.floor(1000 + Math.random() * 9000);
        }

    }
},{timestamps:true})

sosSchema.statics.findByUniqueCode = function(uniqueCode) {
    return this.findOne({ uniqueCode: uniqueCode });
};

const Sos=mongoose.model("Sos",sosSchema)

module.exports=Sos;