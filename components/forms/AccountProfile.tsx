"use client"

import React from 'react'

interface Props{
   user:{
     id:String
    objectId:String
    username:String
    name:String
    bio:String
    image:String
   }
   btnTitle:String
}


const AccountProfile = ({user ,btnTitle}:Props) => {
  return (
    <div>AccountProfile</div>
  )
}

export default AccountProfile