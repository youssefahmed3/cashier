import CustomButton from '@/components/Button/Button'
import { Clock } from 'lucide-react'
import React from 'react'

const page = () => {
  return (
    <div className='container-base'>
        <CustomButton title='Hello' icon={<Clock />} />
        asd
    </div>
  )
}

export default page