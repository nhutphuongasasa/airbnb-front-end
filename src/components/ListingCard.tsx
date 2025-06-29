'use client'

// import { Reservation } from '@prisma/client'
import React, { useCallback, useMemo } from 'react'
import { SafeListing, SafeReservation, SafeUser } from '../types'
import { redirect, useRouter } from 'next/navigation'
import { useCountries } from '../hooks/useCountries'
import { format } from 'date-fns'
import Image from 'next/image'
import HeaderButton from './HeaderButton'
import Button from './Button'
import axios from 'axios'

interface ListingCardProps {
  data: SafeListing,
  reservation?:  SafeReservation,
  onAction?: (id: string) => void,
  disabled?: boolean,
  actionLabel?: string,
  actionId?: string,
  currentUser?: SafeUser | null
}

const ListingCard = ({
  data,
  reservation,
  onAction,
  disabled,
  actionLabel,
  actionId,
  currentUser
}: ListingCardProps) => {
  const router = useRouter()
  const { getByValue } = useCountries()

  const location = getByValue(data.locationValue)

  const handleCancel = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()

    if (disabled){
      return
    }

    if (actionId){
      onAction?.(actionId)
    }

  }, [onAction, actionId, disabled])

  const price = useMemo(() => {
    if (reservation){
      return reservation.totalPrice
    }

    return data.price
  }, [reservation, data.price])

  const reservationDate = useMemo(() => {
    if (!reservation){
      return null
    }

    const start = new Date(reservation.startDate)
    const end = new Date(reservation.endDate)

    return `${format(start, 'PP')}-${format(end, 'PP')}`
  }, [reservation])

  return (
    <div
      onClick={() => router.push(`/listings/${data.id}`)}
      // onClick={() => {
      //   window.location.href = "http://localhost:8080/api/create-qr"
      // }}
      className='col-span-1 cursor-pointer group'>
      <div className='flex flex-col gap-2 w-full'>
        <div className='
          aspect-square
          w-full
          relative
          overflow-hidden
          rounded-xl'>
          <Image
            fill
            alt='Listing'
            src={data.imageSrc[0]}
            className='
              object-cover
              h-full
              w-full
              group-hover:scale-110
              transition
            '></Image>
            <div className='
              absolute 
              top-3 
              right-3
              '>
              <HeaderButton
                listingId={data.id}
                currentUser={currentUser}
              ></HeaderButton>
            </div>
        </div>
        <div
          className='font-semibold text-lg'>
            {location?.region}, {location?.label}
          </div>
          <div className='font-light text-neutral-500'>
            {reservationDate || data.category}
          </div>
          <div className='flex flex-row items-center gap-1'>
            <div className='font-semibold'>
              ${price}
            </div>
            {!reservation && (
              <div className='font-light'>night</div>
            )}
          </div>
          {onAction && actionLabel && (
            <Button
              disabled={disabled}
              small
              label={actionLabel}
              onClick={(e) => handleCancel(e)}
            />
          )}
      </div>
    </div>
  )
}

export default ListingCard