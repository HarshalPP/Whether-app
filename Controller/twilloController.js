const{createMessage ,  createcall}= require("../config/sms")

exports.SendSms = async(req,res)=>{
    const{text,to}=req.body

    try{
     if(!text && !to){
        res.status(400).json('Please Provide the text and sender Mobile Number')
     }

     await createMessage(text,to)
     res.status(201).json({
        message:'SMS is send'
     })
    }catch(error){
        console.log(error)
        res.status(500).json({
            message:'Internal Server error',
            error:error
        })
    }
}

exports.makecall =async(req,res)=>{
    const{to}=req.body
    try{

        if(!to){
            res.status(400).json('Please Provide the sender Mobile Number')
         }
         await createcall(to)
         res.status(201).json({
            message:'call is Ringing'
         })

    }catch(error){

    }

}