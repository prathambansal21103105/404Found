import React from 'react'

function Logs({log}) {

  const message = log['message'];
  let status = 'DEBUG'

  if(message.includes('INFO')){
    status = 'INFO'
  }
  else if(message.includes('WARN')){
    status = 'WARN'
  }
  else if(message.includes('ERROR')){
    status = 'ERROR'
  }

  const extractDateTime = (timestamp)=>{
    const dateObj = new Date(timestamp);

    // Extract the date part (YYYY-MM-DD)
    const date = dateObj.toISOString().split('T')[0];

    // Extract the time part (HH:MM:SS)
    const time = dateObj.toISOString().split('T')[1].split('Z')[0];

    // Print or use the extracted date and time
    // console.log("Date:", date);  // Date: 2024-10-11
    // console.log("Time:", time);  // Time: 14:45:30
    return date + " " + time;
  }

  const logData = {
    'timestamp': extractDateTime(log['@timestamp']),
    'host': log['host']?.name || 'app1-7774864f89-smbdj',
    'status': status,
    'message': message,
    'service': log['message'].includes('django') ? 'PyEditorial' : 'Match Fetcher' 
  }

  return (
    <div className='w-full grid grid-cols-[1fr_1fr_1fr_0.5fr_3fr] px-2 p-1 border border-1'>
    <div className=''>{ logData.timestamp } 
        <br />
    </div>
    <div className='border border-1 px-2 p-1'>{ logData.host } </div>
    <div className='border border-1 px-2 p-1'>{ logData.service } </div>
    <div className='border border-1 px-2 p-1 whitespace-nowrap'> {/* Min width for status */}
        { logData.status } 
    </div>
    <div className='border border-1 px-2 p-1 col-span-1 text-wrap' style={{ wordBreak: 'break-all' }}> {/* Takes maximum available space */}
        { logData.message.slice(0,300) } 
    </div>
</div>
  )
}

export default Logs