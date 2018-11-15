var mongoose=require('mongoose');
var schema=mongoose.Schema;

const userSchema=new schema({
	username:{
		type:String,
		required:true
	},
	email:{
		type:String,
		required:true
	},
	avatar_url:{
		type:String
	},
	pwd:{
		type:String,
		required:true
	}
});

module.exports=mongoose.model('User',userSchema);