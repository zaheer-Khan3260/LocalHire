import React from 'react'
import defaultImage from "../../Icons/profile.jpeg"

function NotificationCard({
    handleClick,
    data
}) {

  return (
    <div className='border-b-2  w-full h-20 flex items-center gap-4 cursor-pointer' onClick={handleClick}>
        <div className='w-14 h-14 rounded-full ml-2'>
            <img src={data?.ClientProfileImage ? data?.ClientProfileImage : defaultImage} alt="" className='w-14 h-14 rounded-full object-cover'/>
        </div>
        <div className=''>
            <p className='text-lg'>{data?.clientName}</p>
            <p className='text-sm text-gray-400'>{data?.notificationMessage}</p>
        </div>
    </div>
  )
}

export default NotificationCard
