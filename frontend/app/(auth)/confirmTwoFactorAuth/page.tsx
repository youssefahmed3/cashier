import { ConfirmTwoFactorForm } from '@/components/confirmTwoFactorAuth/ConfirmTwoFactorForm';
import React from 'react'

const Page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <ConfirmTwoFactorForm />
    </div>
  )
}

export default Page