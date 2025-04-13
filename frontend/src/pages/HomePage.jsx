import React from 'react'
import Navbar from '../components/user/Navbar'
import Home from '../components/user/home/Home'
import Container_pt_16 from '../components/utils/container/Container_mt_11'
import TodayHeader from '@/components/user/home/TodayHeader'

function HomePage() {
  return (
    <>
        <Navbar />
        <Container_pt_16 />
        <Home />
    </>
  )
}

export default HomePage
