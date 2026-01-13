import React from 'react'
import Header from '../components/Header'
import PriceFilter from '../components/PriceFilter'
import PriceTable from '../components/PriceTable'
import { VehicleProvider } from '../context/VehicleContext'


const PricePage = () => {
    return (
        <div className='min-h-screen bg-gray-100'>
            <Header />
            <main className='max-w-7xl mx-auto px-4 py-6 space-y-4'>
                <VehicleProvider>
                    <PriceFilter />
                    <PriceTable />
                </VehicleProvider>
            </main>


        </div>

    )
}

export default PricePage