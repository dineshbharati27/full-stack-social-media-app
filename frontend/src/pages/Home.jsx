import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import BlogList from '../components/Bloglist'
import Notification from '../components/Notification'
import { Route, Routes } from 'react-router-dom'
import CreateBlog from '../components/CreateBlog'	
import MyBlogs from '../components/MyBlogs'
import Profile from '../components/Profile'
import EditProfile from '../components/EditProfile'
import UserProfile from '../components/UserProfile'
import Search from '../components/Search'
import Navbar from '../components/Navbar'

export default function Home() {

  return (
    <div className="flex flex-col md:flex-row h-screen p-0 md:p-10">

      <div className="md:hidden">
        <Navbar />
      </div>

      {/* Sidebar - Bottom on small screens, left on medium+ */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-grow overflow-y-scroll hide-scrollbar p-0 pb-20 pt-8 md:p-10">
        <Routes>
          <Route path='/' element={<BlogList/>}/>
          <Route path='create' element={<CreateBlog/>}/>
          <Route path='myblogs' element={<MyBlogs/>}/>
          <Route path='edit/:id' element={<CreateBlog/>}/>
          <Route path='profile' element={<Profile/>}/>
          <Route path='userprofile/:userId' element={<UserProfile/>}/>
          <Route path='editprofile' element={<EditProfile/>}/>
          <Route path='search' element={<Search/>}/>
          <Route path='notifications' element={<Notification/>}/>
        </Routes>
      </div>

      {/* Notification Bar - Hidden on small screens */}
      <div className="hidden md:flex md:w-1/5">
        <Notification />
      </div>
    </div>

  )
}