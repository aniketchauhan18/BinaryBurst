import { useState, useEffect } from 'react'
import {
  Divider
} from "@chakra-ui/react"

function LostListPage() {
  const [foundItemsData, setFoundItemsData] = useState([]);

  useEffect(() => {
    const fetchData = async() => {
      try {
        const response = await fetch('http://localhost:3000/lost/lostForm');
        const data = await response.json();
        setFoundItemsData(data)
      } catch(err) {
        console.log("Error",err)
      }
    } 
    fetchData()
  }, [])
  return (
    <div className='flex flex-col'>
      <p className='flex justify-center items-center text-8xl font-bold lost-list mb-5'>
        LOST ITEMS LISTS
      </p>
      <Divider orientation='horizontal'/>
      <div className='flex flex-wrap'>
        {
          foundItemsData.map((foundItem, index) => {
            return (
            <div 
              key={index}
              className='shadow bg-slate-300 lost-items text-slate-700 p-4 rounded-lg m-10  w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4'
            >
              <div
                className='p-2 flex items-left flex-col gap-2'
              >
                <p>
                  <strong>ItemName: </strong> {foundItem.name}
                </p>
                <p>
                <strong>LocationLost: </strong>{foundItem.location}
                </p>
                <p>
                <strong>Finders Contact: </strong>{foundItem.contact}
                </p>
                <p>
                <strong>Item Description: </strong>{foundItem.description}
                </p>
                <p>
                <strong>Lost Date: </strong>{foundItem.date.split('T')[0]}
                </p>
              </div>
            </div>)
          })
        }
      </div>
    </div>
  )
}

export default LostListPage