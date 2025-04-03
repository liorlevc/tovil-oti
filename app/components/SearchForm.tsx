'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'

interface SearchFormProps {
  onSubmit: (searchData: { keyword: string, country: string }) => void
  isLoading: boolean
}

interface FormValues {
  keyword: string
}

export default function SearchForm({ onSubmit, isLoading }: SearchFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>()

  const onFormSubmit = (data: FormValues) => {
    // Always use Israel as the country
    onSubmit({ 
      keyword: data.keyword, 
      country: 'il' 
    });
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="w-full max-w-md mx-auto">
      <div className="flex flex-col space-y-4">
        <div>
          <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-1">
            חיפוש חברת הובלה
          </label>
          <input
            id="keyword"
            type="text"
            placeholder="הובלות דירה, הובלות משרד, מוביל בחיפה..."
            className="w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 mb-3 text-right"
            {...register('keyword', {
              required: 'יש להזין מילות חיפוש',
              minLength: {
                value: 2,
                message: 'יש להזין לפחות 2 תווים'
              }
            })}
          />
          {errors.keyword && (
            <p className="mt-1 text-sm text-red-600 text-right">{errors.keyword.message}</p>
          )}
        </div>
        
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'מחפש...' : 'חיפוש חברות הובלה'}
          </button>
        </div>
        
        <div className="text-sm text-gray-500 text-right">
          <p>הזן סוג הובלה, שם חברה או מיקום לקבלת מידע על חברות הובלה.</p>
        </div>
      </div>
    </form>
  )
} 