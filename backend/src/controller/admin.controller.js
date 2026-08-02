import Song from "../models/song.model.js"
import Album from "../models/album.model.js"
import cloudinary from "../lib/cloudinary.js"

const uploadToCloudinary=async(file)=>{

    try{
        const result=await cloudinary.uploader.upload(file.tempFilePath,{
            resource_type:"auto",


        })
        return result.secure_url;

    }catch(error){
        console.error(error);
        throw new Error("Error uploading to Cloudinary");

    }
}

export const createSong=async(req,res,next)=>{
    try{
        if(!req.files || !req.files.audioFile || !req.files.imageFile){
            return res.status(400).json({message:"Missing required files"});
        }
        const { title, artist, albumId, duration } = req.body;
      const audioFile=  req.files.audioFile
        const imageFile=req.files.imageFile

        const audioUrl=await uploadToCloudinary(audioFile);
        const imageUrl=await uploadToCloudinary(imageFile);

        const song=new Song({
            title,
            artist,
            audioUrl,
            imageUrl,
            duration,
            albumId: albumId || null
           
        })
        await song.save();

        if(albumId){
            await Album.findByIdAndUpdate(albumId,{$push:{songs:song._id}})
        }
        res.status(201).json({message:"Song created successfully",song})


    }catch(error){
        console.error(error);
        res.status(500).json({message:"Internal Server Error",error});
        next(error);


    }
}

export const deleteSong=async(req,res,next)=>{
try{
    const {id}=req.params;
    const song=await Song.findById(id);

    if(song.albumId){
        await Album.findByIdAndUpdate(song.albumId,{$pull:{songs:song._id}})

    }

    await Song.findByIdAndDelete(id);
    res.status(200).json({message:"Song deleted successfully"});

}catch(error){

    console.error(error);
    next(error);
}
}

export const createAlbum=async(req,res,next)=>{
try{
    const {title,artist,releaseYear}=req.body;
    const {imageFile}=req.files;

    const imageUrl=await uploadToCloudinary(imageFile);

    const album=new Album({
        title,
        artist,
        releaseYear,
        imageUrl
    })
    await album.save();
    res.status(201).json({message:"Album created successfully",album});

}catch(error){
    console.error(error);
    next(error);

}
}

export const deleteAlbum=async(req,res,next)=>{
    try{

        const {id}=req.params;
        await Song.deleteMany({albumId:id});
        await Album.findByIdAndDelete(id);
        res.status(200).json({message:"Album and associated songs deleted successfully"});


    }catch(error){
        console.error(error);
        next(error);
    }
}

export const checkAdmin=async(req,res,next)=>{
    res.status(200).json({admin:true,message:"You are an admin"});
}
    