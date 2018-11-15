var mongoose=require('mongoose');
var schema=mongoose.Schema;

const pizzaSchema=new schema({
	label:{
		type:String,
		required:true
	},
	ingredient:[{
		type:String,
		required:true
	}],
	price:{
		type:Number
	},
	picture:{
		type:String,
        required:true,
        default:'http://la-cucina.fr/wp-content/uploads/2014/07/gal1.jpg'
	}
});

module.exports=mongoose.model('Pizza',pizzaSchema);