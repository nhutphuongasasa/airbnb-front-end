"use client";

import { useCountries } from "@/hooks/useCountries";
import useSearchModal from "@/hooks/useSearchModal";
import { differenceInDays } from "date-fns";
import { useSearchParams } from "next/navigation";
import React, { useMemo } from "react";
import { BiSearch } from "react-icons/bi";

const Search = () => {
  // const searchModal = useSearchModal()
  const params = useSearchParams()
  const { getByValue } = useCountries()

  const startDate = params?.get('startDate')
  const locationValue = params?.get('location')
  const endDate = params?.get('endDate')
  const guestCount = params?.get('guestCount')


  const locationLabel = useMemo(() => {
    if(locationValue){
      return getByValue(locationLabel as string)?.label
    }

    return 'AnyWhere'
  },[getByValue, locationValue])

  const durationLabel = useMemo(() => {
    if (startDate && endDate) {
      const start = new Date(startDate as string);
      const end = new Date(endDate as string);
      let diff = differenceInDays(end, start);
      if (diff === 0) {
        diff = 1;
      }
      return `${diff} Days`;
    }

    return 'Any Week'

  },[startDate, endDate]);

  const guestLabel = useMemo(() => {

    if(guestCount){
      return `${guestCount} Guests`
    }

    return 'Add Guests'
  },[guestCount])

  return (
    <div className="border-[1px] w-full md:w-auto py-2 rounded-full shadow-sm hover:shadow-md transition cursor-pointer">
      <div className="flex flex-row items-center justify-between">
        <div className="text-sm font-semibold px-6">
          {locationLabel ? locationLabel : 'Any Where'}
        </div>
        <div className=" hidden sm:block text-sm font-semibold px-6 border-x-[1px] flex-1 text-center">
          {durationLabel ? durationLabel : 'Any Week'}
        </div>
        <div className="text-sm pl-6 pr-2 text-gray-600 flex flex-row items-center gap-3">
          <div className="hidden sm:block">
            {guestLabel ? guestLabel : 'Add Guests'}
          </div>
          <div className="p-2 bg-rose-500 rounded-full text-white">
            <BiSearch size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
