import './App.css'
import { Outlet } from 'react-router'
import Header from './components/helper/Header.jsx'
import Sidebar from './components/helper/Sidebar.jsx'


function App() {
   
  return (
    <div className='bg-[rgb(6,12,26)] h-[calc(100vh)] '>
      <div>
        <Header/>
      </div>
      <div className='flex'>

        <div className='w-[30.5rem] h-[calc(100vh-5rem)] sticky top-[5rem] pl-[10rem] py-[2rem]'>
          <Sidebar/>
        </div>
        
        <Outlet/>
        
       </div>
    </div>
  )
}

export default App
