import React from 'react'
import './Weather.css'
import search from '../assets/Assets/search.png'
import clear from '../assets/Assets/clear.png'
import cloud from '../assets/Assets/cloud.png'
import drizzle from '../assets/Assets/drizzle.png'
import humidity from '../assets/Assets/humidity.png'
import rain from '../assets/Assets/rain.png'
import snow from '../assets/Assets/snow.png'
import wind from '../assets/Assets/wind.png'

const Weather = () => {
  return (
    <div className='weather'>
        <div className='search-bar'>
            <div type='text' placeholder='Search'>
                <img src={search} alt=''></img>
            </div>
        </div>
    </div>
  )
}

export default Weather
