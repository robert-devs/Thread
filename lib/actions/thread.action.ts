import { model } from 'mongoose';
"use server"

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.models";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";


interface Props{
    text:string;
    author:string;
    communityId:string | null;
    path:string;
}

 export async function CreateThread ({
    text,
    author,
    communityId,
    path
 }:Props){
     try {
        connectToDB()
        const createdThread = await Thread.create({
            text,
            author,
            communityId:null,
        })
     //update user model

     await User.findByIdAndUpdate(author,{
        $push:{threads:createdThread._id}
     })

     revalidatePath(path)
     } catch (error:any) {
        throw new Error(`Error creating thread: ${error.message}`)
     }
 }

 export async function fetchPost(pageNumber = 1, pageSize =20){
    connectToDB()
      const skipAmount = (pageNumber - 1) * pageSize;

    const postsQuery = Thread.find({parentId: {$in:[null,undefined]}})
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({
      path: "author",
      model: User,
    })
    // .populate({
    //   path: "community",
    //   model: Community,
    // })
    .populate({
      path: "children", 
      populate: {
        path: "author", 
        model: User,
        select: "_id name parentId image",
      },
    });
     const totalPostsCount = await Thread.countDocuments({
        parentId: { $in: [null, undefined] },
    });

    const posts = await postsQuery.exec();

    const isNext = totalPostsCount > skipAmount + posts.length;

    return { posts, isNext };

 }

 export async function fetchThreadById(id:string){
    connectToDB()

    try {
        const thread = await Thread.findById(id)
        .populate({
            path:"author",
            model:User,
            select:"_id id name image"
        })
        .populate({
            path:"children",
            populate:[
                {
                    path:"author",
                    model:User,
                    select:"_id id name image"
                },
                {
                    path:"children",
                    model:Thread,
                    populate:{
                        path:"author",
                        model:"User",
                        select:"_id id name parentId image"
                    }
                }
            ]
        }).exec()

        return thread
    } catch (error:any) {
        throw new Error(`Error fetching thread: ${error.message}`)
    }
 }