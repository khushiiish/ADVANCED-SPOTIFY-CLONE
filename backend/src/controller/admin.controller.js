import fs from "fs";
import path from "path";
import Song from "../models/song.model.js";
import Album from "../models/album.model.js";
import cloudinary from "../lib/cloudinary.js";

const uploadToCloudinary = async (file) => {
    // 1. Attempt Cloudinary upload
    try {
        if (file.tempFilePath) {
            const result = await cloudinary.uploader.upload(file.tempFilePath, {
                resource_type: "auto",
            });
            return result.secure_url;
        }

        if (file.data) {
            const b64 = Buffer.from(file.data).toString("base64");
            const dataURI = `data:${file.mimetype};base64,${b64}`;
            const result = await cloudinary.uploader.upload(dataURI, {
                resource_type: "auto",
            });
            return result.secure_url;
        }
    } catch (error) {
        console.warn("⚠️ Cloudinary upload failed:", error.message || error);
        console.warn("📁 Falling back to local file storage upload in /uploads...");

        // 2. Resilient local storage fallback
        const uploadsDir = path.resolve("uploads");
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const ext = path.extname(file.name || "") || (file.mimetype?.includes("audio") ? ".mp3" : ".jpg");
        const sanitizedOriginal = (file.name || "file").replace(/[^a-zA-Z0-9.-]/g, "_");
        const uniqueFileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${sanitizedOriginal}`;
        const targetPath = path.join(uploadsDir, uniqueFileName);

        if (file.tempFilePath && fs.existsSync(file.tempFilePath)) {
            fs.copyFileSync(file.tempFilePath, targetPath);
        } else if (file.data) {
            fs.writeFileSync(targetPath, file.data);
        } else if (typeof file.mv === "function") {
            await file.mv(targetPath);
        } else {
            throw new Error("Unable to read file content for upload");
        }

        const port = process.env.PORT || 5000;
        const host = process.env.BACKEND_URL || `http://localhost:${port}`;
        return `${host}/uploads/${uniqueFileName}`;
    }

    throw new Error("No file content provided for upload");
};

export const createSong = async (req, res, next) => {
    try {
        if (!req.files || !req.files.audioFile || !req.files.imageFile) {
            return res.status(400).json({ message: "Missing required files: audioFile and imageFile are required" });
        }
        const { title, artist, albumId, duration } = req.body;
        const audioFile = req.files.audioFile;
        const imageFile = req.files.imageFile;

        const audioUrl = await uploadToCloudinary(audioFile);
        const imageUrl = await uploadToCloudinary(imageFile);

        const song = new Song({
            title: title || "Untitled Song",
            artist: artist || "Unknown Artist",
            audioUrl,
            imageUrl,
            duration: Number(duration) || 0,
            albumId: albumId && albumId !== "none" ? albumId : null,
        });
        await song.save();

        if (albumId && albumId !== "none") {
            await Album.findByIdAndUpdate(albumId, { $push: { songs: song._id } });
        }
        res.status(201).json({ message: "Song created successfully", song });
    } catch (error) {
        console.error("Error creating song:", error);
        next(error);
    }
};

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

export const createAlbum = async (req, res, next) => {
    try {
        if (!req.files || !req.files.imageFile) {
            return res.status(400).json({ message: "Image file is required" });
        }
        const { title, artist, releaseYear } = req.body;
        const { imageFile } = req.files;

        const imageUrl = await uploadToCloudinary(imageFile);

        const album = new Album({
            title: title || "Untitled Album",
            artist: artist || "Unknown Artist",
            releaseYear: Number(releaseYear) || new Date().getFullYear(),
            imageUrl,
        });
        await album.save();
        res.status(201).json({ message: "Album created successfully", album });
    } catch (error) {
        console.error("Error creating album:", error);
        next(error);
    }
};

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
    