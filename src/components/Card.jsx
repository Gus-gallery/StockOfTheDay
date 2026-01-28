import React from 'react'
import Deets from './Deets'
import Description from './Description'
import Graph from './Graph'

const Card = () => {
  return (
    <div>
        <div className="mt-20 w-180 bg-backgroundsecondary p-4 rounded-xl shadow-lg">
            <h1 className='text-3xl font-bold text-primary text-left'>
                Stock Title
            </h1>
            
            <div className="flex flex-row items-center justify-center gap-4 mt-4 mb-4">
            <Deets />
            </div>

            <div className='flex flex-row gap-4 items-center justify-center'>
            <Graph />
            <Description />
            </div>
        </div>

    </div>
  )
}

export default Card