'use client'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Logs from './Logs'
import { useContext } from 'react'
import DataContext from '@/context/Data/DataContext'
import BarChartWithTimestamp from './BarChart'
import Navbar from './Navbar'

function Logger({liftUp}) {
  const searchParams = useSearchParams(); 
  const [data, setData] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]); 
  const [error, setError] = useState(null);

  const {myData,setData:setMyData} = useContext(DataContext);

  const paramsString = searchParams.toString();



  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = searchParams.toString(); 
      const response = await fetch(`http://localhost:8081/messages/timestamp?interval=15`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const result = await response.json(); 
      console.log(result)
      setData(result); 

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLogs();
    }, 800);
    return () => clearTimeout(timer)
  }, []); 

  useEffect(()=>{

    if (!data || data.length === 0) {
      setFilteredData([]);
      return;
    }

    const isError = searchParams.get('Error');
    const isInfo = searchParams.get('info');
    const isWarn = searchParams.get('Warn');
    const isPyEditorial = searchParams.get('PyEditorial');
    const isMatchFetcher = searchParams.get('Match_fetcher');
    // console.log(isPyEditorial);
    let filtered = [...data];

    let filteredNew = filtered.filter((item)=>{
      return (((isError=='true') ? item.message.includes('ERROR'):false) || ((isInfo=='true') ? item.message.includes('INFO'):false) || ((isWarn=='true') ? item.message.includes('WARN'):false )) && (((isPyEditorial=='true') ? item.message.includes('django'):false ) || ((isMatchFetcher=='true') ? !item.message.includes('django'):false ) )
    });
    setFilteredData(filteredNew);
    liftUp(filteredNew);
    setMyData(filteredNew);
    console.log(filteredNew);
  },[data, paramsString])


  return (
    <>
    {/* <Navbar liftUp={setData} /> */}
    <BarChartWithTimestamp data = {myData}/>
    <div className='flex-1 my-4'>
      <div className='w-full grid grid-cols-[1fr_1fr_1fr_0.5fr_3fr] bg-gray-300/50 px-2 py-4 rounded-lg'>
        <h2 className='px-2'>Date</h2>
        <h2 className='px-2'>Host</h2>
        <h2 className='px-2'>Service</h2>
        <h2 className='px-2'>Status</h2>
        <h2 className='px-2'>Message</h2>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        myData?.map((d, index) => (
          <Logs key={index} log={d} />
        ))
      )}
    </div>
    </>
  )
}

export default Logger;
