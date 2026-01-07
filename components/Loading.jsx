'use client'
import React from 'react'

const Loading = ({ size = 'default', fullScreen = false }) => {
  const sizeClasses = {
    small: 'h-4 w-4 border-2',
    default: 'h-8 w-8 border-3',
    large: 'h-12 w-12 border-4',
    xlarge: 'h-20 w-20 border-4'
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 flex justify-center items-center bg-white/80 backdrop-blur-sm z-50'
    : 'flex justify-center items-center h-[70vh]';

  return (
    <div className={containerClasses}>
      <div className={`animate-spin rounded-full border-t-orange-500 border-gray-200 ${sizeClasses[size]}`}>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  )
}

export default Loading